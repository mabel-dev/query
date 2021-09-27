import os
import sys

sys.path.insert(0, os.path.join(sys.path[0], "../../mabel/"))

import orjson
import traceback
from typing import Optional, Union
from fastapi.responses import UJSONResponse, HTMLResponse, Response
from fastapi import FastAPI, HTTPException, Request
import uvicorn
from mabel.logging import get_logger, set_log_name
from mabel.utils.common import build_context

from mabel.errors import DataNotFoundError


def find_path(path):
    import glob

    paths = glob.glob(f"/app/src/**/{path}", recursive=True)
    if len(paths) == 0:
        paths = glob.glob(f"**/{path}", recursive=True)
    for i in paths:
        if i.endswith(path):
            get_logger().info(f"Found `{path}` at `{i}`")
            return i
    get_logger().error(f"Did not find `{path}`")


context = build_context()
set_log_name(context["job_name"])
logger = get_logger()
logger.setLevel(5)

import datetime
from pydantic import BaseModel

RESULT_BATCH = int(context.get("maximum_return")) or 5000


class SearchModel(BaseModel):
    start_date: Optional[
        Union[datetime.datetime, datetime.date]
    ] = datetime.date.today()
    end_date: Optional[Union[datetime.datetime, datetime.date]] = datetime.date.today()
    query: Optional[str] = ""


from mabel.data.readers.internals.sql_reader import SqlReader
from mabel.adapters.disk import DiskReader


def do_search(search: SearchModel):

    raw_path = False
    inner_reader = None

    # K_SERVICE is a K8s flag
    if os.environ.get("K_SERVICE") is None:
        raw_path = True
        inner_reader = DiskReader

    sql_reader = SqlReader(
        start_date=search.start_date,
        end_date=search.end_date,
        sql_statement=search.query,
        raw_path=raw_path,
        inner_reader=inner_reader,
        project="dcsgva-data-prd",
    )
    return sql_reader


from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


# set up API interface
application = FastAPI()
templates = Jinja2Templates(directory=find_path("templates"))
application.mount("/dist", StaticFiles(directory=find_path("dist")), name="static/dist")
application.mount(
    "/plugins", StaticFiles(directory=find_path("plugins")), name="static/plugins"
)


def serialize_response(response, max_records):
    i = -1
    for i, record in enumerate(response):
        if i == max_records:
            break
        if hasattr(record, "mini"):
            yield record.mini + b"\n"
        else:
            yield orjson.dumps(record) + b"\n"
    if i == -1:
        raise HTTPException(status_code=204)


@application.post("/v1/search")
def handle_start_request(request: SearchModel):
    try:
        results = do_search(request)
        response = Response(
            b"\n".join(serialize_response(results, RESULT_BATCH)),
            media_type="application/jsonlines",
        )
        return response

    except HTTPException:
        raise
    except DataNotFoundError as err:

        raise HTTPException(status_code=404, detail="Dataset not Found")
    except Exception as err:
        trace = traceback.format_exc()
        error_message = {"error": type(err).__name__, "detail": str(err)}
        logger.error(f"Error {type(err).__name__} - {err}:\n{trace}")
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        trace = traceback.format_exc()
        logger.alert(f"Fatal Error {type(err).__name__} - {err}:\n{trace}")
        raise HTTPException(status_code=500, detail=err)


@application.get("/v1/datastores", response_class=UJSONResponse)
def handle_start_request(datastore: Optional[str] = None):
    try:
        if not datastore:
            return context["datastores"]
        if not datastore in context["datastores"]:
            return "Datastore Doesn't Exist"

    except HTTPException:
        raise
    except Exception as err:
        trace = traceback.format_exc()
        error_message = {"error": type(err).__name__, "detail": str(err)}
        logger.error(f"Error {type(err).__name__} - {err}:\n{trace}")
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        trace = traceback.format_exc()
        logger.alert(f"Fatal Error {type(err).__name__} - {err}:\n{trace}")
        raise HTTPException(status_code=500, detail=err)


from fastapi.responses import StreamingResponse
from mabel.data import DictSet, STORAGE_CLASS


def join_lists(list_a, list_b):
    yield from list_a
    yield from list_b


from internals.drivers.csv_writer import csv_set


@application.post("/download/")
def download_results(request: SearchModel):

    try:
        request = SearchModel(
            start_date=request.start_date,
            end_date=request.end_date,
            query=request.query,
        )
        results = do_search(request)

        # this allows us to get the columns from the first 100 records,
        # if the data is more hetreogenous than that, it's not going to
        # play well with being in a table

        temp_head = results.take(100).collect()

        head_results = DictSet(temp_head)
        columns = head_results.keys()

        # add the records back
        back_together = join_lists(temp_head, results)

        response = StreamingResponse(
            csv_set(back_together, columns), media_type="text/csv"
        )
        response.headers["Content-Disposition"] = "attachment; filename=export.csv"

        return response

    except Exception as err:
        error_message = {"error": type(err).__name__, "detail": str(err)}
        logger.error(error_message)
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        logger.alert(err)
        raise HTTPException(status_code=500, detail=err)


@application.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@application.get("/help.html", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("help.html", {"request": request})


# tell the server to start
if __name__ == "__main__":
    uvicorn.run(
        "main:application",
        host="0.0.0.0",  # nosec - targetting CloudRun
        port=int(os.environ.get("PORT", 8080)),
        lifespan="on",
    )

"""
Search Backend

"""
from glob import glob
import os
import sys
import traceback

sys.path.insert(0, os.path.join(sys.path[0], "../../mabel/"))


from typing import Optional, Union, List, Any
from fastapi.responses import UJSONResponse, HTMLResponse
from fastapi import FastAPI, HTTPException, Request
import os
import uvicorn
from mabel.logging import get_logger, set_log_name
from mabel.utils.common import build_context


def find_path(path):
    import glob
    paths = glob.iglob(f"**/{path}", recursive=True)
    for i in paths:
        if i.endswith(path):
            return i


context = build_context()
set_log_name(context["job_name"])
logger = get_logger()
get_logger().setLevel(5)

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

    if "PARQUET" in search.query.upper():
        import duckdb
        conn = duckdb.connect()

        import gcsfs
        import google.auth
        import pyarrow.parquet

        gcs_bucket_name = 'mabel'
        GCP_Project_Name = 'mabel_data'

        gs_path = "gs://mabel_data/PARQUET/*.parquet"
        gs_path = search.query

        credentials, _ = google.auth.default()
        fs_gcs = gcsfs.GCSFileSystem(project=GCP_Project_Name, token=credentials)
        arrow_data = pyarrow.parquet.read_table(gs_path, filesystem=fs_gcs)
        s = conn.register_arrow("tweets", arrow_data)

        res = conn.execute(search.query)
        for i in range(10):
            print(res.fetchone())

    else:
        sql_reader = SqlReader(
            start_date=search.start_date,
            end_date=search.end_date,
            sql_statement=search.query,
            #inner_reader=DiskReader,
            raw_path=True,
            project=os.environ.get("PROJECT_NAME"),
        )
        return sql_reader.reader


from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates





# set up API interface
application = FastAPI()
templates = Jinja2Templates(directory=find_path("templates"))
application.mount("/dist", StaticFiles(directory=find_path("dist")), name="static/dist")
application.mount(
    "/plugins", StaticFiles(directory=find_path("plugins")), name="static/plugins"
)


@application.post("/v1/search", response_class=UJSONResponse)
def handle_start_request(request: SearchModel):
    try:
        results = do_search(request)
        response = {
            "results": results.take(RESULT_BATCH).collect(),
            "cursor": results.cursor(),
            "record_count": results.count(),
        }
        return response
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


@application.get("/v1/datastores", response_class=UJSONResponse)
def handle_start_request(datastore:Optional[str]=None):
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
from mabel import DictSet


def join_lists(list_a, list_b):
    yield from list_a
    yield from list_b


from internals.csv_writer import csv_set


@application.get("/download/{start_date}/{end_date}/{query}")
def download_results(start_date: datetime.date, end_date: datetime.date, query: str):

    try:
        request = SearchModel(start_date=start_date, end_date=end_date, query=query)
        results = do_search(request)

        # this allows us to get the columns from the first 100 records,
        # if the data is more hetreogenous than that, it's not going to
        # play well with being in a table
        head_results = DictSet(results.take(100).collect())
        columns = head_results.keys()

        # add the records back
        back_together = join_lists(head_results, results)

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
        lifespan='on'
    )
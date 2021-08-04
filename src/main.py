"""
Search Backend

"""
from typing import Optional, Union, List, Any
from fastapi.responses import UJSONResponse, HTMLResponse
from fastapi import FastAPI, HTTPException, Request
import os
import uvicorn
from mabel.logging import get_logger, set_log_name

set_log_name("SEARCH API")
logger = get_logger()

import datetime
from pydantic import BaseModel

class FilterModel(BaseModel):
    field: str
    operator: str
    value: Any

class SearchModel(BaseModel):
    start_date: Optional[Union[datetime.datetime,datetime.date]] = datetime.date.today()
    end_date: Optional[Union[datetime.datetime,datetime.date]] = datetime.date.today()
    filters: Optional[List[FilterModel]] = []
    query: Optional[str] = ''
    cursor: Optional[str] = None
    page_size: Optional[int] = 100


from mabel.data.readers.internals.alpha_sql_reader import SqlReader
from mabel.adapters.disk import DiskReader

def do_search(search: SearchModel):

    search.page_size = min(1000, search.page_size)
    search.page_size = max(1, search.page_size)

    sql_reader = SqlReader(
        start_date = search.start_date,
        end_date = search.end_date,
        cursor = search.cursor,
        sql_statement=search.query,

        #inner_reader = DiskReader,
        #raw_path = True,

        project = os.environ.get("PROJECT_NAME"),
    )
    return sql_reader.reader

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

def find_path(path):
    import glob
    paths = glob.iglob(f"**/{path}", recursive=True)
    for i in paths:
        if i.endswith(path):
            return i

# set up API interface
application = FastAPI()
templates = Jinja2Templates(directory=find_path('templates'))
application.mount("/dist", StaticFiles(directory=find_path('dist')), name="static/dist")
application.mount("/plugins", StaticFiles(directory=find_path('plugins')), name="static/plugins")

@application.post("/v1/search", response_class=UJSONResponse)
def handle_start_request(request: SearchModel):
    try:
        results = do_search(request)
        response = {
            "results": results.take(request.page_size).collect(),
            "cursor": results.cursor(),
            "record_count": results.count()
            }
        return response
    except Exception as err:
        error_message = { "error": type(err).__name__, "detail": str(err) }
        logger.error(error_message)
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        logger.alert(err)
        raise HTTPException(status_code=500, detail=err)


@application.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# tell the server to start
if __name__ == "__main__":
    uvicorn.run(
        "main:application",
        host="0.0.0.0",  # nosec - targetting CloudRun
        port=int(os.environ.get("PORT", 8080)),
    )

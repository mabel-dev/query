import os
import sys

sys.path.insert(0, os.path.join(sys.path[0], "../../opteryx/"))
#sys.path.insert(0, os.path.join(sys.path[0], "../../mabel@0.6/"))

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
#from mabel.logging import get_logger, set_log_name
from internals.helpers.paths import find_path
from routers import search, users

RESULT_BATCH = 5000

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# set up API interface
os.environ["TZ"] = "UTC"
version = os.getenv("SHORT_SHA", "local")
application = FastAPI(title="Query")
templates = Jinja2Templates(directory=find_path("templates"))
application.mount("/dist", StaticFiles(directory=find_path("dist")), name="static/dist")
application.mount(
    "/plugins", StaticFiles(directory=find_path("plugins")), name="static/plugins"
)


@application.get("/", response_class=HTMLResponse)
def home(request: Request):
    """
    This is a single page app, we deliver a single HTML page and interact
    with the backend using APIs.
    """
    return templates.TemplateResponse("index.html", {"request": request})

@application.get("/arrow", response_class=HTMLResponse)
def home(request: Request):
    """
    This is a single page app, we deliver a single HTML page and interact
    with the backend using APIs.
    """
    return templates.TemplateResponse("wow.html", {"request": request})


application.include_router(search.router)
application.include_router(users.router)


# tell the server to start
if __name__ == "__main__":
    uvicorn.run(
        "main:application",
        host="0.0.0.0",  # nosec - targetting CloudRun
        port=int(os.environ.get("PORT", 8080)),
        lifespan="on",
    )

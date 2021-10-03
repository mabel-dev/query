import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import UJSONResponse
from mabel.logging import get_logger, set_log_name
from mabel.errors import DataNotFoundError
from mabel.utils.common import build_context


context = build_context()
router = APIRouter()
set_log_name("QUERY")
logger = get_logger()
logger.setLevel(5)


@router.get("/v1/datastores/list", response_class=UJSONResponse)
def handle_start_request():
    try:
        project = os.environ.get("PROJECT_NAME", "LOCAL")
        environments = context["environments"][project]
        return {"stores": environments["datastores"]}

    except HTTPException:
        raise
    except DataNotFoundError as err:
        # NOT FOUND
        raise HTTPException(status_code=404, detail="Dataset not Found")
    except Exception as err:
        import traceback

        trace = traceback.format_exc()
        error_message = {"error": type(err).__name__, "detail": str(err)}
        logger.error(f"Error {type(err).__name__} - {err}:\n{trace}")
        # I'M A TEAPOT
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        import traceback

        trace = traceback.format_exc()
        logger.alert(f"Fatal Error {type(err).__name__} - {err}:\n{trace}")
        # ERROR
        raise HTTPException(status_code=500, detail=err)

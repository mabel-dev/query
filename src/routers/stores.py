from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import UJSONResponse
from mabel.logging import get_logger, set_log_name
from mabel.errors import DataNotFoundError


router = APIRouter()
set_log_name("QUERY")
logger = get_logger()
logger.setLevel(5)


@router.get("/v1/datastores", response_class=UJSONResponse)
def handle_start_request(datastore: Optional[str] = None):
    try:
        return {"stores": []}

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

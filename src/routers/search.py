import orjson
from fastapi import APIRouter, HTTPException, Response, Request
from mabel.logging import get_logger
from mabel.errors import DataNotFoundError
from internals.models import SearchModel
from internals.helpers.search import do_search


router = APIRouter()
logger = get_logger()


RESULT_BATCH = 2000


def serialize_response(response, max_records):
    """
    Get the response as byte strings, depending on the type of the incoming
    object, the fastest way to do this is different.
    """
    i = -1
    for i, record in enumerate(response):
        if i == max_records:
            break
        if hasattr(record, "mini"):
            # we have a saved minified json string
            yield record.mini + b"\n"
        else:
            yield orjson.dumps(record) + b"\n"
    if i == -1:
        # UNABLE TO SATISFY RANGE
        raise HTTPException(status_code=416)


@router.post("/v1/search")
def search(search: SearchModel, request: Request):
    try:

        from internals.helpers.identity import get_identity
        #print(request.headers)
        logger.audit({**search.dict(), "user": get_identity(request)})

        results = do_search(search)
        response = Response(
            b"\n".join(serialize_response(results, RESULT_BATCH)),
            media_type="application/jsonlines",
        )
        return response

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
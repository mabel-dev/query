import datetime

import opteryx.connectors
import orjson
from fastapi import APIRouter, HTTPException, Request, Response
from internals.models import SearchModel


class DataNotFoundError(Exception):
    pass


router = APIRouter()


RESULT_BATCH = 2000

##########################################################################


def fix_dict(obj: dict) -> dict:
    def fix_fields(dt):
        dt_type = type(dt)
        if dt_type in (int, float, bool, str):
            return dt
        if dt_type in (datetime.date, datetime.datetime):
            return dt.isoformat()
        if dt_type == dict:
            return str(fix_dict(dt))
        if dt_type == bytes:
            return dt.decode("UTF8")
        return str(dt)

    if not isinstance(obj, dict):
        return obj  # type:ignore

    for key in obj.keys():
        obj[key] = fix_fields(obj[key])
    return obj


########################################################################


def serialize_response(response, max_records):
    """
    Get the response as byte strings, depending on the type of the incoming
    object, the fastest way to do this is different.
    """
    i = -1
    for i, record in enumerate(response):
        if i > max_records:
            break
        elif i < max_records:
            yield record.as_json + b"\n"
    if i == -1:
        # UNABLE TO SATISFY RANGE
        raise HTTPException(status_code=416)
    if i > max_records:
        yield b'{"more_records": true}'


@router.post("/v1/search")
def search(search: SearchModel, request: Request):
    try:
        from internals.helpers.identity import get_identity, get_jwt

        encoded_jwt = get_jwt(request)

        import opteryx
        from opteryx.connectors import GcpCloudStorageConnector
        from opteryx.managers.schemes import MabelPartitionScheme

        opteryx.register_store(
            "mabel_data",
            GcpCloudStorageConnector,
            partition_scheme=MabelPartitionScheme,
        )
        conn = opteryx.connect()
        cur = conn.cursor()
        cur.execute(search.query)

        body = b"\n".join(serialize_response(cur.fetchmany(100), RESULT_BATCH))
        response = Response(
            body,
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
        print(f"Error {type(err).__name__} - {err}:\n{trace}")
        # I'M A TEAPOT
        raise HTTPException(status_code=418, detail=error_message)
    except SystemExit as err:
        import traceback

        trace = traceback.format_exc()
        print(f"Fatal Error {type(err).__name__} - {err}:\n{trace}")
        # ERROR
        raise HTTPException(status_code=500, detail=err)

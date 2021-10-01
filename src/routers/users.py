from fastapi import APIRouter, Request
from fastapi.responses import UJSONResponse
from mabel.logging import get_logger, set_log_name


router = APIRouter()
set_log_name("QUERY")
logger = get_logger()
logger.setLevel(5)


@router.get("/user", response_class=UJSONResponse)
def get_user_informations(request: Request):
    """
    Get User information
    """
    from internals.helpers.identity import get_jwt, get_identity

    encoded_jwt = get_jwt(request)
    return {
        "identity": get_identity(encoded_jwt),
        "saved_queries": [],
        "shared_queries": [],
    }

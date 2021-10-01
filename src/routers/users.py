from fastapi import APIRouter, Request
from fastapi.responses import UJSONResponse
from mabel.logging import get_logger


router = APIRouter()
logger = get_logger()



@router.get("/user", response_class=UJSONResponse)
def get_user_informations(request: Request):
    """
    Get User information
    """
    from ..internals.helpers.identity import get_identity
    return {
        "identity": get_identity(request),
        "saved_queries": [],
        "shared_queries": []
    }
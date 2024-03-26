from fastapi import APIRouter, Request
from fastapi.responses import UJSONResponse

router = APIRouter()


@router.get("/user", response_class=UJSONResponse)
def get_user_informations(request: Request):
    """
    Get User information
    """
    from internals.helpers.identity import get_identity, get_jwt

    encoded_jwt = get_jwt(request)
    return {"identity": get_identity(encoded_jwt), "saved_queries": []}

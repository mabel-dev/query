from fastapi import APIRouter, Request
from fastapi.responses import UJSONResponse
from mabel.logging import get_logger
from internals.drivers.csv_writer import csv_set


router = APIRouter()
logger = get_logger()



def get_identity(request):
    try:
        import jwt

        encoded_jwt = None

        if "Authorization" in request.headers:
            # if we have a auth header, use that regardless of a cookie value
            encoded_jwt = request.headers["Authorization"].split(' ')[1]
        else:
            # the name of the cookie isn't fixed, try to find it
            for cookie in request.cookies:
                if cookie.startswith("GCP_IAAP_AUTH_TOKEN"):
                    encoded_jwt = request.cookies[cookie]
                    break

        if encoded_jwt:
            decoded_jwt = jwt.decode(encoded_jwt, options={"verify_signature": False})
            return decoded_jwt["email"]
        return "unknown"
    except Exception as e:
        return "error"


@router.get("/user", response_class=UJSONResponse)
def get_user_informations(request: Request):
    """
    Get User information
    """
    return {
        "identity": get_identity(request),
        "saved_queries": [],
        "shared_queries": []
    }
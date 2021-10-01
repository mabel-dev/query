
def get_jwt(request):
    encoded_jwt = None

    if "Authorization" in request.headers:
        # if we have a auth header, use that regardless of a cookie value
        encoded_jwt = request.headers["Authorization"].split(' ')[1]
    else:
        # the name of the cookie isn't always the same, try to find it
        for cookie in request.cookies:
            if cookie.startswith("GCP_IAAP_AUTH_TOKEN"):
                encoded_jwt = request.cookies[cookie]
                break

    return encoded_jwt


def get_identity(encoded_jwt):
    try:
        import jwt

        if encoded_jwt:
            decoded_jwt = jwt.decode(encoded_jwt, options={"verify_signature": False})
            return decoded_jwt["email"]
        return "unknown"
    except Exception as e:
        return "error"


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
            decoded_jwt = jwt.get_unverified_header(encoded_jwt)
            return decoded_jwt["email"]
        return "unknown"
    except:
        return "error"
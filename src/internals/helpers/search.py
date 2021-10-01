import os
from mabel.data.readers import SqlReader
from internals.models import SearchModel

def do_search(search: SearchModel, auth_token = None):

    raw_path = False
    inner_reader = None

    # K_SERVICE is a K8s flag, without it we're probably running locally
    if os.environ.get("K_SERVICE") is None:
        from mabel.adapters.disk import DiskReader
        raw_path = True
        inner_reader = DiskReader

    jwt = None
    if auth_token:
        import google.auth.jwt
        #jwt.token = auth_token
        google.auth.jwt.load

    sql_reader = SqlReader(
        start_date=search.start_date,
        end_date=search.end_date,
        sql_statement=search.query,
        raw_path=raw_path,
        inner_reader=inner_reader,
        project="dcsgva-data-prd",
        credentials=auth_token
    )
    return sql_reader
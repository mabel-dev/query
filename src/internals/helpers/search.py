import os
from mabel.data.readers import SqlReader
from internals.models import SearchModel

def do_search(search: SearchModel):

    raw_path = False
    inner_reader = None

    # K_SERVICE is a K8s flag, without it we're probably running locally
    if os.environ.get("K_SERVICE") is None:
        from mabel.adapters.disk import DiskReader
        raw_path = True
        inner_reader = DiskReader

    sql_reader = SqlReader(
        start_date=search.start_date,
        end_date=search.end_date,
        sql_statement=search.query,
        raw_path=raw_path,
        inner_reader=inner_reader,
        project="dcsgva-data-prd",
    )
    return sql_reader
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from mabel import DictSet
from mabel.logging import get_logger, set_log_name
from mabel.errors import DataNotFoundError
from internals.models import SearchModel
from internals.helpers.search import do_search
from internals.drivers.csv_writer import csv_set


router = APIRouter()
set_log_name("QUERY")
logger = get_logger()
logger.setLevel(5)


def join_lists(list_a, list_b):
    yield from list_a
    yield from list_b


@router.post("/download/")
def download_results(request: SearchModel):

    try:
        request = SearchModel(
            start_date=request.start_date,
            end_date=request.end_date,
            query=request.query,
        )
        results = do_search(request)

        # this allows us to get the columns from the first 100 records,
        # if the data is more hetreogenous than that, it's not going to
        # play well with being in a table

        temp_head = results.take(100).collect()

        head_results = DictSet(temp_head)
        columns = head_results.keys()

        # add the records back
        back_together = join_lists(temp_head, results)

        response = StreamingResponse(
            csv_set(back_together, columns), media_type="text/csv"
        )
        response.headers["Content-Disposition"] = "attachment; filename=export.csv"

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
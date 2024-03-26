import datetime
from typing import Optional, Union

from pydantic import BaseModel


class SearchModel(BaseModel):
    start_date: Optional[
        Union[datetime.datetime, datetime.date]
    ] = datetime.date.today()
    end_date: Optional[Union[datetime.datetime, datetime.date]] = datetime.date.today()
    query: Optional[str] = ""

from pydantic import BaseModel
from typing import Optional, Union
import datetime


class SearchModel(BaseModel):
    start_date: Optional[
        Union[datetime.datetime, datetime.date]
    ] = datetime.date.today()
    end_date: Optional[Union[datetime.datetime, datetime.date]] = datetime.date.today()
    query: Optional[str] = ""

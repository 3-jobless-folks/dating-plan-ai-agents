from pydantic import BaseModel


class Schedule(BaseModel):
    index_id: int
    user_id: str
    date: str
    activity: str

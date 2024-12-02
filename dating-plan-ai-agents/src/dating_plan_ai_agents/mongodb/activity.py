from pydantic import BaseModel


class Activity(BaseModel):
    activity: str
    location: str
    time: str
    description: str
    cost: int

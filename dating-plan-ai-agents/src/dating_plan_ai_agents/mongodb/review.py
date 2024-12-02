from pydantic import BaseModel, field_validator
from typing import Any


# Define the Pydantic model class for data validation
class Review(BaseModel):
    index_id: int
    caption: str
    name: str
    overall_rating: Any
    category: Any
    opening_hours: Any

    @property
    def index_id(self):
        return self.index_id

    @index_id.setter
    def index_id(self, value):
        self.index_id = value

    @property
    def caption(self):
        return self.caption

    @caption.setter
    def caption(self, value):
        self.caption = value

    @property
    def name(self):
        return self.name

    @name.setter
    def name(self, value):
        self.name = value

    @property
    def overall_rating(self):
        return self.overall_rating

    @overall_rating.setter
    def overall_rating(self, value):
        self.overall_rating = value

    @property
    def category(self):
        return self.category

    @category.setter
    def category(self, value):
        self.category = value

    @property
    def opening_hours(self):
        return self.opening_hours

    @opening_hours.setter
    def opening_hours(self, value):
        self.opening_hours = value

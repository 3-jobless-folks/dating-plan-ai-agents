from pydantic import BaseModel, field_validator


# Define the Pydantic model class for data validation
class Review(BaseModel):
    index_id: int
    caption: str
    name: str
    overall_rating: float
    category: str
    opening_hours: str

    # Validation for overall_rating (ensure it's between 1 and 5)
    @field_validator("overall_rating")
    def check_rating_range(cls, v):
        if not (1 <= v <= 5):
            raise ValueError("Overall rating must be between 1 and 5")
        return v

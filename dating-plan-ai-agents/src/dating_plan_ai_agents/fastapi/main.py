# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
import json


app = FastAPI()

# Allow CORS for the frontend (React app on port 3000)
origins = [
    "http://localhost:3000",  # Frontend URL (adjust if necessary)
    "http://127.0.0.1:3000",  # For local testing
]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define a Pydantic model to parse input
class DatePlanRequest(BaseModel):
    start_time: Optional[str] = None  # Start time
    end_time: Optional[str] = None  # End time
    indoor_outdoor: Optional[str] = None  # Indoor or outdoor preference
    country: Optional[str] = None  # Country
    budget: Optional[str] = None  # User's budget
    food_preference: Optional[str] = None  # Food preferences (e.g., vegetarian, etc.)
    activity_preference: Optional[str] = (
        None  # Activity preference (e.g., relaxing, adventurous)  ##
    )


@app.post("/plan")
async def create_plan(request: DatePlanRequest):
    # Here you would process the multi-agent loop
    start_time = request.start_time
    end_time = request.end_time
    indoor_outdoor = request.indoor_outdoor
    country = request.country
    budget = request.budget
    food_preference = request.food_preference
    activity_preference = request.activity_preference

    # Simulate multi-agent process
    # For simplicity, assume we return a simple JSON string
    final_plan = {
        "activities": [
            {
                "activity": "Dinner at Italian Restaurant",
                "location": "Romeo's Italian Bistro",
                "time": "18:00 - 20:00",
                "description": "A romantic dinner with fine Italian cuisine.",
                "cost": 50,
            },
            {
                "activity": "Walk in the Park",
                "location": "Central Park",
                "time": "20:15 - 21:00",
                "description": "A peaceful stroll through the park, enjoying the night air.",
                "cost": 0,
            },
        ]
    }

    return {"result": final_plan}  # Return the result as formatted JSON

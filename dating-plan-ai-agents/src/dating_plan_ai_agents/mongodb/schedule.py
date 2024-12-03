from pydantic import BaseModel, Field
from typing import List, Optional
from dating_plan_ai_agents.mongodb.activity import Activity
from datetime import datetime
from uuid import uuid4


class Schedule(BaseModel):
    index_id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: Optional[str] = None
    total_iterations: Optional[int] = None
    input_feedback: Optional[str] = None  # Feedback from InputValidator
    location_feedback: Optional[str] = None  # Feedback from LocationSelector
    budget_feedback: Optional[str] = None  # Feedback from BudgetReviewer
    schedule_feedback: Optional[str] = None  # Feedback from Scheduler
    final_schedule: Optional[str] = None  # Final schedule

    # Additional fields for the user inputs
    start_time: Optional[str] = None  # Start time
    end_time: Optional[str] = None  # End time
    indoor_outdoor: Optional[str] = None  # Indoor or outdoor preference
    country: Optional[str] = None  # Country
    budget: Optional[str] = None  # User's budget
    food_preference: Optional[str] = None  # Food preferences (e.g., vegetarian, etc.)
    activity_preference: Optional[str] = (
        None  # Activity preference (e.g., relaxing, adventurous)
    )
    other_requirements: Optional[str] = None
    activities: List[Activity]
    created_at: datetime

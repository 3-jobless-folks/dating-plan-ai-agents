from typing import TypedDict, Optional


class GraphState(TypedDict):
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
    country: Optional[int] = None  # Country
    budget: Optional[float] = None  # User's budget
    food_preference: Optional[str] = None  # Food preferences (e.g., vegetarian, etc.)
    activity_preference: Optional[str] = (
        None  # Activity preference (e.g., relaxing, adventurous)
    )

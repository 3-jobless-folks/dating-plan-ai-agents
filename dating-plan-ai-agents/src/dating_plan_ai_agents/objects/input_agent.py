from dating_plan_ai_agents.objects.base_agent import BaseAgent
from dating_plan_ai_agents.objects.state import GraphState
import logging

logger = logging.getLogger(__name__)


class InputValidator(BaseAgent):

    def __init__(self):
        super().__init__()
        self.start_time = None
        self.end_time = None
        self.indoor_outdoor = None
        self.country = None
        self.budget = None
        self.food_preference = None
        self.activity_preference = None
        self.other_requirements = None
        self.reviewer_prompt = (
            "Please validate the following user inputs.\n"
            "Fill in a valid input for all invalid inputs based on your best discretion.\n"
            "Once all inputs are valid and available, "
            "provide a summary of the validated inputs.\n"
            "Consider the following factors for location suggestions:\n"
            "1. Start time (Time the date should start)\n"
            "2. End time (Time the date should end)\n"
            "3. Indoor or outdoor preference\n"
            "4. Country for the date (e.g., France, Singapore, etc.)\n"
            "5. Total budget set for the date\n"
            "6. Food preferences (e.g Vegetarian, etc.)\n"
            "7. Activity preferences (e.g., relaxing, adventurous)\n"
            "Inputs: {user_input}"
        )

    def _get_additional_state(self, state: GraphState):
        # Collect the necessary inputs from the state
        self.start_time = state.get("start_time", "")
        self.end_time = state.get("end_time", "")
        self.indoor_outdoor = state.get("indoor_outdoor", "")
        self.country = state.get("country", "")
        self.budget = state.get("budget", "")
        self.food_preference = state.get("food_preference", "")
        self.activity_preference = state.get("activity_preference", "")
        self.other_requirements = state.get("other_requirements", "")

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        self._get_additional_state(state)
        user_input = (
            f"Start Time: {self.start_time}, End Time: {self.end_time}, "
            f"Indoor/Outdoor Preference: {self.indoor_outdoor}, "
            f"Country of activities: {self.country}, "
            f"Budget: {self.budget}, "
            f"Food Preference: {self.food_preference}, "
            f"Activity Preference: {self.activity_preference}, "
            f"Other Requirements: {self.other_requirements}"
        )
        custom_params = {
            "user_input": user_input,
        }
        logger.info("=" * 50)
        logger.info(
            "=" * 20
            + " Current iteration: "
            + str(state.get("total_iterations"))
            + " "
            + "=" * 20
        )

        self.input_feedback = self._parse_query(self.reviewer_prompt, custom_params)
        logger.info("=" * 50)

        return {
            "input_feedback": self.input_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
            "start_time": self.start_time,
            "end_time": self.end_time,
            "indoor_outdoor": self.indoor_outdoor,
            "country": self.country,
            "budget": self.budget,
            "food_preference": self.food_preference,
            "activity_preference": self.activity_preference,
            "other_requirements": self.other_requirements,
        }

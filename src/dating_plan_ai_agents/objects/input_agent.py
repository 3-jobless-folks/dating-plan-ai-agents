from dating_plan_ai_agents.objects.base_agent_untested import BaseAgent
from dating_plan_ai_agents.objects.state import GraphState


class InputValidator(BaseAgent):
    def __init__(self, llm_caller):
        super().__init__()
        self.llm_caller = llm_caller
        self.start_time = None
        self.end_time = None
        self.indoor_outdoor = None
        self.country = None
        self.budget = None
        self.food_preference = None
        self.activity_type = None
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
            "Inputs: {}"
        )

    @property
    def revierwer_prompt(self):
        return self.reviewer_prompt

    @revierwer_prompt.setter
    def revierwer_prompt(self, value):
        self.reviewer_prompt = value

    def _get_current_state(self, state: GraphState):
        # Collect the necessary inputs from the state
        self.start_time = state.get("start_time", "")
        self.end_time = state.get("end_time", "")
        self.indoor_outdoor = state.get("indoor_outdoor", "")
        self.country = state.get("country", "")
        self.budget = state.get("budget", "")
        self.food_preference = state.get("food_preferences", "")
        self.activity_type = state.get("activity_type", "")

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        user_input = (
            f"Start Time: {self.start_time}, End Time: {self.end_time}, "
            f"Indoor/Outdoor Preference: {self.indoor_outdoor}, "
            f"Country of activities: {self.country}, "
            f"Budget: {self.budget}, "
            f"Food Preference: {self.food_preference}, "
            f"Activity Type: {self.activity_type}, "
        )
        custom_params = {
            "user_input": user_input,
        }
        results = self._parse_query(
            state, query=self.reviewer_prompt, custom_params=custom_params
        )
        print(
            f"\nInput Feedback for iteration {state.get('total_iterations')}: {results}"
        )
        return {
            "input_feedback": results,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
            "start_time": self.start_time,
            "end_time": self.end_time,
            "indoor_outdoor": self.indoor_outdoor,
            "country": self.country,
            "budget": self.budget,
            "food_preference": self.food_preference,
            "activity_type": self.activity_type,
        }

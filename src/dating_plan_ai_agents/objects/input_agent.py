from typing import Optional
from dating_plan_ai_agents.objects.base_agent_untested import AbstractAgent


class InputValidator(AbstractAgent):
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
            "Fill in a random input for all invalid inputs.\n"
            "Once all inputs are valid and available, provide a summary of the validated inputs.\n"
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

    def _parse_query(self, state, query: str) -> str:
        # Parse the user's query into intent and additional details.
        # Collect the necessary inputs from the state
        self.start_time = state.get("start_time", "anytime")
        self.end_time = state.get("end_time", "anytime")
        self.indoor_outdoor = state.get("indoor_outdoor", "both")
        self.country = state.get("country", "Singapore")
        self.budget = state.get("budget", 200.0)
        self.food_preference = state.get("food_preferences", "No food preference")
        self.activity_type = state.get("activity_type", "relaxing")

        # Prepare the input prompt with collected user preferences
        user_input = (
            f"Start Time: {self.start_time}, End Time: {self.end_time}, "
            f"Indoor/Outdoor Preference: {self.indoor_outdoor}, "
            f"Country of activities: {self.country}, "
            f"Budget: {self.budget}, "
            f"Food Preference: {self.food_preference}, "
            f"Activity Type: {self.activity_type}, "
        )

        # Get the agent's feedback using the updated prompt
        agent_feedback = self.llm_caller.get_llm_response(query.format(user_input))
        print("\n\n\nInput Feedback:", agent_feedback)
        return agent_feedback

    def _retrieve_documents(self, query: str, top_k: int) -> list[str]:
        return NotImplementedError("Retrieve_documents not implemented")

    def _decide_action(self, parsed_query) -> str:
        return NotImplementedError("Decide_action not implemented")

    def _augment_query(self, query: str, documents: list[str]) -> str:
        return NotImplementedError("Augment_query not implemented")

    def _generate_response(self, augmented_query: str) -> str:
        return NotImplementedError("Generate_response not implemented")

    def run(self, state):
        agent_feedback = self._parse_query(state, self.reviewer_prompt)
        # Add the feedback and return the updated state
        return {
            "input_feedback": agent_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
            "start_time": self.start_time,
            "end_time": self.end_time,
            "indoor_outdoor": self.indoor_outdoor,
            "country": self.country,
            "budget": self.budget,
            "food_preference": self.food_preference,
            "activity_type": self.activity_type,
        }

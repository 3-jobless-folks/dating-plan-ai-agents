from dating_plan_ai_agents.objects.state import GraphState
from dating_plan_ai_agents.objects.base_agent import BaseAgent


class BudgetAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.budget_prompt = (
            "You are a budgeting review specialist.\n"
            "Evaluate if the proposed schedule and locations fit within the user's budget.\n"
            "Budget feedback if available: {budget_feedback}.\n"
            "Schedule Feedback if available: {schedule_feedback}.\n"
            "Location Feedback if available: {location_feedback}.\n"
            "Input Feedback if available: {input_feedback}.\n"
            "Consider additional costs such as transportation, meals, and activity fees.\n"
            "Return your analysis and recommendations:\n"
            "1. Whether the budget is sufficient.\n"
            "2. Suggestions for adjustments if needed.\n"
        )

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        custom_params = {
            "budget_feedback": self.budget_feedback,
            "schedule_feedback": self.schedule_feedback,
            "location_feedback": self.location_feedback,
            "input_feedback": self.input_feedback,
        }
        budget_feedback = self._parse_query(self.budget_prompt, custom_params)
        print(
            f"\n\n\nBudget Feedback for loop {state.get('total_iterations')}: {budget_feedback}"
        )
        # Add feedback to the state and return updated state
        return {
            "original_query": state.get("original_query", ""),
            "budget_feedback": budget_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
        }

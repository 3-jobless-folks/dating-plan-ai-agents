from dating_plan_ai_agents.objects.base_agent import BaseAgent
from dating_plan_ai_agents.objects.state import GraphState


class Evaluator(BaseAgent):

    def __init__(self, max_iterations=5):
        super().__init__()
        self.max_iterations = max_iterations
        self.evaluator_prompt = (
            "You are an evaluator tasked with assessing the feasibility of a date plan based on the following constraints:\n"
            "1. Budget Feedback: {budget_feedback}\n"
            "2. Input Feedback: {input_feedback}\n"
            "3. Location Feedback: {location_feedback}\n"
            "4. Schedule Feedback: {schedule_feedback}\n\n"
            "Please answer the following:\n"
            "a) Does the budget align with the proposed locations and activities?\n"
            "b) Are the selected locations feasible based on the schedule?\n"
            "c) Is the overall plan aligned with the user's preferences and constraints?\n\n"
            "Only output 'Yes' if all conditions are met and the plan is feasible; otherwise, output 'No'."
        )

    def run(self, state):
        self._get_current_state(state)
        custom_params = {
            "budget_feedback": self.budget_feedback,
            "schedule_feedback": self.schedule_feedback,
            "location_feedback": self.location_feedback,
            "input_feedback": self.input_feedback,
        }
        evaluator_response = self._parse_query(self.evaluator_prompt, custom_params)
        # Debugging step to verify the response
        if evaluator_response.lower() not in ["yes", "no"]:
            raise ValueError(f"Unexpected evaluator response: {evaluator_response}")
        print(
            f"\n\n\nEvaluator response for loop {state.get('total_iterations')}: {evaluator_response}"
        )

        if (
            evaluator_response.lower() == "yes"
            or state.get("total_iterations", 0) > self.max_iterations
        ):
            print(f"Going to finalize plan for loop {state.get('total_iterations')}")
            return "finalize_plan"  # All constraints satisfied; ready to finalize
        print(
            f"Going back to scheduling agent for loop {state.get('total_iterations')}"
        )
        return "scheduling_agent"  # Revisit input validation for adjustments

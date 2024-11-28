# Scheduling agent
from dating_plan_ai_agents.objects.state import GraphState
from dating_plan_ai_agents.objects.base_agent_untested import BaseAgent


class SchedulingAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.scheduling_prompt = (
            "Create a schedule for a date considering the following details: "
            "1. Edit the schedule to optimize it if there is already a schedule in : {schedule_feedback}."
            "2. Ensure the plan is feasible and aligns with the provided inputs."
            "3. Input the specific locations if available from location feedback: {location_feedback} "
            "\n If not, just general type of activities E.g. Dinner, Lunch, Supper, outdoor activity, indoor activity, etc. ."
            "4. You may take budget feedback into considerations if available: {budget_feedback}"
            "5. You may also take the validated input feedback into consideration: {input_feedback}"
        )

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        custom_params = {
            "schedule_feedback": self.schedule_feedback,
            "location_feedback": self.location_feedback,
            "budget_feedback": self.budget_feedback,
            "input_feedback": self.input_feedback,
        }
        self.schedule_feedback = self._parse_query(
            query=self.scheduling_prompt, custom_params=custom_params
        )
        print(
            f"\nFinal Schedule Feedback for loop {state.get('total_iterations')}: {self.schedule_feedback}"
        )
        return {
            "original_query": state.get("original_query", ""),
            "schedule_feedback": self.schedule_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
        }

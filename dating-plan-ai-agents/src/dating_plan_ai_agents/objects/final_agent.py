from dating_plan_ai_agents.objects.state import GraphState
from dating_plan_ai_agents.objects.base_agent import BaseAgent


class FinalPlan(BaseAgent):
    def __init__(self):
        self.final_plan_prompt = (
            "You are a planner tasked with creating a final date plan based on the following information:\n"
            "1. Location Feedback: {location_feedback}\n"
            "2. Schedule Feedback: {schedule_feedback}\n"
            "3. Budget Feedback: {budget_feedback}\n"
            "Present the date plan in a JSON object format, where each activity is an object with the following structure:\n"
            "{\n"
            '    "activities": [\n'
            "        {\n"
            '            "activity": "<activity_name>",\n'
            '            "location": "<location_name>",\n'
            '            "time": "<start_time> - <end_time>",\n'
            '            "description": "<activity_description>",\n'
            '            "cost": <activity_cost>\n'
            "        },\n"
            "        {\n"
            '            "activity": "<activity_name>",\n'
            '            "location": "<location_name>",\n'
            '            "time": "<start_time> - <end_time>",\n'
            '            "description": "<activity_description>",\n'
            '            "cost": <activity_cost>\n'
            "        }\n"
            "    ]\n"
            "}\n"
            'Each activity should be represented as an object in the "activities" array. Please ensure the JSON is valid.'
        )

    def run(self, state: GraphState):
        self._get_current_state(state)
        custom_params = {
            "location_feedback": self.location_feedback,
            "schedule_feedback": self.schedule_feedback,
            "budget_feedback": self.budget_feedback,
        }
        final_plan = self._parse_query(
            query=self.final_plan_prompt, custom_params=custom_params
        )
        print("\n\n\n")
        print("=" * 50)
        print(final_plan)
        return {
            "final_plan": final_plan,
            "total_iterations": state.get("total_iterations"),
        }

from dating_plan_ai_agents.objects.base_agent_untested import BaseAgent
from dating_plan_ai_agents.objects.state import GraphState


# Location selection agent
class LocationAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.location_prompt = (
            "Given the schedule feedback, if available from: {schedule_feedback}.\n"
            "And given the budget feedback, if available from: {budget_feedback}.\n"
            "Select suitable locations to fit into the schedule based on the user's preferences.\n"
            "Provide a brief location feedback for each location chosen. "
            "The user's preferences are: {user_input}.\n"
        )
        self.retrieval_prompt = (
            "Based on the location_feedback: {location_feedback}.\n"
            "Generate a summary or description of the user's preferences for a date\n"
        )
        self.final_location_prompt = (
            "Based on the current feedback and location suggestions: {final_query}.\n\n"
            "Generate a location feedback that summarizes the user's preferences for a date.\n"
            "You should use exact location suggestions if possible.\n"
        )
        self.budget_feedback = ""
        self.schedule_feedback = ""
        self.user_input = ""

    ### Getters and Setters to change prompt template
    @property
    def location_prompt(self):
        return self.location_prompt

    @location_prompt.setter
    def location_prompt(self, value):
        self.location_prompt = value

    @property
    def retrieval_prompt(self):
        return self.retrieval_prompt

    @retrieval_prompt.setter
    def retrieval_prompt(self, value):
        self.retrieval_prompt = value

    @property
    def final_location_prompt(self):
        return self.final_location_prompt

    @final_location_prompt.setter
    def final_location_prompt(self, value):
        self.final_location_prompt = value

    @budget_feedback.setter
    def budget_feedback(self, value):
        self.budget_feedback = value

    # Other methods
    def _get_current_state(self, state):
        self.user_input = state.get("input_feedback", "").strip()
        self.schedule_feedback = state.get("schedule_feedback", "").strip()
        self.budget_feedback = state.get("budget_feedback", "").strip()

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        custom_params_location = {
            "user_input": self.user_input,
            "schedule_feedback": self.schedule_feedback,
            "budget_feedback": self.budget_feedback,
        }
        query = self._parse_query(
            query=self.location_prompt, custom_params=custom_params_location
        ).strip()

        custom_params_retrieval = {"location_feedback": query}
        summarized_query = self._summarize_query(
            query=self.retrieval_prompt, custom_params=custom_params_retrieval
        ).strip()

        retrieved_docs = self._retrieve_documents(
            query=summarized_query, top_k=10
        )  # Retrieve docs

        augmented_query = self._augment_query(
            query=summarized_query, documents=retrieved_docs
        ).strip()  # Add docs to summarized query

        final_query = self._generate_final_query(
            original_query=query, augmented_query=augmented_query
        ).strip()  # Add original and summarized query

        final_feedback = self._parse_query(
            query=self.final_location_prompt, custom_params={"final_query": final_query}
        ).strip()

        print(
            f"\nFinal Feedback for loop {state.get('total_iterations')}: {final_feedback}"
        )
        return {
            "original_query": state.get("original_query", ""),
            "location_feedback": final_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
        }

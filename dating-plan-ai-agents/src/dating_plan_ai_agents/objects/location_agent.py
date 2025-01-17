from dating_plan_ai_agents.objects.base_agent import BaseAgent
from dating_plan_ai_agents.objects.state import GraphState
import logging

logger = logging.getLogger(__name__)

# Location selection agent
class LocationAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.location_prompt = (
            "Given the previous location suggestions if any: {location_feedback}.\n"
            "And given the schedule feedback, if available from: {schedule_feedback}.\n"
            "And given the budget feedback, if available from: {budget_feedback}.\n"
            "Select suitable locations for the user's date.\n"
            "Ensure all user preferences are taken into account.\n"
            "Provide a brief location feedback for each location chosen. "
            "The user's preferences are: {input_feedback}.\n"
        )
        self.retrieval_prompt = (
            "Based on the location_feedback: {location_feedback}.\n"
            "Generate a summary or description of the location feedback.\n"
        )
        self.final_location_prompt = (
            "Based on the current feedback and location suggestions: {final_query}.\n\n"
            "Generate a location feedback that summarizes the user's preferences for a date.\n"
            "You should use exact location suggestions if possible.\n"
        )

    # Other methods

    def run(self, state: GraphState) -> GraphState:
        self._get_current_state(state)
        custom_params_location = {
            "location_feedback": self.location_feedback,
            "input_feedback": self.input_feedback,
            "schedule_feedback": self.schedule_feedback,
            "budget_feedback": self.budget_feedback,
        }
        logger.info("=" * 50)
        logger.info(
            "=" * 20
            + " Current iteration: "
            + str(state.get("total_iterations"))
            + " "
            + "=" * 20
        )

        query = self._parse_query(self.location_prompt, custom_params_location).strip()

        custom_params_retrieval = {"location_feedback": query}
        summarized_query = self._summarize_query(
            self.retrieval_prompt, custom_params_retrieval
        ).strip()
        logger.info(f"Summarized_query:\n {summarized_query}\n\n\n")
        retrieved_docs = self._retrieve_documents(
            query=summarized_query, top_k=10
        )  # Retrieve docs
        logger.info(f"Documents retrieved:\n {retrieved_docs}\n\n\n")

        augmented_query = self._augment_query(
            query=summarized_query, documents=retrieved_docs
        ).strip()  # Add docs to summarized query

        final_query = self._generate_final_query(
            original_query=query, augmented_query=augmented_query
        ).strip()  # Add original and summarized query
        logger.info(f"final_query: {final_query}")
        self.location_feedback = self._parse_query(
            self.final_location_prompt, {"final_query": final_query}
        ).strip()
        logger.info("=" * 50)

        return {
            "original_query": state.get("original_query", ""),
            "location_feedback": self.location_feedback,  # Save the feedback here
            "total_iterations": state.get("total_iterations", 0),
        }

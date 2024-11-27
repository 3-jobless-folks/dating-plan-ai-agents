from abc import ABC, abstractmethod

from dating_plan_ai_agents.objects.memory_untested import Memory
from dating_plan_ai_agents.objects.tools_untested import Tools


class AbstractAgent(ABC):
    """Abstract class for a general agent with memory and tools."""

    def __init__(self):
        self.memory = Memory()
        self.tools = Tools()

    @abstractmethod
    def _parse_query(self, query: str) -> dict[str, any]:
        """Parse the user's query into intent and additional details."""
        pass

    @abstractmethod
    def _decide_action(self, parsed_query: dict[str, any]) -> str:
        """Decide what action to take based on the parsed query."""
        pass

    @abstractmethod
    def _retrieve_documents(self, query: str, top_k: int) -> list[str]:
        """Retrieve relevant documents for the query."""
        pass

    @abstractmethod
    def _generate_response(self, augmented_query: str) -> str:
        """Generate a response using the chosen LLM."""
        pass

    @abstractmethod
    def run(self, query: str) -> str:
        """Main workflow for handling user queries."""
        # parsed_query = self._parse_query(query)
        # action = self._decide_action(parsed_query)
        # response = self._execute_action(action, parsed_query["details"])
        # self.memory.store(query, response)
        # return response
        pass

    def _augment_query(self, query: str, documents: list[str]) -> str:
        """Combine the query with retrieved documents."""
        context = "\n".join(documents)
        return f"Query: {query}\nContext:\n{context}\nAnswer:"

    def _execute_action(self, action: str, query_details: any) -> str:
        """Execute the decided action."""
        if action == "retrieve_and_generate":
            documents = self._retrieve_documents(query_details, top_k=5)
            augmented_query = self._augment_query(query_details, documents)
            return self._generate_response(augmented_query)
        elif action.startswith("tool:"):
            tool_name = action.split(":", 1)[1]
            return self.tools.execute(tool_name, query_details)
        else:
            return self._generate_response(query_details)

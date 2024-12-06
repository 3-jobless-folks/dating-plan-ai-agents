from abc import ABC, abstractmethod
import os
from dotenv import load_dotenv

from dating_plan_ai_agents.objects.pinecone_manager import PineconeManager
from dating_plan_ai_agents.objects.memory_untested import Memory
from dating_plan_ai_agents.objects.tools_untested import Tools
from dating_plan_ai_agents.objects.llm import LLM
from jose.exceptions import JWSError
from botocore.exceptions import NoCredentialsError, ClientError
from dating_plan_ai_agents.objects.utils import get_secret


class AbstractAgent(ABC):
    """Abstract class for a general agent with memory and tools."""

    def __init__(self):

        load_dotenv()
        self.memory = Memory()
        self.tools = Tools()
        self.llm_caller = LLM()
        try:
            secret = get_secret("my-app/config")
            pc_api_key_secrets = secret["PINECONE_KEY"]
            openai_key_secrets = secret["API_KEY"]
            pc_api_key = pc_api_key_secrets
            openai_key = openai_key_secrets
            print("Got secret from AWS secrets: {}, {}".format(pc_api_key, openai_key))
        except (NoCredentialsError, ValueError, KeyError, ClientError, JWSError) as exp:
            pc_api_key = os.getenv("PINECONE_KEY")
            openai_key = os.getenv("API_KEY")
            print(f"Failed to get secret: {exp}, using default values")
        self.pinecone_manager = PineconeManager(
            pc_api_key=pc_api_key,
            openai_key=openai_key,
            index_name="test1",
        )
        self.budget_feedback = "No specific budget yet"
        self.location_feedback = "No specific locations yet"
        self.schedule_feedback = "No specific schedule yet"
        self.input_feedback = "No specific inputs yet"

    @abstractmethod
    def _get_current_state(self) -> dict[str, any]:
        """Get the current state of the agent."""
        pass

    @abstractmethod
    def _parse_query(self, query: str) -> dict[str, any]:
        """Parse the user's query into intent and additional details."""
        pass

    @abstractmethod
    def _summarize_query(self, parsed_query: dict[str, any]) -> str:
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
    def _augment_query(self, query: str, documents: list[str]) -> str:
        """Combine the query with retrieved documents."""
        pass

    @abstractmethod
    def _execute_action(self, action: str, query_details: any) -> str:
        """Execute the decided action."""
        pass

    @abstractmethod
    def run(self, query: str) -> str:
        """Main workflow for handling user queries."""
        pass

import anthropic
import logging
import os
from dotenv import load_dotenv
from dating_plan_ai_agents.objects.llm.base_llm import BaseLLM
from jose.exceptions import JWSError
from botocore.exceptions import NoCredentialsError, ClientError
from dating_plan_ai_agents.objects.utils import get_secret

logger = logging.getLogger(__name__)


class ClaudeLLM(BaseLLM):
    def __init__(
        self,
        max_tokens: int,
        temperature: float,
        stream: bool,
        model_name: str = "claude-3-5-sonnet-20241022",
    ):
        super().__init__(
            model_name=model_name,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream,
        )
        load_dotenv()
        try:
            secret = get_secret("my-app/config")
            self.api_key = secret["ANTH_API_KEY"]
            logger.info("Got secret from AWS secrets: %s", self.api_key)
        except (NoCredentialsError, ValueError, KeyError, ClientError, JWSError) as exp:
            self.api_key = os.getenv("ANTH_API_KEY")
            logger.warning("Failed to get secret: %s, using default values", exp)
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def get_response(self, system_msg: str, prompt: str) -> str:
        try:
            response = self.client.messages.create(
                model=self.model_name,
                system=system_msg,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                stream=self.stream,
                messages=[
                    {
                        "role": "user",
                        "content": [{"type": "text", "text": prompt}],
                    }
                ],
            )
            return response.content
        except Exception as exp:
            logger.error("Error fetching Claude response: %s", exp)
            return ""

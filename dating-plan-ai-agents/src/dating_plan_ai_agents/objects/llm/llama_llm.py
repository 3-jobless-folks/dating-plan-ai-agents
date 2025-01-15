import os
from openai import OpenAI
from dotenv import load_dotenv
import logging
from jose.exceptions import JWSError
from botocore.exceptions import NoCredentialsError, ClientError
from dating_plan_ai_agents.objects.utils import get_secret
from langsmith import traceable
from dating_plan_ai_agents.objects.llm.base_llm import BaseLLM

logger = logging.getLogger(__name__)


class LlamaLLM(BaseLLM):
    def __init__(
        self,
        max_tokens: int,
        temperature: float,
        stream: bool,
        model_name: str = "llama3.3-70b",
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
            self.api_key = secret["LLAMA_API_KEY"]
            logger.info("Got secret from AWS secrets: %s", self.api_key)
        except (NoCredentialsError, ValueError, KeyError, ClientError, JWSError) as exp:
            self.api_key = os.getenv("LLAMA_API_KEY")
            logger.warning("Failed to get secret: %s, using default values", exp)
        self.client = OpenAI(api_key=self.api_key, base_url="https://api.llama-api.com")

    @traceable(run_type="llm", name="get_llm_response")
    def get_llm_response(self, system_msg: str, prompt: str):
        """
        Generate a response from the language
        model based on the provided prompt.

        Args:
            prompt (str):
                The input prompt to be sent to the language model.

        Returns:
            str:
                The generated response from the language model.
                If an error occurs,
                an empty string is returned.
        """

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                temperature=self.temperature,
                stream=self.stream,
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=self.max_tokens,
                timeout=50,
            )
            llm_response = response.choices[0].message.content
            logger.info("LLM response: %s\n", llm_response)
            logger.info("=" * 50)
            logger.info("\n\n\n")
        except Exception as exp:
            logger.error("Error fetching LLM response: %s", exp)
            llm_response = exp

        return llm_response

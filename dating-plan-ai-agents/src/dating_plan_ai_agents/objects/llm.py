import os
import openai
from dotenv import load_dotenv
import logging
from jose.exceptions import JWSError
from botocore.exceptions import NoCredentialsError, ClientError
from dating_plan_ai_agents.objects.utils import get_secret
from langsmith import traceable
from langsmith.wrappers import wrap_openai

logger = logging.getLogger(__name__)

class LLM:
    def __init__(self):
        load_dotenv()
        try:
            secret = get_secret("my-app/config")
            self.api_key = secret["API_KEY"]
            print(f"Got secret from AWS secrets: {self.api_key}")
        except (NoCredentialsError, ValueError, KeyError, ClientError, JWSError) as exp:
            self.api_key = os.getenv("API_KEY")
            print(f"Failed to get secret: {exp}, using default values")

        # Initialize the OpenAI client and wrap it for tracing
        openai.api_key = self.api_key
        self.client = wrap_openai(openai)

        self.max_tokens = 3000

    @traceable(run_type="llm", name="get_llm_response")
    def get_llm_response(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=self.max_tokens,
                timeout=50,
            )
            llm_response = response.choices[0].message.content
            logger.info(f"LLM response: {llm_response}\n\n\n")
        except Exception as e:
            logger.error(f"Error fetching LLM response: {e}")
            llm_response = ""

        return llm_response

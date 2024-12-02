import os
import requests
from dotenv import load_dotenv


class LLM:
    def __init__(self):
        load_dotenv()
        self.model_url = "https://api.openai.com/v1/chat/completions"
        self.api_key = os.getenv("API_KEY")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }
        self.max_tokens = 3000

    def get_llm_response(self, prompt):
        data = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": self.max_tokens,
        }

        llm_response = ""
        response = requests.post(
            self.model_url, headers=self.headers, json=data, timeout=10
        )
        if response.status_code == 200:
            llm_response = response.json()["choices"][0]["message"]["content"]
        else:
            print("Error:", response.status_code, response.text)

        return llm_response

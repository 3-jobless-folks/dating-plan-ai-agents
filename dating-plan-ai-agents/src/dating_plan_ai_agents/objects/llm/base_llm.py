import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class BaseLLM(ABC):
    def __init__(
        self,
        model_name: str,
        max_tokens: int = 3000,
        temperature: float = 7,
        stream: bool = True,
    ):
        self.max_tokens = max_tokens
        self.model_name = model_name
        self.temperature = temperature
        self.stream = stream

    @abstractmethod
    def get_response(self, prompt: str) -> str:
        pass

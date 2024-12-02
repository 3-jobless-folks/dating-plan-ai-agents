class Memory:
    """Manages the storage and retrieval of conversation history or context."""

    def __init__(self):
        self.history = []

    def store(self, user_query: str, response: str):
        """Store a query-response pair."""
        self.history.append({"query": user_query, "response": response})

    def retrieve_context(self) -> str:
        """Retrieve the memory as a formatted string."""
        return "\n".join(
            [f"Q: {item['query']} A: {item['response']}" for item in self.history]
        )

    def clear(self):
        """Clear all stored memory."""
        self.history = []

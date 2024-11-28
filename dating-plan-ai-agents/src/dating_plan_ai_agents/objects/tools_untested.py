class Tools:
    """Manages the registration and execution of tools."""

    def __init__(self):
        self.tools = {}

    def register(self, name: str, function: callable, description: str):
        """Register a new tool."""
        self.tools[name] = {
            "function": function,
            "description": description,
        }

    def execute(self, name: str, *args, **kwargs) -> any:
        """Execute a registered tool by name."""
        if name not in self.tools:
            raise ValueError(f"Tool '{name}' is not registered.")
        return self.tools[name]["function"](*args, **kwargs)

    def list_tools(self) -> dict[str, str]:
        """List all registered tools and their descriptions."""
        return {name: tool["description"] for name, tool in self.tools.items()}

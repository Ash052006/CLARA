from mcp.registry import MCPRegistry


class ToolExecutor:

    def __init__(self):

        self.registry = MCPRegistry()

    def execute(self, plan, context):

        results = []

        for step in plan:

            tool = step["tool"]
            action = step["action"]

            print("=" * 60)
            print("EXECUTOR")
            print("Tool   :", tool)
            print("Action :", action)

            server = self.registry.get_server(tool)
            print("Server :", server)

            if server:
                try:
                    result = server.execute(action, context)
                    print("Result :", result)
                    results.append(result)
                except Exception as e:
                    print("EXECUTION ERROR:", repr(e))
                    raise
            else:
                print("SERVER NOT FOUND")

            print("=" * 60)

        return results
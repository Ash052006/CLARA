import logging

from config.settings import settings
from mcp.registry import MCPRegistry

logger = logging.getLogger(__name__)

CALENDAR_ACTIONS = {
    "create_meeting",
    "create_holiday",
    "list_events",
    "delete_event",
    "update_event",
}

EMAIL_ACTIONS = {
    "send_email",
    "read_emails",
    "search_emails",
    "reply_latest_email",
}

ALLOWED_ACTIONS = CALENDAR_ACTIONS | EMAIL_ACTIONS

# Read-only operations that are safe to expose during a live demo.
DEMO_ALLOWED_ACTIONS = {"list_events", "read_emails", "search_emails"}


class ToolExecutor:

    def __init__(self):

        self.registry = MCPRegistry()

    def is_allowed(self, action):

        if action not in ALLOWED_ACTIONS:
            return False

        if settings.demo_mode and action not in DEMO_ALLOWED_ACTIONS:
            return False

        return True

    def _blocked_result(self, action):

        if action not in ALLOWED_ACTIONS:
            message = f"Unknown tool action: {action}"

        else:
            message = (
                f"Action '{action}' is disabled in demo mode. "
                "Only read-only email and calendar operations are available."
            )

        logger.info("blocked tool action action=%s demo_mode=%s", action, settings.demo_mode)

        return {
            "status": "blocked",
            "action": action,
            "message": message,
        }

    def execute(self, plan, context):

        results = []

        for step in plan:

            tool = step["tool"]
            action = step["action"]

            logger.info("executing tool tool=%s action=%s", tool, action)

            if not self.is_allowed(action):
                results.append(self._blocked_result(action))
                continue

            server = self.registry.get_server(tool)

            if server is None:
                results.append(
                    {
                        "status": "error",
                        "action": action,
                        "message": f"Unknown tool: {tool}",
                    }
                )
                continue

            try:
                results.append(server.execute(action, context))
            except Exception:
                logger.exception(
                    "tool execution failed tool=%s action=%s", tool, action
                )
                results.append(
                    {
                        "status": "error",
                        "action": action,
                        "message": "Tool execution failed.",
                    }
                )

        return results

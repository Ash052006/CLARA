from brain.routing.decision import Route


class DecisionRouter:
    """
    Decides how CLARA should process a user request.

    Input:
        {
            "intent": "...",
            "confidence": 0.97,
            "entities": {...}
        }

    Output:
        Route.CHAT
        Route.TOOL
        Route.HYBRID
    """

    def __init__(self):

        self.tool_intents = {
            # Calendar
            "meeting",
            "holiday",
            "calendar_query",
            "calendar_delete",
            "calendar_update",

            # Email
            "email",
            "email_query",
            "email_search",
            "email_reply",

            # Other tools
            "reminder",
            "browser",
            "file",
            "weather",
            "github",
        }

        self.hybrid_intents = {
            "summarize_email",
            # "reply_email",
            # "draft_email"
        }

    def decide(self, analysis):

        intent = analysis.get("intent", "").lower()

        if intent in self.hybrid_intents:
            return Route.HYBRID

        if intent in self.tool_intents:
            return Route.TOOL

        return Route.CHAT
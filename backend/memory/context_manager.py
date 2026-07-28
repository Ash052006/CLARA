class ContextManager:

    def merge(self, old_context, new_context):

        # First message in the conversation
        if not old_context:
            return new_context

        merged = old_context.copy()

        # ------------------------------------------------
        # Always keep the latest user message
        # ------------------------------------------------
        merged["message"] = new_context["message"]

        # ------------------------------------------------
        # Keep previous intent only for reminder follow-ups
        # ------------------------------------------------
        if (
            new_context["intent"] == "reminder"
            and old_context.get("intent")
        ):
            merged["intent"] = old_context["intent"]
        else:
            merged["intent"] = new_context["intent"]

        # ------------------------------------------------
        # Merge entities
        # New values overwrite old ones
        # ------------------------------------------------
        old_entities = old_context.get(
            "entities",
            {}
        )

        new_entities = new_context.get(
            "entities",
            {}
        )

        merged["entities"] = {
            **old_entities,
            **new_entities
        }

        return merged
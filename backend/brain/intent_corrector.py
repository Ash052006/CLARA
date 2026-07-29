import re


class IntentCorrector:

    @staticmethod
    def correct(message, analysis):

        message = message.lower().strip()

        meeting_words = [
            "meeting",
            "schedule",
            "book",
            "create meeting",
            "add meeting",
            "appointment",
            "call",
            "conference"
        ]

        update_words = [
            "update",
            "move",
            "change",
            "cleanse",
            "reschedule",
            "postpone",
            "shift"
        ]

        delete_words = [
            "delete",
            "cancel",
            "remove"
        ]

        query_words = [
            "show",
            "list",
            "what",
            "do i have",
            "events",
            "calendar"
        ]

        has_date = any(
            word in message
            for word in [
                "today",
                "tomorrow",
                "next",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ]
        )

        has_time = bool(
            re.search(
                r"\b\d{1,2}(:\d{2})?\s*(am|pm)?\b",
                message
            )
        )

        # ----------------------------------------------------
        # If the model already predicted a specific calendar
        # intent, don't override it.
        # ----------------------------------------------------

        if analysis.get("intent") in (
            "calendar_update",
            "calendar_delete",
            "calendar_query"
        ):
            return analysis

        # ----------------------------------------------------
        # DELETE
        # ----------------------------------------------------

        if any(word in message for word in delete_words):
            analysis["intent"] = "calendar_delete"
            analysis["confidence"] = 0.99
            return analysis

        # ----------------------------------------------------
        # UPDATE
        # ----------------------------------------------------

        if any(word in message for word in update_words):
            analysis["intent"] = "calendar_update"
            analysis["confidence"] = 0.99
            return analysis

        # ----------------------------------------------------
        # QUERY
        # ----------------------------------------------------

        if any(word in message for word in query_words):
            analysis["intent"] = "calendar_query"
            analysis["confidence"] = 0.99
            return analysis

        # ----------------------------------------------------
        # CREATE MEETING (keep this LAST)
        # ----------------------------------------------------

        if (
            any(word in message for word in meeting_words)
            or (has_date and has_time)
        ):
            analysis["intent"] = "meeting"
            analysis["confidence"] = 0.99
            return analysis

        return analysis
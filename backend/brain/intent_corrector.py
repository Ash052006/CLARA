class IntentCorrector:

    @staticmethod
    def correct(message, analysis):

        message = message.lower()

        # If the classifier is confident enough, trust it.
        if analysis.get("confidence", 1.0) >= 0.75:
            return analysis

        # -------------------------
        # Email correction
        # -------------------------
        if any(word in message for word in [
            "email", "emails", "mail", "gmail", "inbox"
        ]):
            analysis["intent"] = "email"

        # -------------------------
        # Calendar query correction
        # -------------------------
        elif any(phrase in message for phrase in [
            "show calendar",
            "show my calendar",
            "what's on my calendar",
            "list events",
            "show events",
            "upcoming events",
            "what meetings",
            "my schedule"
        ]):
            analysis["intent"] = "calendar_query"

        return analysis
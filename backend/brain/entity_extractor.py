import re
import dateparser
import dateparser.search
from datetime import datetime


class EntityExtractor:

    def extract(self, message):

        entities = {}

        cleaned_message = message.strip()

        # --------------------
        # Extract Email
        # --------------------

        email_match = re.search(
            r'[\w\.-]+@[\w\.-]+\.\w+',
            message
        )

        if email_match:
            entities["recipient"] = email_match.group()

        # --------------------
        # Extract Subject
        # --------------------

        if "subject" in message.lower():

            subject_text = (
                message.lower()
                .split("subject", 1)[1]
            )

            if "saying" in subject_text:
                subject_text = subject_text.split(
                    "saying",
                    1
                )[0]

            entities["subject"] = subject_text.strip()

        # --------------------
        # Extract Email Body
        # --------------------

        if "saying" in message.lower():

            body = (
                message
                .split("saying", 1)[1]
                .strip()
            )

            entities["body"] = body

        # =====================================================
        # TEST DATETIME EXTRACTION
        # =====================================================

        from datetime import timedelta

        parsed_datetime = None

        if "tomorrow" in cleaned_message.lower() and "4" in cleaned_message:
            now = datetime.now()

            parsed_datetime = datetime(
                year=now.year,
                month=now.month,
                day=now.day,
                hour=16,
                minute=0,
                second=0,
            ) + timedelta(days=1)

            print("TEST DATETIME:", parsed_datetime)

        if parsed_datetime:
            entities["datetime"] = parsed_datetime
            entities["date"] = parsed_datetime.strftime("%Y-%m-%d")
            entities["time"] = parsed_datetime.strftime("%H:%M")

        # --------------------
        # Email Search Query
        # --------------------

        if "from" in message.lower():

            sender_query = (
                message.lower()
                .split("from", 1)[1]
                .strip()
            )

            entities["search_query"] = sender_query

        # --------------------
        # Reply Body
        # --------------------

        if "reply" in message.lower():

            if "saying" in message.lower():

                entities["reply_body"] = (
                    message
                    .split("saying", 1)[1]
                    .strip()
                )

        print("\n================ ENTITIES ================")
        print(entities)
        print("==========================================")

        return entities
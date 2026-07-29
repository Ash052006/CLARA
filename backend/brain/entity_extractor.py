import re
import dateparser
import dateparser.search
from datetime import datetime, timedelta


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

        # ============================================================
        # DATE / TIME EXTRACTION
        # ============================================================

        parsed_datetime = None

        is_update = any(
            word in cleaned_message.lower()
            for word in [
                "update",
                "change",
                "cleanse",
                "move",
                "reschedule",
                "shift",
                "postpone"
            ]
        )

        is_meeting_request = any(
            word in cleaned_message.lower()
            for word in [
                "meeting",
                "schedule",
                "calendar",
                "appointment",
                "event"
            ]
        )

        # ------------------------------------------------------------
        # Tomorrow at <time>
        # ------------------------------------------------------------

        match = re.search(
            r"tomorrow.*?(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|am|pm)?",
            cleaned_message.lower()
        )

        if match:

            hour = int(match.group(1))
            minute = int(match.group(2) or 0)
            meridian = (match.group(3) or "").lower().replace(".", "")

            if meridian == "pm" and hour != 12:
                hour += 12

            if meridian == "am" and hour == 12:
                hour = 0

            now = datetime.now()

            parsed_datetime = datetime(
                now.year,
                now.month,
                now.day,
                hour,
                minute
            ) + timedelta(days=1)

        elif is_meeting_request or is_update:

            # --------------------------------------------------------
            # Standalone time
            # --------------------------------------------------------

            matches = re.findall(
                r"(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|am|pm|o'?clock)?",
                cleaned_message.lower()
            )

            if matches:

                # Updates → use LAST mentioned time
                if is_update:
                    hour_str, minute_str, meridian = matches[-1]
                else:
                    hour_str, minute_str, meridian = matches[0]

                hour = int(hour_str)
                minute = int(minute_str or 0)

                meridian = (meridian or "").lower().replace(".", "")

                if meridian == "pm" and hour != 12:
                    hour += 12

                if meridian == "am" and hour == 12:
                    hour = 0

                # ----------------------------
                # UPDATE REQUEST
                # ----------------------------

                if is_update:

                    entities["time"] = f"{hour:02d}:{minute:02d}"

                # ----------------------------
                # CREATE REQUEST
                # ----------------------------

                else:

                    now = datetime.now()

                    parsed_datetime = now.replace(
                        hour=hour,
                        minute=minute,
                        second=0,
                        microsecond=0
                    )

        if parsed_datetime:

            entities["datetime"] = parsed_datetime
            entities["date"] = parsed_datetime.strftime("%Y-%m-%d")
            entities["time"] = parsed_datetime.strftime("%H:%M")

        print("PARSED:", parsed_datetime)

        # --------------------
        # Email Search Query
        # --------------------

        if (
            "from" in message.lower()
            and any(
                word in message.lower()
                for word in [
                    "email",
                    "mail",
                    "gmail",
                    "inbox"
                ]
            )
        ):

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
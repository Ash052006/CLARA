from email.mime.text import MIMEText
import base64

from googleapiclient.discovery import build

from config.settings import settings
from mcp.base_server import MCPServer
from mcp.google_auth import get_credentials


SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.readonly"
]


class GmailServer(MCPServer):

    def get_service(self):

        creds = get_credentials(
            SCOPES,
            token_path=settings.gmail_token_file,
            token_json=settings.gmail_token_json,
            credentials_path=settings.google_credentials_file,
            credentials_json=settings.google_credentials_json,
        )

        return build(
            "gmail",
            "v1",
            credentials=creds
        )

    def execute(
        self,
        action,
        context
    ):

        service = (
            self.get_service()
        )

        # -------------------------
        # SEND EMAIL
        # -------------------------

        if action == "send_email":

            try:

                entities = context.get(
                    "entities",
                    {}
                )

                recipient = entities.get(
                    "recipient",
                    "viratplay21@gmail.com"
                )

                subject = entities.get(
                    "subject",
                    "CLARA Email"
                )

                body = entities.get(
                    "body",
                    "This email was sent by CLARA."
                )

                message = MIMEText(
                    body
                )

                message["to"] = recipient

                message["subject"] = (
                    subject
                )

                raw = (
                    base64
                    .urlsafe_b64encode(
                        message.as_bytes()
                    )
                    .decode()
                )

                sent_message = (
                    service.users()
                    .messages()
                    .send(
                        userId="me",
                        body={
                            "raw": raw
                        }
                    )
                    .execute()
                )

                return {

                    "status":
                    "success",

                    "message":
                    "Email sent",

                    "email_id":
                    sent_message["id"],

                    "recipient":
                    recipient,

                    "subject":
                    subject
                }

            except Exception as e:

                return {

                    "status":
                    "error",

                    "message":
                    str(e)
                }
        # -------------------------
        # READ EMAILS
        # -------------------------

        elif action == "read_emails":

            try:

                results = (
                    service.users()
                    .messages()
                    .list(
                        userId="me",
                        maxResults=5
                    )
                    .execute()
                )

                messages = (
                    results.get(
                        "messages",
                        []
                    )
                )

                emails = []

                for msg in messages:

                    full_message = (
                        service.users()
                        .messages()
                        .get(
                            userId="me",
                            id=msg["id"]
                        )
                        .execute()
                    )

                    headers = (
                        full_message["payload"]
                        .get(
                            "headers",
                            []
                        )
                    )

                    subject = "No Subject"

                    sender = "Unknown"

                    for header in headers:

                        if header["name"] == "Subject":

                            subject = (
                                header["value"]
                            )

                        if header["name"] == "From":

                            sender = (
                                header["value"]
                            )

                    emails.append({

                        "from":
                        sender,

                        "subject":
                        subject
                    })

                return {

                    "status":
                    "success",

                    "count":
                    len(emails),

                    "emails":
                    emails
                }

            except Exception as e:

                return {

                    "status":
                    "error",

                    "message":
                    str(e)
        }
        # -------------------------
        # SEARCH EMAILS
        # -------------------------

        elif action == "search_emails":

            try:

                entities = context.get(
                    "entities",
                    {}
                )

                query = entities.get(
                    "search_query",
                    ""
                )

                results = (
                    service.users()
                    .messages()
                    .list(
                        userId="me",
                        q=query,
                        maxResults=10
                    )
                    .execute()
                )

                messages = (
                    results.get(
                        "messages",
                        []
                    )
                )

                emails = []

                for msg in messages:

                    full_message = (
                        service.users()
                        .messages()
                        .get(
                            userId="me",
                            id=msg["id"]
                        )
                        .execute()
                    )

                    subject = "No Subject"
                    sender = "Unknown"

                    for header in (
                        full_message["payload"]
                        .get(
                            "headers",
                            []
                        )
                    ):

                        if header["name"] == "Subject":

                            subject = (
                                header["value"]
                            )

                        elif header["name"] == "From":

                            sender = (
                                header["value"]
                            )

                    emails.append({

                        "from":
                        sender,

                        "subject":
                        subject,

                        "snippet":
                        full_message.get(
                            "snippet",
                            ""
                        )
                    })

                return {

                    "status":
                    "success",

                    "query":
                    query,

                    "count":
                    len(emails),

                    "emails":
                    emails
                }

            except Exception as e:

                return {

                    "status":
                    "error",

                    "message":
                    str(e)
                }
        # -------------------------
        # REPLY TO LATEST EMAIL
        # -------------------------

        elif action == "reply_latest_email":

            try:

                entities = context.get(
                    "entities",
                    {}
                )

                reply_body = entities.get(
                    "reply_body",
                    "Thank you."
                )

                results = (
                    service.users()
                    .messages()
                    .list(
                        userId="me",
                        q="in:inbox",
                        maxResults=1
                    )
                    .execute()
                )

                messages = (
                    results.get(
                        "messages",
                        []
                    )
                )

                if not messages:

                    return {
                        "status": "error",
                        "message": "No emails found"
                    }

                latest_id = messages[0]["id"]

                latest_email = (
                    service.users()
                    .messages()
                    .get(
                        userId="me",
                        id=latest_id
                    )
                    .execute()
                )

                sender = None
                subject = "No Subject"

                headers = (
                    latest_email["payload"]
                    .get(
                        "headers",
                        []
                    )
                )

                for header in headers:

                    if header["name"] == "From":

                        sender = (
                            header["value"]
                        )

                    elif header["name"] == "Subject":

                        subject = (
                            header["value"]
                        )

                if not sender:

                    return {
                        "status": "error",
                        "message": "Sender not found"
                    }

                message = MIMEText(
                    reply_body
                )

                message["to"] = sender
                message["subject"] = (
                    f"Re: {subject}"
                )

                message["In-Reply-To"] = latest_id
                message["References"] = latest_id

                raw = (
                    base64
                    .urlsafe_b64encode(
                        message.as_bytes()
                    )
                    .decode()
                )

                thread_id = latest_email["threadId"]

                sent_message = (
                    service.users()
                    .messages()
                    .send(
                        userId="me",
                        body={
                            "raw": raw,
                            "threadId": thread_id
                        }
                    )
                    .execute()
                )

                return {

                    "status":
                    "success",

                    "message":
                    "Reply sent",

                    "recipient":
                    sender,

                    "subject":
                    f"Re: {subject}",

                    "email_id":
                    sent_message["id"]
                }

            except Exception as e:

                return {

                    "status":
                    "error",

                    "message":
                    str(e)
                }
        # -------------------------
        # UNKNOWN ACTION
        # -------------------------

        return {

            "status":
            "error",

            "message":
            "Unknown action"
        }
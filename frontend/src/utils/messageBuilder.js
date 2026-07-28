let msgIdCounter = 100000; // separate counter for helper

export function buildAssistantMessage(result) {
  let responseText =
    result.response || "Task completed successfully";

  let card = null;

  if (result.execution && result.execution.length > 0) {
    const execution = result.execution[0];

    // Inbox Search
    if (execution.emails) {
      responseText = `Found ${execution.count} emails`;

      card = {
        type: "emails",
        emails: execution.emails,
      };
    }

    // Reply Sent
    else if (
      execution.message &&
      execution.message.toLowerCase().includes("reply")
    ) {
      responseText = "Reply sent successfully";

      card = {
        type: "reply_sent",
        recipient: execution.recipient,
        subject: execution.subject,
      };
    }

    // Email Sent
    else if (execution.email_id) {
      responseText = "Email sent successfully";

      card = {
        type: "email_sent",
        recipient:
          result.memory?.current_context?.entities?.recipient,
        subject:
          result.memory?.current_context?.entities?.subject,
      };
    }

    // Calendar Event
    else if (
      execution.event_id ||
      execution.new_time
    ) {
      responseText =
        execution.message || "Calendar updated";

      card = {
        type: "calendar_event",
        message: execution.message,
        time: execution.new_time,
      };
    }

    // Calendar List
    else if (execution.events) {
      responseText = `Found ${execution.count} events`;

      card = {
        type: "events",
        events: execution.events,
      };
    }
  }

  return {
    id: msgIdCounter++,
    role: "assistant",
    content: responseText,
    card,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
"""Lazy, thread-safe singletons for expensive CLARA components.

Importing ``main`` must not download/load Transformers or Whisper models. This
keeps Render health checks fast and avoids duplicate model loads between the
HTTP chat route and the voice route.
"""

import logging
import threading

logger = logging.getLogger(__name__)

_lock = threading.Lock()
_conversation_manager = None


def get_conversation_manager():
    global _conversation_manager
    if _conversation_manager is None:
        with _lock:
            if _conversation_manager is None:
                logger.info("initializing conversation manager")
                from brain.conversation_manager import ConversationManager

                _conversation_manager = ConversationManager()
                logger.info("conversation manager ready")
    return _conversation_manager

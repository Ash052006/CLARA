from brain.llm_manager import LLMManager
from brain.entity_extractor import EntityExtractor

from memory.short_term import ShortTermMemory
from memory.context_manager import ContextManager
from memory.preference import PreferenceMemory
from memory.long_term import LongTermMemory

from brain.response_generator import ResponseGenerator

from planner.planner import Planner

from tools.tool_router import ToolRouter
from tools.executor import ToolExecutor

from brain.intent_corrector import IntentCorrector

from brain.routing.router import DecisionRouter
from brain.routing.decision import Route
from brain.reasoning.chat_manager import ChatManager

class ConversationManager:

    def __init__(self):

        # Core AI systems
        self.llm = LLMManager()

        # Decision routing
        self.decision_router = DecisionRouter()

        # Chat reasoning
        self.chat_manager = ChatManager()

        self.extractor = EntityExtractor()

        # Memory systems
        self.memory = ShortTermMemory()

        self.long_term = LongTermMemory()

        self.context_manager = ContextManager()

        self.preferences = PreferenceMemory()

        # Load saved preferences from long-term memory
        stored_preferences = self.long_term.load()

        for key, value in stored_preferences.items():

            self.preferences.save(
                key,
                value
            )

        # Response system
        self.response_generator = ResponseGenerator()

        # Planning system
        self.planner = Planner()

        # Tool systems
        self.router = ToolRouter()

        self.executor = ToolExecutor()

    def process_message(self, message):
        print("=" * 80)
        print("MESSAGE RECEIVED:")
        print(repr(message))
        print("=" * 80)
        # =========================================
        # Step 1: Understand message
        # =========================================
        analysis = self.llm.understand(message)
        print("=" * 80)
        print("INTENT:", analysis["intent"])
        print("CONFIDENCE:", analysis["confidence"])
        print("=" * 80)
        print("\n========== BEFORE CORRECTOR ==========")
        print(analysis)
        print("======================================")

        analysis = IntentCorrector.correct(
            message,
            analysis
        )
        print("\n========== AFTER CORRECTOR ==========")
        print(analysis)
        print("=====================================")
        route = self.decision_router.decide(analysis)

        print("=" * 60)
        print("CLARA ROUTER")
        print("=" * 60)
        print(f"Message : {message}")
        print(f"Intent  : {analysis['intent']}")
        print(f"Route   : {route.value}")
        print("=" * 60)

        print("INTENT:", analysis)

        # =========================================
        # Step 2: Extract entities
        # =========================================
        entities = self.extractor.extract(message)

        print("\n========== EXTRACTED ENTITIES ==========")
        print(entities)
        print("========================================")

        # =========================================
        # Step 3: Build new context
        # =========================================
        new_context = {
            "intent": analysis["intent"],
            "entities": entities,
            "message": message
        }

        # =========================================
        # Step 4: Load old context
        # =========================================
        old_context = self.memory.get(
            "current_context"
        )

        # =========================================
        # Step 5: Merge contexts
        # =========================================
        merged_context = self.context_manager.merge(
            old_context,
            new_context
        )

        # =========================================
        # Step 6: Save short-term memory
        # =========================================
        self.memory.save(
            "current_context",
            merged_context
        )
        print("\n========== MERGED CONTEXT ==========")
        print(merged_context)
        print("====================================")

        # =========================================
        # Step 7: Learn preferences
        # =========================================
        if "time" in merged_context["entities"]:

            meeting_time = merged_context[
                "entities"
            ]["time"]

            self.preferences.add_history(
                "meeting_time",
                meeting_time
            )

            history = self.preferences.get_history(
                "meeting_time"
            )

            # Learn after repeated behavior
            if len(history) >= 3:

                self.preferences.save(
                    "preferred_meeting_time",
                    "Afternoon"
                )

        # =========================================
        # Step 8: Save long-term memory
        # =========================================
        self.long_term.save(
            self.preferences.get_all()
        )

        # =========================================
        # CHAT ROUTE
        # =========================================
        if route == Route.CHAT:

            response = self.chat_manager.chat(message)

            return {

                "route": route.value,

                "response": response,

                "memory": self.memory.get_all(),

                "preferences": self.preferences.get_all(),

                "long_term": self.long_term.load()

            }

        # =========================================
        # HYBRID ROUTE (Sprint 3)
        # =========================================
        elif route == Route.HYBRID:

            return {

                "route": route.value,

                "response": "Hybrid execution will be implemented in Sprint 3.",

                "memory": self.memory.get_all(),

                "preferences": self.preferences.get_all(),

                "long_term": self.long_term.load()

            }

        # =========================================
        # TOOL ROUTE
        # =========================================
        elif route == Route.TOOL:

            response = self.response_generator.generate(
                merged_context,
                self.preferences.get_all()
            )

            plan = self.planner.create_plan(
                merged_context
            )

            tools = self.router.route(
                plan
            )
            # =========================================
            # Inject last calendar event into context
            # =========================================

            if (
                plan
                and plan[0]["action"] in [
                    "update_event",
                    "delete_event"
                ]
            ):

                last_event = self.memory.get(
                    "last_calendar_event"
                )

                if last_event:

                    merged_context[
                        "last_calendar_event"
                    ] = last_event
            execution_results = self.executor.execute(
                plan,
                merged_context
            )
            # =========================================
            # Save last created calendar event
            # =========================================

            if (
                plan
                and plan[0]["action"] == "create_meeting"
                and execution_results
                and execution_results[0]["status"] == "success"
            ):

                self.memory.save(
                    "last_calendar_event",
                    {
                        "event_id": execution_results[0]["event_id"],
                        "start": execution_results[0]["start"]
                    }
                )
                print("=" * 60)
                print("LAST EVENT SAVED")
                print(self.memory.get("last_calendar_event"))
                print("=" * 60)

            return {

                "route": route.value,

                "response": response,

                "plan": plan,

                "tools": tools,

                "execution": execution_results,

                "memory": self.memory.get_all(),

                "preferences": self.preferences.get_all(),

                "long_term": self.long_term.load()

            }

        else:

            return {

                "route": "unknown",

                "response": "Unable to determine the request."

            }
        # =========================================
        # Step 13: Final response
        # =========================================
        return {

            "response": response,

            "plan": plan,

            "tools": tools,

            "execution": execution_results,

            "memory": self.memory.get_all(),

            "preferences": self.preferences.get_all(),

            "long_term": self.long_term.load()
        }
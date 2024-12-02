from dating_plan_ai_agents.objects.pinecone_manager import PineconeManager
from dating_plan_ai_agents.objects.state import GraphState
from dating_plan_ai_agents.objects.llm import LLM
from dating_plan_ai_agents.objects.input_agent import InputValidator
from dating_plan_ai_agents.objects.location_agent import LocationAgent
from dating_plan_ai_agents.objects.schedule_agent import SchedulingAgent
from dating_plan_ai_agents.objects.budget_agent import BudgetAgent
from dating_plan_ai_agents.objects.final_agent import FinalPlan
from dating_plan_ai_agents.objects.evaluator import Evaluator
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


def run_chain(
    inputs: Dict[str, Any],
):
    # Process the inputs and create a plan
    dating_review_workflow = StateGraph(GraphState)
    input_validator = InputValidator()
    location_selector = LocationAgent()
    scheduling_agent = SchedulingAgent()
    budget_reviewer = BudgetAgent()
    evaluator = Evaluator()
    finalize_plan = FinalPlan()
    dating_review_workflow.add_node("input_validator", input_validator.run)
    dating_review_workflow.add_node("location_selector", location_selector.run)
    dating_review_workflow.add_node("scheduling_agent", scheduling_agent.run)
    dating_review_workflow.add_node("budget_reviewer", budget_reviewer.run)
    dating_review_workflow.add_node("evaluator", evaluator.run)
    dating_review_workflow.add_node("finalize_plan", finalize_plan.run)

    # Set entry point
    dating_review_workflow.set_entry_point("input_validator")
    # Add edges for transitions, including evaluator
    dating_review_workflow.add_edge("input_validator", "scheduling_agent")
    dating_review_workflow.add_edge("scheduling_agent", "location_selector")
    dating_review_workflow.add_edge("location_selector", "budget_reviewer")

    dating_review_workflow.add_conditional_edges(
        "budget_reviewer",
        evaluator.run,
        {"scheduling_agent", "finalize_plan"},
    )
    # Add END condition for budget reviewer (final step before evaluation)
    dating_review_workflow.add_edge("finalize_plan", END)
    start_time = inputs.get("start_time", "No start time yet")
    end_time = inputs.get("end_time", "No end time yet")
    indoor_outdoor = inputs.get("indoor_outdoor", "No indoor/outdoor preference yet")
    country = inputs.get("country", "No country preference yet")
    budget = inputs.get("budget", "No budget yet")
    food_preference = inputs.get("food_preference", "No food preference yet")
    activity_preference = inputs.get(
        "activity_preference", "No activity preference yet"
    )
    other_requirements = inputs.get("other_requirements", "No other requirements yet")
    result = None
    state = GraphState(
        total_iterations=0,  # Initialize iteration counter
        budget=budget,  # Example user input
        start_time=start_time,
        end_time=end_time,
        country=country,
        food_preference=food_preference,
        indoor_outdoor=indoor_outdoor,
        activity_preference=activity_preference,
        other_requirements=other_requirements,
    )
    logger.info("Workflow created...")
    logger.info("Compiling and invoking...")
    # Execute the workflow
    result = dating_review_workflow.compile()
    conversation = result.invoke(
        state, {"recursion_limit": 100}, stream_mode="values", debug=True
    )
    final_schedule = (
        conversation.get("final_schedule").replace("```", "").replace("json", "")
    )
    return final_schedule

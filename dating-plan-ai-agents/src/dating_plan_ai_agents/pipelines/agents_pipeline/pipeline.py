from kedro.pipeline import Pipeline, node
from dating_plan_ai_agents.pipelines.agents_pipeline.nodes import run_chain


def create_pipeline(**kwargs) -> Pipeline:
    return Pipeline(
        [
            node(
                func=run_chain,
                inputs="params:setup_inputs",
                outputs="final_result",
                name="run_node",
            ),
        ]
    )

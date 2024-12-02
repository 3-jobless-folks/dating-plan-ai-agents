"""Project pipelines."""
from __future__ import annotations

from kedro.framework.project import find_pipelines
from kedro.pipeline import Pipeline
from kedro.pipeline import Pipeline
from dating_plan_ai_agents.pipelines.agents_pipeline import pipeline as agents_pipeline


def register_pipelines() -> dict[str, Pipeline]:
    return {
        "__default__": agents_pipeline.create_pipeline(),  # Default pipeline
        "agents": agents_pipeline.create_pipeline(),  # Named pipeline
    }

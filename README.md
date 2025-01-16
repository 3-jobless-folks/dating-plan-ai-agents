# dating-plan-ai-agents

## Overview

This is a Kedro project, which was generated using `kedro 0.19.9`.

## How to run Kedro pipeline

You can run Kedro project with:

```
kedro run
```

## How to test Kedro project

```
pytest
```

# Running this application
- Backend: Python and FastAPI
- Frontend: ReactJS

## Application architecture
![alt text](image.png)

## Running the backend
The project folder consists of both the backend and frontend. Follow the instructions below to run the project.


### 1. Setting up the backend

Setup the conda environment. Ensure you are in root project directory and run the following command:

```bash
cd dating-plan-ai-agents
conda env create -f environment.yml
conda activate dating
```

### 2. Run the backend

Ensure you are in DATING_APP/dating-plan-ai-agents/src and run the following command:
```bash
uvicorn dating_plan_ai_agents.fastapi.main:app --reload
```

## Running the frontend
Ensure you are in the project root folder and run the following command:
```
npm build
npm start
```

## Note: For deployment backend build, ensure that is_test is set to False in main.py and config.json is the following config:
```bash
	"API_BASE_URL": "https://datemee.click"
```

## Environment variables needed
- API_KEY = "openai-api-key"

- LANGCHAIN_TRACING_V2=true
- LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
- LANGCHAIN_API_KEY="your-langsmith-api-key"
- LANGCHAIN_PROJECT="your-langsmith-project-name"

- PINECONE_KEY = "your-pinecone-api-key"

- GITHUB_KEY = "your-github-api-key"

- ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

- JWT_SECRET_KEY ="a-JWT-secret-key"

- JWT_ALGO ="your-jwt-algo-used"

- MONGO_URI=mongodb://localhost:27017
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


## Project dependencies

To see and update the dependency requirements for your project use `requirements.txt`. You can install the project requirements with `pip install -r requirements.txt`.

[Further information about project dependencies](https://docs.kedro.org/en/stable/kedro_project_setup/dependencies.html#project-specific-dependencies)


## How to run backend fastapi

In the backend directory run the following command:

```bash
cd dating-plan-ai-agents/src/dating_plan_ai_agents/fastapi
uvicorn main:app --reload
```

## How to run Frontend

## Available Scripts

In the project directory, you can run the following command:

```bash
cd multi-agent-ui
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.




### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



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
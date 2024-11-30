# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from dating_plan_ai_agents.objects.pinecone_manager import PineconeManager
from dating_plan_ai_agents.mongodb.mongo import MongoDBHelper
import fastapi_helper
import json
import load_dotenv
import os

app = FastAPI()

# Allow CORS for the frontend (React app on port 3000)
origins = [
    "http://localhost:3000",  # Frontend URL (adjust if necessary)
    "http://127.0.0.1:3000",  # For local testing
]

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define a Pydantic model to parse input
class DatePlanRequest(BaseModel):
    start_time: Optional[str] = None  # Start time
    end_time: Optional[str] = None  # End time
    indoor_outdoor: Optional[str] = None  # Indoor or outdoor preference
    country: Optional[str] = None  # Country
    budget: Optional[str] = None  # User's budget
    food_preference: Optional[str] = None  # Food preferences (e.g., vegetarian, etc.)
    activity_preference: Optional[str] = (
        None  # Activity preference (e.g., relaxing, adventurous)  ##
    )
    other_requirements: Optional[str] = None


@app.post("/plan")
async def create_plan(request: DatePlanRequest):
    # Here you would process the multi-agent loop
    print("Printed")
    start_time = request.start_time
    end_time = request.end_time
    indoor_outdoor = request.indoor_outdoor
    country = request.country
    budget = request.budget
    food_preference = request.food_preference
    activity_preference = request.activity_preference
    other_requirements = request.other_requirements

    result = fastapi_helper.create_workflow(
        {
            "start_time": start_time,
            "end_time": end_time,
            "indoor_outdoor": indoor_outdoor,
            "country": country,
            "budget": budget,
            "food_preference": food_preference,
            "activity_preference": activity_preference,
            "other_requirements": other_requirements,
        }
    )
    print(f"Data type: {type(result)} Final_schedule: {result}")
    try:
        result = json.loads(result.strip())
        print(f"Json object:{type(result)}:\n {result}")
    except json.JSONDecodeError:
        result = {"error": "Invalid JSON response"}

    return {"result": result}  # Return the result as formatted JSON


@app.post("/ingest_mongodb_embeddings")
async def ingest_mongodb_embeddings():
    """
    Endpoint to retrieve documents from MongoDB, generate embeddings,
    and store them in Pinecone.
    """
    load_dotenv()
    openai_key = os.getenv("API_KEY")
    pc_key = os.getenv("PINECONE_KEY")
    pinecone_manager = PineconeManager(
        pc_api_key=pc_key,
        openai_key=openai_key,
        index_name="dating",
        mongodb_uri="mongodb://localhost:27017",
        mongodb_db="dating",
        mongodb_collection="dating",
    )
    try:
        # Trigger the ingestion of MongoDB data into Pinecone
        pinecone_manager.ingest_mongodb(id_field="_id", text_field="content")

        return {"message": "Data successfully ingested into Pinecone"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    try:
        mongo_helper = MongoDBHelper()
        # Read the content of the uploaded file and convert it to MongoDB
        num_documents = mongo_helper.convert_csv_to_mongodb(file.file.read())

        if num_documents > 0:
            return {
                "message": f"Successfully inserted {num_documents} records into MongoDB."
            }
        else:
            return {"message": "No valid records found in the CSV."}
    except Exception as e:
        return {"message": f"Error occurred: {str(e)}"}

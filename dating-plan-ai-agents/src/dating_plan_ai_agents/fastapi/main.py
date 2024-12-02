# main.py
from fastapi import FastAPI, UploadFile, File, Request, APIRouter, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from pydantic import BaseModel
from dating_plan_ai_agents.objects.pinecone_manager import PineconeManager
from dating_plan_ai_agents.mongodb.mongo import MongoDBHelper
import fastapi_helper
import json
from dotenv import load_dotenv
import os
import uvicorn
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from dating_plan_ai_agents.mongodb.user import User
from dating_plan_ai_agents.mongodb.schedule import Schedule
from dating_plan_ai_agents.mongodb.user_role import UserRole
from fastapi.security import OAuth2PasswordRequestForm


from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

# Secret key for encoding and decoding JWT
SECRET_KEY = "a_random_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
router = APIRouter()
app.include_router(router)

# Allow CORS for the frontend (React app on port 3000)
origins = [
    "http://localhost:3000",  # Frontend URL (adjust if necessary)
    "http://127.0.0.1:3000",  # For local testing
]


class LogRequestMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Log the raw request body
        raw_body = await request.body()
        print(f"Raw incoming request: {raw_body}")

        try:
            # Parse the raw body into a dictionary
            body = json.loads(raw_body)
            print("Parsed request data with types:")
            for key, value in body.items():
                print(f"{key}: {value} (type: {type(value).__name__})")
        except json.JSONDecodeError:
            print("Failed to parse JSON body. Ensure the request contains valid JSON.")

        # Proceed with the normal request flow
        response = await call_next(request)
        return response


# Add the middleware to the app
app.add_middleware(LogRequestMiddleware)

# Add the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# # Middleware to restrict upload size
# @app.middleware("http")
# async def limit_upload_size(request: Request, call_next):
#     max_upload_size = 10 * 1024 * 1024 * 1024  # 1 GB
#     content_length = request.headers.get("content-length")

#     if content_length and int(content_length) > max_upload_size:
#         return JSONResponse(
#             content={"detail": "Request payload too large. Maximum size is 10 MB."},
#             status_code=413,  # Payload Too Large
#         )

#     return await call_next(request)


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
        mongodb_collection="reviews",
    )
    try:
        print("Ingesting MongoDB data into Pinecone...")
        # Trigger the ingestion of MongoDB data into Pinecone
        vectors = pinecone_manager.ingest_mongodb(
            id_field="index_id", text_field="caption"
        )
        return {"result": "Data successfully ingested into Pinecone"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):

    mongo_helper = MongoDBHelper(
        id_field="index_id", db_name="dating", collection_name="reviews"
    )
    # Read the content of the uploaded file and convert it to MongoDB
    contents = await file.read()
    file_name = file.filename
    response = mongo_helper.convert_csv_to_mongodb(contents, file_name)

    return response


@app.get("/get_users", response_model=List[User])
async def get_users():
    users_collection, _ = fastapi_helper.get_user_manager()
    users = []
    async for user in users_collection.find():
        users.append(user)

    for user in users:
        user["index_id"] = str(user["index_id"])  # Convert ObjectId to string
    return users


@app.get("/get_schedules", response_model=List[Schedule])
async def get_schedules():
    schedule_helper = MongoDBHelper(
        id_field="index_id", db_name="dating", collection_name="schedule"
    )
    schedules = []
    async for schedule in schedule_helper.collection.find():
        schedules.append(schedule)
    for schedule in schedules:
        schedule["index_id"] = str(schedule["index_id"])  # Convert ObjectId to string
    return schedules


# JWT Utility functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_data
    except jwt.ExpiredSignatureError:
        print("The token has expired.")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token.")
        return None


# Get the current user's role from the token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_role = payload.get("role")

        if user_role is None:
            raise credentials_exception

        return user_role

    except JWTError as e:
        raise credentials_exception  # Handles any JWT errors (invalid, expired, etc.)


# Check if the current user has admin privileges
def is_admin(current_role: str = Depends(get_current_user)):
    if current_role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")


@app.post("/register")
async def create_user(
    user: User,
    is_admin: bool = Query(..., description="Indicates if the user is an admin"),
):
    # Log raw data for debugging (remove in production)
    for key, value in user.model_dump().items():
        print(f"{key}: {type(value).__name__}")
    users_collection, pwd_context = fastapi_helper.get_user_manager()
    # Check if the email already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Ensure users can only assign themselves as 'user', not 'admin'
    if user.role == "admin" and not is_admin:
        raise HTTPException(
            status_code=403, detail="Admin accounts can only be created by an admin"
        )

    # Hash the password before storing it
    hashed_password = pwd_context.hash(user.password)

    # Generate a new index_id (simple auto-generated index)
    total_users = await users_collection.count_documents({})
    new_index_id = total_users + 1
    print(f"New index id: {new_index_id}")

    # Create user document for MongoDB
    new_user = {
        "index_id": new_index_id,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "age": user.age,
        "role": user.role,  # Force all new users to have the 'user' role
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }

    # Insert the new user into the MongoDB collection
    await users_collection.insert_one(new_user)

    return {"message": "User created successfully"}


# Helper function to create JWT tokens


# Login endpoint
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users_collection, pwd_context = fastapi_helper.get_user_manager()
    # Find user by email
    user = await users_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Verify password
    if not fastapi_helper.verify_password(
        pwd_context=pwd_context,
        plain_password=form_data.password,
        hashed_password=user["password"],
    ):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires,
    )
    print(f"Logged in user: {user['email']}, Role: {user['role']}")
    print(f"Access token: {access_token}")
    return {"token": access_token}


class UserRoleResponse(BaseModel):
    role: str


@app.get("/get_user_role", response_model=UserRoleResponse)
async def get_user_role(token: str = Depends(oauth2_scheme)):
    # Use the token to get the user role
    try:
        email, role = fastapi_helper.get_user_role_from_token(
            token, SECRET_KEY, ALGORITHM
        )
        print(
            f"User's role in get_user's role: {role}, email: {email}"
        )  # Print the user's role ("role)
        if role is None:
            raise HTTPException(status_code=401, detail="Role not found in token")
        return {"role": role}  # Return the role
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import HTMLResponse
from csp import generate
from model import Constraint, Course, CreateConstraint, CreateCourse, TimetableAIModel, train_ai_model, predict_timetable, ConstraintTemplate, ConstraintTemplateManager, TimetableCommit, TimetableBranch, commit_timetable, get_commits, get_commit, merge_commits, branch_commit
from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import motor.motor_asyncio
import hypercorn.asyncio
import os
import logging
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
from aiocache import cached
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from starlette.middleware.gzip import GZipMiddleware
import aioredis
import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from fpdf import FPDF
import pandas as pd
import requests
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastAPIIntegration
from prometheus_client import start_http_server, Summary, Counter, Gauge, Histogram
from prometheus_fastapi_instrumentator import Instrumentator

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Get the MongoDB connection string from environment variables
MONGODB_CONNECTION_STRING = os.getenv('MONGODB_CONNECTION_STRING', 'mongodb://localhost:27017/timetable')

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_CONNECTION_STRING, maxPoolSize=50, minPoolSize=10)
database = client.timetable
courses_collection = database.courses
constraints_collection = database.constraints
templates_collection = database.templates
users_collection = database.users
timetables_collection = database.timetables
collaboration_collection = database.collaboration
commits_collection = database.commits
branches_collection = database.branches

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if the plain password matches the hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash the given password.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with the given data and expiration delta.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str) -> Optional[dict]:
    """
    Retrieve a user from the database by username.
    """
    user = await users_collection.find_one({"username": username})
    return user

async def authenticate_user(username: str, password: str) -> Optional[dict]:
    """
    Authenticate a user by username and password.
    """
    user = await get_user(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Retrieve the current user based on the provided JWT token.
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Retrieve the current active user.
    """
    if current_user["disabled"]:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Retrieve the current admin user.
    """
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = None
    role: str

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str
    role: str

class RoleUpdate(BaseModel):
    username: str
    role: str

class Notification(BaseModel):
    user_id: str
    message: str

class CalendarEvent(BaseModel):
    summary: str
    location: str
    description: str
    start: dict
    end: dict

class TimetableAnalytics(BaseModel):
    course_distribution: dict
    instructor_workload: dict
    constraint_satisfaction: dict

class CollaborationAction(BaseModel):
    action: str
    data: dict

class ChatMessage(BaseModel):
    sender: str
    message: str
    timestamp: datetime

class TaskAssignment(BaseModel):
    task: str
    assigned_to: str
    due_date: datetime
    status: str

class TimetableVersion(BaseModel):
    version_id: str
    changes: dict
    timestamp: datetime
    user: str

class TrelloTask(BaseModel):
    name: str
    description: str
    due_date: Optional[datetime] = None
    list_id: str

class AsanaTask(BaseModel):
    name: str
    notes: str
    due_on: Optional[datetime] = None
    projects: List[str]

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """
    Endpoint for user login and access token generation.
    """
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=User)
async def register_user(user: UserCreate) -> User:
    """
    Endpoint for user registration.
    """
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    del user_dict["password"]
    await users_collection.insert_one(user_dict)
    return user_dict

@app.post("/update-role", response_model=User)
async def update_user_role(role_update: RoleUpdate, current_user: User = Depends(get_current_admin_user)) -> User:
    """
    Endpoint to update a user's role.
    """
    result = await users_collection.update_one({"username": role_update.username}, {"$set": {"role": role_update.role}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = await users_collection.find_one({"username": role_update.username})
    return updated_user

@app.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for sending notifications to users.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            notification = Notification(user_id=user_id, message=data)
            await websocket.send_text(f"Notification: {notification.message}")
    except WebSocketDisconnect:
        logger.info(f"User {user_id} disconnected")

@app.post("/calendar/sync", response_model=dict)
async def sync_calendar_event(event: CalendarEvent, current_user: User = Depends(get_current_active_user)) -> dict:
    """
    Endpoint to sync a calendar event with Google Calendar.
    """
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            raise HTTPException(status_code=401, detail="Invalid Google Calendar credentials")
    service = build('calendar', 'v3', credentials=creds)
    event_result = service.events().insert(calendarId='primary', body=event.dict()).execute()
    return event_result

@app.get("/analytics", response_model=TimetableAnalytics)
async def get_timetable_analytics(current_user: User = Depends(get_current_admin_user)) -> TimetableAnalytics:
    """
    Endpoint to retrieve analytics and reporting data for timetables.
    """
    # Placeholder for actual analytics data
    analytics_data = {
        "course_distribution": {"course1": 10, "course2": 5},
        "instructor_workload": {"instructor1": 15, "instructor2": 10},
        "constraint_satisfaction": {"constraint1": 90, "constraint2": 80}
    }
    return TimetableAnalytics(**analytics_data)

@app.websocket("/ws/collaboration/{timetable_id}")
async def collaboration_endpoint(websocket: WebSocket, timetable_id: str):
    """
    WebSocket endpoint for real-time collaboration on timetables.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            action = CollaborationAction(**data)
            # Placeholder for handling collaboration actions
            await websocket.send_json({"status": "success", "action": action.action})
    except WebSocketDisconnect:
        logger.info(f"Collaboration session for timetable {timetable_id} disconnected")

@app.websocket("/ws/chat/{timetable_id}")
async def chat_endpoint(websocket: WebSocket, timetable_id: str):
    """
    WebSocket endpoint for real-time chat and messaging.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            message = ChatMessage(**data)
            await websocket.send_json({"status": "success", "message": message.message})
    except WebSocketDisconnect:
        logger.info(f"Chat session for timetable {timetable_id} disconnected")

@app.post("/assign-task", response_model=TaskAssignment)
async def assign_task(task: TaskAssignment, current_user: User = Depends(get_current_active_user)) -> TaskAssignment:
    """
    Endpoint to assign a task to a team member.
    """
    await collaboration_collection.insert_one(task.dict())
    return task

@app.get("/get-tasks", response_model=List[TaskAssignment])
async def get_tasks(current_user: User = Depends(get_current_active_user)) -> List[TaskAssignment]:
    """
    Endpoint to retrieve a list of assigned tasks.
    """
    tasks = []
    cursor = collaboration_collection.find({})
    async for document in cursor:
        tasks.append(TaskAssignment(**document))
    return tasks

@app.post("/save-version", response_model=TimetableVersion)
async def save_version(version: TimetableVersion, current_user: User = Depends(get_current_active_user)) -> TimetableVersion:
    """
    Endpoint to save a version of the timetable.
    """
    await timetables_collection.insert_one(version.dict())
    return version

@app.get("/get-versions", response_model=List[TimetableVersion])
async def get_versions(current_user: User = Depends(get_current_active_user)) -> List[TimetableVersion]:
    """
    Endpoint to retrieve a list of timetable versions.
    """
    versions = []
    cursor = timetables_collection.find({})
    async for document in cursor:
        versions.append(TimetableVersion(**document))
    return versions

@app.get("/export-analytics")
async def export_analytics(format: str, current_user: User = Depends(get_current_admin_user)):
    """
    Endpoint to export analytics reports in PDF or Excel format.
    """
    analytics_data = await get_timetable_analytics(current_user)
    if format == "pdf":
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Timetable Analytics Report", ln=True, align="C")
        pdf.cell(200, 10, txt=f"Course Distribution: {analytics_data.course_distribution}", ln=True)
        pdf.cell(200, 10, txt=f"Instructor Workload: {analytics_data.instructor_workload}", ln=True)
        pdf.cell(200, 10, txt=f"Constraint Satisfaction: {analytics_data.constraint_satisfaction}", ln=True)
        pdf_output = pdf.output(dest="S").encode("latin1")
        return HTMLResponse(content=pdf_output, media_type="application/pdf")
    elif format == "excel":
        df = pd.DataFrame({
            "Course Distribution": [analytics_data.course_distribution],
            "Instructor Workload": [analytics_data.instructor_workload],
            "Constraint Satisfaction": [analytics_data.constraint_satisfaction]
        })
        excel_output = df.to_excel(index=False)
        return HTMLResponse(content=excel_output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    else:
        raise HTTPException(status_code=400, detail="Invalid format")

@app.get("/get-recommendations")
async def get_recommendations(current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to fetch course recommendations based on user preferences and constraints.
    """
    # Placeholder for actual recommendation logic
    recommendations = [
        {"courseName": "Course 1", "reason": "Based on your preferences"},
        {"courseName": "Course 2", "reason": "Based on your constraints"}
    ]
    return recommendations

@app.post("/commit-timetable", response_model=TimetableCommit)
async def commit_timetable_endpoint(commit: TimetableCommit, current_user: User = Depends(get_current_active_user)) -> TimetableCommit:
    """
    Endpoint to commit a timetable version.
    """
    commit_id = await commit_timetable(commit)
    return {"commit_id": commit_id}

@app.get("/get-commits", response_model=List[TimetableCommit])
async def get_commits_endpoint(current_user: User = Depends(get_current_active_user)) -> List[TimetableCommit]:
    """
    Endpoint to retrieve all timetable commits.
    """
    commits = await get_commits()
    return commits

@app.get("/get-commit/{commit_id}", response_model=TimetableCommit)
async def get_commit_endpoint(commit_id: str, current_user: User = Depends(get_current_active_user)) -> TimetableCommit:
    """
    Endpoint to retrieve a specific commit by ID.
    """
    commit = await get_commit(commit_id)
    if not commit:
        raise HTTPException(status_code=404, detail="Commit not found")
    return commit

@app.post("/merge-commits", response_model=TimetableCommit)
async def merge_commits_endpoint(commit_ids: List[str], current_user: User = Depends(get_current_active_user)) -> TimetableCommit:
    """
    Endpoint to merge two timetable commits.
    """
    merged_commit = await merge_commits(commit_ids)
    return merged_commit

@app.post("/branch-commit", response_model=TimetableBranch)
async def branch_commit_endpoint(commit_id: str, branch_name: str, current_user: User = Depends(get_current_active_user)) -> TimetableBranch:
    """
    Endpoint to create a new branch from a commit.
    """
    branch = await branch_commit(commit_id, branch_name)
    return branch

@app.post("/trello/create-task")
async def create_trello_task(task: TrelloTask, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to create a task in Trello.
    """
    trello_key = os.getenv('TRELLO_API_KEY')
    trello_token = os.getenv('TRELLO_API_TOKEN')
    url = f"https://api.trello.com/1/cards?key={trello_key}&token={trello_token}"
    payload = {
        "name": task.name,
        "desc": task.description,
        "due": task.due_date.isoformat() if task.due_date else None,
        "idList": task.list_id
    }
    response = requests.post(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to create Trello task")
    return response.json()

@app.post("/trello/update-task")
async def update_trello_task(task_id: str, task: TrelloTask, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to update a task in Trello.
    """
    trello_key = os.getenv('TRELLO_API_KEY')
    trello_token = os.getenv('TRELLO_API_TOKEN')
    url = f"https://api.trello.com/1/cards/{task_id}?key={trello_key}&token={trello_token}"
    payload = {
        "name": task.name,
        "desc": task.description,
        "due": task.due_date.isoformat() if task.due_date else None,
        "idList": task.list_id
    }
    response = requests.put(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to update Trello task")
    return response.json()

@app.get("/trello/get-task")
async def get_trello_task(task_id: str, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to retrieve task information from Trello.
    """
    trello_key = os.getenv('TRELLO_API_KEY')
    trello_token = os.getenv('TRELLO_API_TOKEN')
    url = f"https://api.trello.com/1/cards/{task_id}?key={trello_key}&token={trello_token}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to retrieve Trello task")
    return response.json()

@app.post("/asana/create-task")
async def create_asana_task(task: AsanaTask, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to create a task in Asana.
    """
    asana_token = os.getenv('ASANA_API_TOKEN')
    url = "https://app.asana.com/api/1.0/tasks"
    headers = {
        "Authorization": f"Bearer {asana_token}"
    }
    payload = {
        "name": task.name,
        "notes": task.notes,
        "due_on": task.due_on.isoformat() if task.due_on else None,
        "projects": task.projects
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code != 201:
        raise HTTPException(status_code=response.status_code, detail="Failed to create Asana task")
    return response.json()

@app.post("/asana/update-task")
async def update_asana_task(task_id: str, task: AsanaTask, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to update a task in Asana.
    """
    asana_token = os.getenv('ASANA_API_TOKEN')
    url = f"https://app.asana.com/api/1.0/tasks/{task_id}"
    headers = {
        "Authorization": f"Bearer {asana_token}"
    }
    payload = {
        "name": task.name,
        "notes": task.notes,
        "due_on": task.due_on.isoformat() if task.due_on else None,
        "projects": task.projects
    }
    response = requests.put(url, json=payload, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to update Asana task")
    return response.json()

@app.get("/asana/get-task")
async def get_asana_task(task_id: str, current_user: User = Depends(get_current_active_user)):
    """
    Endpoint to retrieve task information from Asana.
    """
    asana_token = os.getenv('ASANA_API_TOKEN')
    url = f"https://app.asana.com/api/1.0/tasks/{task_id}"
    headers = {
        "Authorization": f"Bearer {asana_token}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to retrieve Asana task")
    return response.json()

@app.post("/notifications/send", response_model=Notification)
async def send_notification(notification: Notification, current_user: User = Depends(get_current_active_user)) -> Notification:
    """
    Endpoint to send a notification to a user.
    """
    await collaboration_collection.insert_one(notification.dict())
    return notification

@app.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: User = Depends(get_current_active_user)) -> List[Notification]:
    """
    Endpoint to retrieve notifications for the current user.
    """
    notifications = []
    cursor = collaboration_collection.find({"user_id": current_user["username"]})
    async for document in cursor:
        notifications.append(Notification(**document))
    return notifications

if __name__ == '__main__':
    hypercorn.asyncio.run("app:app", host="0.0.0.0",
                port=8000, reload=True, debug=True)

@app.on_event("startup")
async def on_startup() -> None:
    """
    Event handler for application startup.
    """
    redis = await aioredis.create_redis_pool("redis://localhost", minsize=5, maxsize=10)
    await FastAPILimiter.init(redis)
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN'),
        integrations=[FastAPIIntegration()]
    )
    start_http_server(8001)  # Start Prometheus metrics server
    Instrumentator().instrument(app).expose(app)

@app.get("/get-courses", dependencies=[Depends(RateLimiter(times=10, seconds=60))])
@cached(ttl=60)
async def get_courses(current_user: User = Depends(get_current_active_user), skip: int = 0, limit: int = 10) -> List[Course]:
    """
    Endpoint to retrieve a list of courses.
    """
    courses = []
    cursor = courses_collection.find({}, {"name": 1, "lectureno": 1}).skip(skip).limit(limit)
    async for document in cursor:
        courses.append(Course(**document))
    return courses

@app.get("/get-constraints", dependencies=[Depends(RateLimiter(times=10, seconds=60))])
@cached(ttl=60)
async def get_constraints(current_user: User = Depends(get_current_active_user), skip: int = 0, limit: int = 10) -> List[Constraint]:
    """
    Endpoint to retrieve a list of constraints.
    """
    constraints = []
    cursor = constraints_collection.find({}, {"working_days": 1, "consecutive_subjects": 1}).skip(skip).limit(limit)
    async for document in cursor:
        constraints.append(Constraint(**document))
    return constraints

@app.post("/add-course", response_model=Course)
async def post_course(course: CreateCourse, current_user: User = Depends(get_current_admin_user)) -> Course:
    """
    Endpoint to add a new course.
    """
    document = course.dict()
    await courses_collection.insert_one(document)
    return document

@app.post("/add-constraints", response_model=Constraint)
async def post_constraints(constraint: CreateConstraint, current_user: User = Depends(get_current_admin_user)) -> Constraint:
    """
    Endpoint to add new constraints.
    """
    document = constraint.dict()
    await constraints_collection.insert_one(document)
    return document

@app.get("/generate-timetable")
async def generate_timetable(current_user: User = Depends(get_current_active_user)) -> dict:
    """
    Endpoint to generate a timetable based on constraints and courses.
    """
    constraints = []
    cursor = constraints_collection.find({})
    async for document in cursor:
        constraints.append(Constraint(**document))

    courses = []
    cursor = courses_collection.find({})
    async for document in cursor:
        courses.append(Course(**document))

    if not constraints or not courses:
        logger.error("Constraints or courses are missing")
        return HTMLResponse(status_code=400)

    courses = [item.dict() for item in courses]

    # Load historical data in the specified format
    historical_data = [
        {"features": [0.1, 0.2, 0.3], "label": 1},
        {"features": [0.4, 0.5, 0.6], "label": 0}
    ]

    # Use AI model for timetable prediction
    ai_model = train_ai_model(historical_data)

    # Prepare input data in the specified format
    input_data = [0.7, 0.8, 0.9]
    predicted_timetable = predict_timetable(ai_model, input_data)

    data = generate(constraints[-1].dict(), courses)
    return data

class UpdateCourse(BaseModel):
    name: str
    lectureno: int
    duration: int
    instructor_name: str
    start_hr: int
    end_hr: int

@app.put("/update-course/{course_id}", response_model=Course)
async def update_course(course_id: str, course: UpdateCourse, current_user: User = Depends(get_current_admin_user)) -> Course:
    """
    Endpoint to update an existing course.
    """
    document = course.dict()
    result = await courses_collection.update_one({"_id": course_id}, {"$set": document})
    if result.matched_count == 0:
        logger.error(f"Course with id {course_id} not found")
        raise HTTPException(status_code=404, detail="Course not found")
    updated_course = await courses_collection.find_one({"_id": course_id})
    return updated_course

@app.post("/add-template", response_model=ConstraintTemplate)
async def add_template(template: ConstraintTemplate, current_user: User = Depends(get_current_admin_user)) -> ConstraintTemplate:
    """
    Endpoint to add a new constraint template.
    """
    document = template.dict()
    await templates_collection.insert_one(document)
    return document

@app.get("/get-templates")
async def get_templates(current_user: User = Depends(get_current_active_user)) -> List[ConstraintTemplate]:
    """
    Endpoint to retrieve a list of constraint templates.
    """
    templates = []
    cursor = templates_collection.find({})
    async for document in cursor:
        templates.append(ConstraintTemplate(**document))
    return templates

@app.get("/get-template/{template_id}", response_model=ConstraintTemplate)
async def get_template(template_id: str, current_user: User = Depends(get_current_active_user)) -> ConstraintTemplate:
    """
    Endpoint to retrieve a specific constraint template by ID.
    """
    document = await templates_collection.find_one({"_id": template_id})
    if document is None:
        logger.error(f"Template with id {template_id} not found")
        raise HTTPException(status_code=404, detail="Template not found")
    return ConstraintTemplate(**document)

@app.post("/import-template", response_model=ConstraintTemplate)
async def import_template(template: ConstraintTemplate, current_user: User = Depends(get_current_admin_user)) -> ConstraintTemplate:
    """
    Endpoint to import a constraint template.
    """
    document = template.dict()
    await templates_collection.insert_one(document)
    return document

@app.get("/export-template/{template_id}", response_model=ConstraintTemplate)
async def export_template(template_id: str, current_user: User = Depends(get_current_active_user)) -> ConstraintTemplate:
    """
    Endpoint to export a constraint template by ID.
    """
    document = await templates_collection.find_one({"_id": template_id})
    if document is None:
        logger.error(f"Template with id {template_id} not found")
        raise HTTPException(status_code=404, detail="Template not found")
    return ConstraintTemplate(**document)

# Prometheus and Grafana setup instructions
"""
To set up Prometheus and Grafana for monitoring the FastAPI application, follow these steps:

1. Install Prometheus and Grafana:
   - Prometheus: https://prometheus.io/docs/prometheus/latest/installation/
   - Grafana: https://grafana.com/docs/grafana/latest/installation/

2. Configure Prometheus to scrape metrics from the FastAPI application:
   - Add the following job to the Prometheus configuration file (prometheus.yml):
     scrape_configs:
       - job_name: 'fastapi'
         static_configs:
           - targets: ['localhost:8001']

3. Start Prometheus and Grafana:
   - Prometheus: ./prometheus --config.file=prometheus.yml
   - Grafana: ./bin/grafana-server

4. Add Prometheus as a data source in Grafana:
   - Open Grafana in a web browser (default: http://localhost:3000)
   - Go to Configuration > Data Sources > Add data source
   - Select Prometheus and configure the URL (default: http://localhost:9090)

5. Create Grafana dashboards to visualize the metrics collected by Prometheus.
"""


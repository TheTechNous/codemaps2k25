# API Documentation

## Table of Contents

1. [Endpoints](#endpoints)
   - [GET /get-courses](#get-get-courses)
   - [GET /get-constraints](#get-get-constraints)
   - [POST /add-course](#post-add-course)
   - [POST /add-constraints](#post-add-constraints)
   - [GET /generate-timetable](#get-generate-timetable)
   - [PUT /update-course/{course_id}](#put-update-coursecourse_id)
   - [POST /add-template](#post-add-template)
   - [GET /get-templates](#get-get-templates)
   - [GET /get-template/{template_id}](#get-get-templatetemplate_id)
   - [POST /import-template](#post-import-template)
   - [GET /export-template/{template_id}](#get-export-templatetemplate_id)
   - [POST /token](#post-token)
   - [POST /register](#post-register)
   - [GET /get-current-user](#get-get-current-user)
   - [GET /get-current-active-user](#get-get-current-active-user)
   - [GET /get-current-admin-user](#get-get-current-admin-user)
   - [GET /analytics](#get-analytics)
   - [GET /export-analytics](#get-export-analytics)
   - [POST /assign-task](#post-assign-task)
   - [GET /get-tasks](#get-get-tasks)
   - [POST /save-version](#post-save-version)
   - [GET /get-versions](#get-get-versions)
   - [GET /get-recommendations](#get-get-recommendations)
   - [GET /ws/collaboration/{timetable_id}](#get-wscollaborationtimetable_id)
   - [GET /ws/chat/{timetable_id}](#get-wschattimetable_id)
   - [POST /commit-timetable](#post-commit-timetable)
   - [GET /get-commits](#get-get-commits)
   - [GET /get-commit/{commit_id}](#get-get-commitcommit_id)
   - [POST /merge-commits](#post-merge-commits)
   - [POST /branch-commit](#post-branch-commit)
   - [POST /trello/create-task](#post-trello-create-task)
   - [POST /trello/update-task](#post-trello-update-task)
   - [GET /trello/get-task](#get-trello-get-task)
   - [POST /asana/create-task](#post-asana-create-task)
   - [POST /asana/update-task](#post-asana-update-task)
   - [GET /asana/get-task](#get-asana-get-task)
2. [Error Codes](#error-codes)
3. [Usage Scenarios](#usage-scenarios)

## Endpoints

### `GET /get-courses`

Retrieve a list of all courses.

**Response:**

```json
[
  {
    "id": "60c72b2f9b1e8a001c8e4d3b",
    "name": "Test Course",
    "lectureno": 10,
    "duration": 2,
    "instructor_name": "Test Instructor",
    "start_hr": 9,
    "end_hr": 11
  }
]
```

### `GET /get-constraints`

Retrieve a list of all constraints.

**Response:**

```json
[
  {
    "id": "60c72b2f9b1e8a001c8e4d3c",
    "working_days": [
      {
        "day": "Monday",
        "start_hr": 9,
        "end_hr": 17,
        "total_hours": 8
      }
    ],
    "consecutive_subjects": ["Math", "Science"],
    "non_consecutive_subjects": ["History", "Art"]
  }
]
```

### `POST /add-course`

Add a new course.

**Request Body:**

```json
{
  "name": "Test Course",
  "lectureno": 10,
  "duration": 2,
  "instructor_name": "Test Instructor",
  "start_hr": 9,
  "end_hr": 11
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3b",
  "name": "Test Course",
  "lectureno": 10,
  "duration": 2,
  "instructor_name": "Test Instructor",
  "start_hr": 9,
  "end_hr": 11
}
```

### `POST /add-constraints`

Add new constraints.

**Request Body:**

```json
{
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3c",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

### `GET /generate-timetable`

Generate a timetable based on the provided constraints and courses.

**Response:**

```json
{
  "monday": [
    {
      "id": 1,
      "name": "Math",
      "type": "custom",
      "startTime": "2018-02-25T09:00:00",
      "endTime": "2018-02-25T10:00:00"
    }
  ],
  "tuesday": [],
  "wednesday": [],
  "thursday": [],
  "friday": [],
  "saturday": [],
  "sunday": []
}
```

### `PUT /update-course/{course_id}`

Update an existing course.

**Request Body:**

```json
{
  "name": "Updated Course",
  "lectureno": 15,
  "duration": 3,
  "instructor_name": "Updated Instructor",
  "start_hr": 10,
  "end_hr": 12
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3b",
  "name": "Updated Course",
  "lectureno": 15,
  "duration": 3,
  "instructor_name": "Updated Instructor",
  "start_hr": 10,
  "end_hr": 12
}
```

### `POST /add-template`

Add a new constraint template.

**Request Body:**

```json
{
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3d",
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

### `GET /get-templates`

Retrieve a list of all constraint templates.

**Response:**

```json
[
  {
    "id": "60c72b2f9b1e8a001c8e4d3d",
    "name": "Test Template",
    "working_days": [
      {
        "day": "Monday",
        "start_hr": 9,
        "end_hr": 17,
        "total_hours": 8
      }
    ],
    "consecutive_subjects": ["Math", "Science"],
    "non_consecutive_subjects": ["History", "Art"]
  }
]
```

### `GET /get-template/{template_id}`

Retrieve a specific constraint template by its ID.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3d",
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

### `POST /import-template`

Import a constraint template.

**Request Body:**

```json
{
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3d",
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

### `GET /export-template/{template_id}`

Export a specific constraint template by its ID.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3d",
  "name": "Test Template",
  "working_days": [
    {
      "day": "Monday",
      "start_hr": 9,
      "end_hr": 17,
      "total_hours": 8
    }
  ],
  "consecutive_subjects": ["Math", "Science"],
  "non_consecutive_subjects": ["History", "Art"]
}
```

### `POST /token`

Generate an access token for user authentication.

**Request Body:**

```json
{
  "username": "testuser",
  "password": "testpassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTYyMzQ2OTYwMH0.4f3d5e5f5d6e5f5d6e5f5d6e5f5d6e5f5d6e5f5d6e5f5d6e5f5d6",
  "token_type": "bearer"
}
```

### `POST /register`

Register a new user.

**Request Body:**

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "password": "testpassword",
  "role": "user"
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3e",
  "username": "testuser",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "role": "user"
}
```

### `GET /get-current-user`

Retrieve the current authenticated user.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3e",
  "username": "testuser",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "role": "user"
}
```

### `GET /get-current-active-user`

Retrieve the current active user.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3e",
  "username": "testuser",
  "email": "testuser@example.com",
  "full_name": "Test User",
  "role": "user"
}
```

### `GET /get-current-admin-user`

Retrieve the current admin user.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3e",
  "username": "adminuser",
  "email": "adminuser@example.com",
  "full_name": "Admin User",
  "role": "admin"
}
```

### `GET /analytics`

Retrieve analytics and reporting data for timetables.

**Response:**

```json
{
  "course_distribution": {
    "course1": 10,
    "course2": 5
  },
  "instructor_workload": {
    "instructor1": 15,
    "instructor2": 10
  },
  "constraint_satisfaction": {
    "constraint1": 90,
    "constraint2": 80
  }
}
```

### `GET /export-analytics`

Export analytics reports in PDF or Excel format.

**Request Parameters:**

- `format`: The format of the report (pdf or excel).

**Response:**

- PDF: A PDF file containing the analytics report.
- Excel: An Excel file containing the analytics report.

### `POST /assign-task`

Assign a task to a team member.

**Request Body:**

```json
{
  "task": "Test Task",
  "assigned_to": "test_user",
  "due_date": "2023-01-01T00:00:00Z",
  "status": "pending"
}
```

**Response:**

```json
{
  "task": "Test Task",
  "assigned_to": "test_user",
  "due_date": "2023-01-01T00:00:00Z",
  "status": "pending"
}
```

### `GET /get-tasks`

Retrieve a list of assigned tasks.

**Response:**

```json
[
  {
    "task": "Test Task",
    "assigned_to": "test_user",
    "due_date": "2023-01-01T00:00:00Z",
    "status": "pending"
  }
]
```

### `POST /save-version`

Save a version of the timetable.

**Request Body:**

```json
{
  "version_id": "test_version_id",
  "changes": {
    "change": "test_change"
  },
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "test_user"
}
```

**Response:**

```json
{
  "version_id": "test_version_id",
  "changes": {
    "change": "test_change"
  },
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "test_user"
}
```

### `GET /get-versions`

Retrieve a list of timetable versions.

**Response:**

```json
[
  {
    "version_id": "test_version_id",
    "changes": {
      "change": "test_change"
    },
    "timestamp": "2023-01-01T00:00:00Z",
    "user": "test_user"
  }
]
```

### `GET /get-recommendations`

Fetch course recommendations based on user preferences and constraints.

**Response:**

```json
[
  {
    "courseName": "Course 1",
    "reason": "Based on your preferences"
  },
  {
    "courseName": "Course 2",
    "reason": "Based on your constraints"
  }
]
```

### `GET /ws/collaboration/{timetable_id}`

WebSocket endpoint for real-time collaboration on timetables.

**Request Parameters:**

- `timetable_id`: The ID of the timetable.

**Response:**

- WebSocket connection for real-time collaboration.

### `GET /ws/chat/{timetable_id}`

WebSocket endpoint for real-time chat and messaging.

**Request Parameters:**

- `timetable_id`: The ID of the timetable.

**Response:**

- WebSocket connection for real-time chat and messaging.

### `POST /commit-timetable`

Commit a timetable version.

**Request Body:**

```json
{
  "commit_id": "test_commit_id",
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "test_user",
  "changes": {
    "change": "test_change"
  }
}
```

**Response:**

```json
{
  "commit_id": "test_commit_id",
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "test_user",
  "changes": {
    "change": "test_change"
  }
}
```

### `GET /get-commits`

Retrieve all timetable commits.

**Response:**

```json
[
  {
    "commit_id": "test_commit_id",
    "timestamp": "2023-01-01T00:00:00Z",
    "user": "test_user",
    "changes": {
      "change": "test_change"
    }
  }
]
```

### `GET /get-commit/{commit_id}`

Retrieve a specific commit by ID.

**Request Parameters:**

- `commit_id`: The ID of the commit.

**Response:**

```json
{
  "commit_id": "test_commit_id",
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "test_user",
  "changes": {
    "change": "test_change"
  }
}
```

### `POST /merge-commits`

Merge two timetable commits.

**Request Body:**

```json
{
  "commit_ids": ["commit_id_1", "commit_id_2"]
}
```

**Response:**

```json
{
  "commit_id": "merged_commit_id",
  "timestamp": "2023-01-01T00:00:00Z",
  "user": "merged_user",
  "changes": {
    "change": "merged_change"
  }
}
```

### `POST /branch-commit`

Create a new branch from a commit.

**Request Body:**

```json
{
  "commit_id": "test_commit_id",
  "branch_name": "test_branch"
}
```

**Response:**

```json
{
  "branch_name": "test_branch",
  "commit_id": "test_commit_id"
}
```

### `POST /trello/create-task`

Create a task in Trello.

**Request Body:**

```json
{
  "name": "Test Task",
  "description": "This is a test task",
  "due_date": "2023-01-01T00:00:00Z",
  "list_id": "test_list_id"
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3f",
  "name": "Test Task",
  "description": "This is a test task",
  "due_date": "2023-01-01T00:00:00Z",
  "list_id": "test_list_id"
}
```

### `POST /trello/update-task`

Update a task in Trello.

**Request Body:**

```json
{
  "task_id": "60c72b2f9b1e8a001c8e4d3f",
  "name": "Updated Task",
  "description": "This is an updated test task",
  "due_date": "2023-01-02T00:00:00Z",
  "list_id": "updated_list_id"
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3f",
  "name": "Updated Task",
  "description": "This is an updated test task",
  "due_date": "2023-01-02T00:00:00Z",
  "list_id": "updated_list_id"
}
```

### `GET /trello/get-task`

Retrieve task information from Trello.

**Request Parameters:**

- `task_id`: The ID of the task.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d3f",
  "name": "Test Task",
  "description": "This is a test task",
  "due_date": "2023-01-01T00:00:00Z",
  "list_id": "test_list_id"
}
```

### `POST /asana/create-task`

Create a task in Asana.

**Request Body:**

```json
{
  "name": "Test Task",
  "notes": "These are test notes",
  "due_on": "2023-01-01",
  "projects": ["test_project_id"]
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d40",
  "name": "Test Task",
  "notes": "These are test notes",
  "due_on": "2023-01-01",
  "projects": ["test_project_id"]
}
```

### `POST /asana/update-task`

Update a task in Asana.

**Request Body:**

```json
{
  "task_id": "60c72b2f9b1e8a001c8e4d40",
  "name": "Updated Task",
  "notes": "These are updated test notes",
  "due_on": "2023-01-02",
  "projects": ["updated_project_id"]
}
```

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d40",
  "name": "Updated Task",
  "notes": "These are updated test notes",
  "due_on": "2023-01-02",
  "projects": ["updated_project_id"]
}
```

### `GET /asana/get-task`

Retrieve task information from Asana.

**Request Parameters:**

- `task_id`: The ID of the task.

**Response:**

```json
{
  "id": "60c72b2f9b1e8a001c8e4d40",
  "name": "Test Task",
  "notes": "These are test notes",
  "due_on": "2023-01-01",
  "projects": ["test_project_id"]
}
```

## Error Codes

The following error codes may be returned by the API:

- `400 Bad Request`: The request was invalid or cannot be processed.
- `401 Unauthorized`: Authentication is required and has failed or has not yet been provided.
- `403 Forbidden`: The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: An error occurred on the server side.

## Usage Scenarios

### Scenario 1: Registering a new user

1. Send a `POST /register` request with the user's details.
2. Receive a response with the registered user's information.

### Scenario 2: Logging in and obtaining an access token

1. Send a `POST /token` request with the user's username and password.
2. Receive a response with the access token.

### Scenario 3: Retrieving a list of courses

1. Send a `GET /get-courses` request with a valid access token.
2. Receive a response with the list of courses.

### Scenario 4: Adding a new course

1. Send a `POST /add-course` request with the course details and a valid access token.
2. Receive a response with the added course's information.

### Scenario 5: Generating a timetable

1. Send a `GET /generate-timetable` request with a valid access token.
2. Receive a response with the generated timetable.

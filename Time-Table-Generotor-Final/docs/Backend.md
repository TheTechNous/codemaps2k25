# Backend Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [API Endpoints](#api-endpoints)
   - [Courses](#courses)
   - [Constraints](#constraints)
   - [Timetable](#timetable)
   - [Templates](#templates)
   - [Analytics](#analytics)
   - [Recommendations](#recommendations)
6. [AI Model](#ai-model)
   - [Training the AI Model](#training-the-ai-model)
   - [Predicting Timetables](#predicting-timetables)
7. [Logging](#logging)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Detailed Explanation of the AI Model and Training Process](#detailed-explanation-of-the-ai-model-and-training-process)
   - [AI Model Architecture](#ai-model-architecture)
   - [Training Process](#training-process)
   - [Using the Trained AI Model](#using-the-trained-ai-model)

## Overview

The backend of the Time Table Generator project is built using FastAPI, a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints. The backend handles the core logic of the application, including managing courses, constraints, and generating timetables.

## Architecture

The backend architecture consists of the following main components:

1. **FastAPI**: The web framework used to build the API endpoints.
2. **MongoDB**: The database used to store courses, constraints, and templates.
3. **Pydantic**: Used for data validation and serialization.
4. **TensorFlow**: Used for the AI model to predict timetables.
5. **Motor**: An asynchronous MongoDB driver for Python.
6. **Hypercorn**: An ASGI server used to serve the FastAPI application.

## Technologies Used

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **MongoDB**: A NoSQL database used to store courses, constraints, and templates.
- **Pydantic**: A data validation and settings management library using Python type annotations.
- **TensorFlow**: An open-source machine learning framework used for the AI model.
- **Motor**: An asynchronous MongoDB driver for Python.
- **Hypercorn**: A lightning-fast ASGI server implementation, using `uvloop` and `httptools`.

## Setup Instructions

### Prerequisites

- Python 3.6+
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/time-table-generator.git
cd time-table-generator
```

2. Navigate to the `Backend` directory:

```bash
cd Backend
```

3. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

4. Install the required dependencies:

```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the `Backend` directory and add the following environment variables:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/timetable
```

6. Start the backend server:

```bash
hypercorn app:app --reload
```

## API Endpoints

### Courses

- `GET /get-courses`: Retrieve a list of all courses.
- `POST /add-course`: Add a new course.
- `PUT /update-course/{course_id}`: Update an existing course.

### Constraints

- `GET /get-constraints`: Retrieve a list of all constraints.
- `POST /add-constraints`: Add new constraints.

### Timetable

- `GET /generate-timetable`: Generate a timetable based on the provided constraints and courses.

### Templates

- `POST /add-template`: Add a new constraint template.
- `GET /get-templates`: Retrieve a list of all constraint templates.
- `GET /get-template/{template_id}`: Retrieve a specific constraint template by its ID.
- `POST /import-template`: Import a constraint template.
- `GET /export-template/{template_id}`: Export a specific constraint template by its ID.

### Analytics

- `GET /analytics`: Retrieve analytics and reporting data for timetables.
- `GET /export-analytics`: Export analytics reports in PDF or Excel format.

### Recommendations

- `GET /get-recommendations`: Fetch course recommendations based on user preferences and constraints.

### User Management

- `POST /token`: Generate an access token for user authentication.
- `POST /register`: Register a new user.
- `POST /update-role`: Update a user's role.
- `GET /get-current-user`: Retrieve the current authenticated user.
- `GET /get-current-active-user`: Retrieve the current active user.
- `GET /get-current-admin-user`: Retrieve the current admin user.

### Notifications

- `GET /ws/notifications/{user_id}`: WebSocket endpoint for sending notifications to users.

### Calendar Integration

- `POST /calendar/sync`: Sync a calendar event with Google Calendar.

### Collaboration

- `GET /ws/collaboration/{timetable_id}`: WebSocket endpoint for real-time collaboration on timetables.
- `GET /ws/chat/{timetable_id}`: WebSocket endpoint for real-time chat and messaging.
- `POST /assign-task`: Assign a task to a team member.
- `GET /get-tasks`: Retrieve a list of assigned tasks.
- `POST /save-version`: Save a version of the timetable.
- `GET /get-versions`: Retrieve a list of timetable versions.
- `POST /commit-timetable`: Commit a timetable version.
- `GET /get-commits`: Retrieve all timetable commits.
- `GET /get-commit/{commit_id}`: Retrieve a specific commit by ID.
- `POST /merge-commits`: Merge two timetable commits.
- `POST /branch-commit`: Create a new branch from a commit.

### Task Management

- `POST /trello/create-task`: Create a task in Trello.
- `POST /trello/update-task`: Update a task in Trello.
- `GET /trello/get-task`: Retrieve task information from Trello.
- `POST /asana/create-task`: Create a task in Asana.
- `POST /asana/update-task`: Update a task in Asana.
- `GET /asana/get-task`: Retrieve task information from Asana.

## AI Model

The AI model is used to predict timetables based on historical data. The model is built using TensorFlow and consists of a bidirectional LSTM (Long Short-Term Memory) network. The model is trained on historical data and can be used to predict timetables based on input features.

### Training the AI Model

The historical data for training the AI model should be in the following format:

- A list of dictionaries, where each dictionary represents a data point.
- Each dictionary should have two keys: 'features' and 'label'.
  - 'features' should be a list of numerical values representing time series data.
  - 'label' should be a numerical value representing the target variable.

Example:

```python
historical_data = [
    {"features": [0.1, 0.2, 0.3], "label": 1},
    {"features": [0.4, 0.5, 0.6], "label": 0}
]
```

To train the AI model, use the `train_ai_model` function provided in the `model.py` file. The function takes the historical data as input and returns a trained AI model.

### Predicting Timetables

To predict timetables using the trained AI model, use the `predict_timetable` function provided in the `model.py` file. The function takes the trained AI model and input data as input and returns the predicted timetable.

## Logging

The backend uses the `logging` module to log important events and errors. The logging configuration is set up in the `app.py` file. The logs are printed to the console and can be used for debugging and monitoring purposes.

## Error Handling

The backend uses FastAPI's built-in error handling mechanisms to handle errors and exceptions. Custom error messages are returned for specific error cases, such as when a course or constraint is not found.

## Testing

The backend includes tests for the API endpoints and core functionality. The tests are written using `pytest` and can be found in the `tests` directory. To run the tests, use the following command:

```bash
pytest
```

## Deployment

To deploy the backend, you can use Docker. A `Dockerfile` is provided in the root directory of the project. To build and run the Docker container, use the following commands:

1. Build the Docker image:

```bash
docker build -t timetable-generator .
```

2. Run the Docker container:

```bash
docker run -p 8000:8000 timetable-generator
```

Alternatively, you can use Docker Compose to start the services. A `docker-compose.yml` file is provided in the root directory of the project. To start the services using Docker Compose, use the following command:

```bash
docker-compose up
```

## Detailed Explanation of the AI Model and Training Process

The AI model used in the Time Table Generator project is designed to predict timetables based on historical data. The model is built using TensorFlow and consists of a bidirectional LSTM (Long Short-Term Memory) network. The LSTM network is well-suited for time series data and can capture long-term dependencies in the data.

### AI Model Architecture

The AI model architecture consists of the following layers:

1. **Input Layer**: The input layer takes in the time series data as input features.
2. **Bidirectional LSTM Layer**: The bidirectional LSTM layer processes the input data in both forward and backward directions, capturing long-term dependencies in the data.
3. **Dense Layer**: The dense layer is a fully connected layer that maps the output of the LSTM layer to the target variable.
4. **Output Layer**: The output layer produces the final prediction.

### Training Process

The training process for the AI model involves the following steps:

1. **Data Preparation**: The historical data is prepared in the required format, with each data point represented as a dictionary containing 'features' and 'label' keys.
2. **Model Initialization**: The AI model is initialized with the specified architecture.
3. **Model Training**: The model is trained on the historical data using the `train_ai_model` function. The training process involves optimizing the model's parameters to minimize the prediction error.
4. **Model Evaluation**: The trained model is evaluated on a validation dataset to assess its performance and generalization ability.

### Using the Trained AI Model

Once the AI model is trained, it can be used to predict timetables based on input features. The `predict_timetable` function takes the trained AI model and input data as input and returns the predicted timetable. The input data should be in the same format as the historical data used for training.

Example:

```python
# Load historical data in the specified format
historical_data = [
    {"features": [0.1, 0.2, 0.3], "label": 1},
    {"features": [0.4, 0.5, 0.6], "label": 0}
]

# Train the AI model
ai_model = train_ai_model(historical_data)

# Prepare input data in the specified format
input_data = [0.7, 0.8, 0.9]

# Predict the timetable using the trained AI model
predicted_timetable = predict_timetable(ai_model, input_data)
```

The predicted timetable can then be used to generate the final timetable based on the provided constraints and courses.

## Logging and Error Handling Mechanisms

The backend includes logging and error handling mechanisms to capture and log errors effectively. The `logging` module is used to log important events and errors. The logging configuration is set up in the `app.py` file. The logs are printed to the console and can be used for debugging and monitoring purposes.

The backend uses FastAPI's built-in error handling mechanisms to handle errors and exceptions. Custom error messages are returned for specific error cases, such as when a course or constraint is not found. The error handling mechanisms ensure that the backend can gracefully handle errors and provide meaningful error messages to the users.

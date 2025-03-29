# Time Table Generator

This project is a Time Table Generator that allows users to create and manage timetables for various courses and constraints.

## Table of Contents

1. [Overview](#overview)
2. [Setup and Run the Project](#setup-and-run-the-project)
   - [Backend](#backend)
   - [Frontend](#frontend)
   - [Docker](#docker)
   - [Docker Compose](#docker-compose)
   - [Nix](#nix)
3. [Running the Tests](#running-the-tests)
   - [Backend Tests](#backend-tests)
   - [Frontend Tests](#frontend-tests)
4. [Format of Historical Data for AI Model](#format-of-historical-data-for-ai-model)
5. [API Documentation](#api-documentation)
   - [Endpoints](#endpoints)
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
   - [Request and Response Examples](#request-and-response-examples)
     - [POST /add-course](#post-add-course)
     - [POST /add-constraints](#post-add-constraints)
     - [GET /generate-timetable](#get-generate-timetable)
6. [Documentation](#documentation)
7. [Contributing Guidelines](#contributing-guidelines)

## Overview

The Time Table Generator project is designed to help users create and manage timetables for various courses and constraints. It consists of a backend server built with FastAPI and a frontend application built with React. The project also includes an AI model for timetable prediction and a recommendation system for course suggestions.

## Setup and Run the Project

### Backend

1. Install the required dependencies:

```bash
pip install -r Backend/requirements.txt
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

4. Create a `.env` file in the `Backend` directory and add the following environment variables:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/timetable
SECRET_KEY=your_secret_key
```

5. Start the backend server:

```bash
hypercorn app:app --reload
```

### Frontend

1. Install the required dependencies:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm start
```

### Docker

1. Build the Docker image:

```bash
docker build -t timetable-generator .
```

2. Run the Docker container:

```bash
docker run -p 8000:8000 timetable-generator
```

### Docker Compose

1. Start the services using Docker Compose:

```bash
docker-compose up
```

### Nix

1. Install Nix package manager by following the instructions on the [Nix website](https://nixos.org/download.html).

2. Enable flakes by adding the following lines to your `~/.config/nix/nix.conf` file:

```conf
experimental-features = nix-command flakes
```

3. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/ayanalamMOON/Time-Table-Generotor-Final.git
cd Time-Table-Generotor-Final
```

4. Run the development shell using Nix flakes:

```bash
nix develop
```

5. Activate the virtual environment:

```bash
source venv/bin/activate
```

6. Start the backend server:

```bash
hypercorn app:app --reload
```

7. In a new terminal, navigate to the project directory and start the frontend development server:

```bash
npm start
```

## Running the Tests

To run the tests for this project, follow the instructions below:

### Backend Tests

1. Install the required dependencies:

```bash
pip install -r Backend/requirements.txt
```

2. Navigate to the `Backend` directory:

```bash
cd Backend
```

3. Run the tests using `pytest`:

```bash
pytest
```

4. To check if the project is running, run the following test:

```bash
pytest Backend/tests/test_app.py::test_project_running
```

### Frontend Tests

1. Install the required dependencies:

```bash
npm install
```

2. Run the tests using `Jest`:

```bash
npm test
```

The tests will run and display the results in the terminal.

## Format of Historical Data for AI Model

The historical data for the AI model should be in the following format:

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

## API Documentation

### Endpoints

#### `GET /get-courses`

Retrieve a list of all courses.

#### `GET /get-constraints`

Retrieve a list of all constraints.

#### `POST /add-course`

Add a new course.

#### `POST /add-constraints`

Add new constraints.

#### `GET /generate-timetable`

Generate a timetable based on the provided constraints and courses.

#### `PUT /update-course/{course_id}`

Update an existing course.

#### `POST /add-template`

Add a new constraint template.

#### `GET /get-templates`

Retrieve a list of all constraint templates.

#### `GET /get-template/{template_id}`

Retrieve a specific constraint template by its ID.

#### `POST /import-template`

Import a constraint template.

#### `GET /export-template/{template_id}`

Export a specific constraint template by its ID.

#### `POST /token`

Generate an access token for user authentication.

#### `POST /register`

Register a new user.

#### `GET /get-current-user`

Retrieve the current authenticated user.

#### `GET /get-current-active-user`

Retrieve the current active user.

#### `GET /get-current-admin-user`

Retrieve the current admin user.

#### `GET /analytics`

Retrieve analytics and reporting data for timetables.

#### `GET /export-analytics`

Export analytics reports in PDF or Excel format.

#### `POST /assign-task`

Assign a task to a team member.

#### `GET /get-tasks`

Retrieve a list of assigned tasks.

#### `POST /save-version`

Save a version of the timetable.

#### `GET /get-versions`

Retrieve a list of timetable versions.

#### `GET /get-recommendations`

Fetch course recommendations based on user preferences and constraints.

#### `GET /ws/collaboration/{timetable_id}`

WebSocket endpoint for real-time collaboration on timetables.

#### `GET /ws/chat/{timetable_id}`

WebSocket endpoint for real-time chat and messaging.

#### `POST /commit-timetable`

Commit a timetable version.

#### `GET /get-commits`

Retrieve all timetable commits.

#### `GET /get-commit/{commit_id}`

Retrieve a specific commit by ID.

#### `POST /merge-commits`

Merge two timetable commits.

#### `POST /branch-commit`

Create a new branch from a commit.

#### `POST /trello/create-task`

Create a task in Trello.

#### `POST /trello/update-task`

Update a task in Trello.

#### `GET /trello/get-task`

Retrieve task information from Trello.

#### `POST /asana/create-task`

Create a task in Asana.

#### `POST /asana/update-task`

Update a task in Asana.

#### `GET /asana/get-task`

Retrieve task information from Asana.

### Request and Response Examples

#### `POST /add-course`

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

#### `POST /add-constraints`

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

#### `GET /generate-timetable`

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

## Documentation

For more detailed documentation, please refer to the following files:

- [Backend Documentation](docs/Backend.md)
- [Frontend Documentation](docs/Frontend.md)
- [API Documentation](docs/API.md)
- [Setup Documentation](docs/Setup.md)

## Contributing Guidelines

Thank you for considering contributing to our project! We welcome contributions from the community and are grateful for your support. This document provides guidelines on how to contribute to the project, including coding standards, testing procedures, and the process for submitting pull requests.

### Table of Contents

1. [Getting Started](#getting-started)
2. [Coding Standards](#coding-standards)
3. [Code Formatting Guidelines](#code-formatting-guidelines)
4. [Testing Procedures](#testing-procedures)
5. [Submitting Pull Requests](#submitting-pull-requests)
6. [Code of Conduct](#code-of-conduct)

### Getting Started

To get started with contributing to the project, follow these steps:

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes in the new branch.
5. Commit your changes with clear and descriptive commit messages.
6. Push your changes to your forked repository.
7. Create a pull request to the main repository.

### Coding Standards

To ensure consistent code quality and maintainability, please follow these coding standards:

- Use ESLint and Prettier for consistent code formatting. The repository includes configuration files for these tools (`.eslintrc.json` and `.prettierrc`).
- Add type annotations to Python code to improve code quality and readability.
- Ensure that all functions and classes have docstrings to provide clear explanations of their purpose and usage.
- Follow the existing code style and conventions used in the project.

### Code Formatting Guidelines

To ensure consistent code formatting in the repository, follow these guidelines:

- Use ESLint and Prettier for consistent code formatting. The repository includes configuration files for these tools (`.eslintrc.json` and `.prettierrc`).
- Add a pre-commit hook to automatically run ESLint and Prettier on staged files before each commit. This is configured using Husky and lint-staged.
- Configure your IDE or code editor to use the ESLint and Prettier settings from the repository. This will help maintain consistent formatting while writing code.
- Regularly run ESLint and Prettier on the entire codebase to ensure all files adhere to the defined formatting rules.
- For Python code, use Black for code formatting. The repository includes a configuration file for Black (`pyproject.toml`).
- Document the code formatting guidelines in the `CONTRIBUTING.md` file to guide new contributors on the project's coding standards.

### Testing Procedures

To maintain a high level of code quality, please follow these testing procedures:

- Write tests for any new functionality or changes to existing functionality.
- Ensure that all critical functionality is covered by tests.
- Use the existing test files (`Backend/tests/test_app.py`, `Backend/tests/test_csp.py`, and `Backend/tests/test_model.py`) as examples for writing new tests.
- Run all tests locally before submitting a pull request to ensure that they pass.

### Submitting Pull Requests

To submit a pull request, follow these steps:

1. Ensure that your changes are based on the latest version of the main branch.
2. Create a pull request with a clear and descriptive title and description of your changes.
3. Include any relevant issue numbers in the pull request description.
4. Ensure that all tests pass and that your changes do not introduce any new issues.
5. Be responsive to any feedback or requests for changes from the project maintainers.

### Code of Conduct

We are committed to fostering a welcoming and inclusive community. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) when participating in the project.

Thank you for your contributions!

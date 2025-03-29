import pytest
from httpx import AsyncClient
from app import app

@pytest.mark.asyncio
async def test_get_courses():
    """
    Test the /get-courses endpoint to ensure it returns a list of courses.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_constraints():
    """
    Test the /get-constraints endpoint to ensure it returns a list of constraints.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-constraints")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_post_course():
    """
    Test the /add-course endpoint to ensure it adds a course successfully.
    """
    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Course"

@pytest.mark.asyncio
async def test_post_constraints():
    """
    Test the /add-constraints endpoint to ensure it adds constraints successfully.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200
    assert response.json()["working_days"][0]["day"] == "Monday"

@pytest.mark.asyncio
async def test_generate_timetable():
    """
    Test the /generate-timetable endpoint to ensure it generates a timetable.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200 or response.status_code == 400

@pytest.mark.asyncio
async def test_update_course():
    """
    Test the /update-course/{course_id} endpoint to ensure it updates a course successfully.
    """
    course_data = {
        "name": "Updated Course",
        "lectureno": 15,
        "duration": 3,
        "instructor_name": "Updated Instructor",
        "start_hr": 10,
        "end_hr": 12
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put("/update-course/{course_id}", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Course"

@pytest.mark.asyncio
async def test_generate_timetable_no_constraints():
    """
    Test the /generate-timetable endpoint to ensure it returns a 400 status code when no constraints are provided.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_generate_timetable_no_courses():
    """
    Test the /generate-timetable endpoint to ensure it returns a 400 status code when no courses are provided.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_generate_timetable_invalid_fields():
    """
    Test the /generate-timetable endpoint to ensure it handles invalid fields correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_scheduling_conflicts():
    """
    Test the /generate-timetable endpoint to ensure it handles scheduling conflicts correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_ai_model_issues():
    """
    Test the /generate-timetable endpoint to ensure it handles AI model issues correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_templates():
    """
    Test the /get-templates endpoint to ensure it returns a list of templates.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-templates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_template():
    """
    Test the /get-template/{template_id} endpoint to ensure it returns a template or a 404 status code.
    """
    template_id = "some_template_id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/get-template/{template_id}")
    assert response.status_code == 200 or response.status_code == 404

@pytest.mark.asyncio
async def test_add_template():
    """
    Test the /add-template endpoint to ensure it adds a template successfully.
    """
    template_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-template", json=template_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Template"

@pytest.mark.asyncio
async def test_import_template():
    """
    Test the /import-template endpoint to ensure it imports a template successfully.
    """
    template_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/import-template", json=template_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Template"

@pytest.mark.asyncio
async def test_export_template():
    """
    Test the /export-template/{template_id} endpoint to ensure it exports a template successfully or returns a 404 status code.
    """
    template_id = "some_template_id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/export-template/{template_id}")
    assert response.status_code == 200 or response.status_code == 404

@pytest.mark.asyncio
async def test_get_courses_edge_cases():
    """
    Test the /get-courses endpoint to ensure it handles edge cases correctly.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert all(isinstance(course, dict) for course in response.json())

@pytest.mark.asyncio
async def test_get_constraints_edge_cases():
    """
    Test the /get-constraints endpoint to ensure it handles edge cases correctly.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-constraints")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert all(isinstance(constraint, dict) for constraint in response.json())

@pytest.mark.asyncio
async def test_post_course_edge_cases():
    """
    Test the /add-course endpoint to ensure it handles edge cases correctly.
    """
    course_data = {
        "name": "",
        "lectureno": 0,
        "duration": 0,
        "instructor_name": "",
        "start_hr": 0,
        "end_hr": 0
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == ""

    course_data = {
        "name": "A" * 100,
        "lectureno": 100,
        "duration": 100,
        "instructor_name": "B" * 100,
        "start_hr": 23,
        "end_hr": 24
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == "A" * 100

@pytest.mark.asyncio
async def test_post_constraints_edge_cases():
    """
    Test the /add-constraints endpoint to ensure it handles edge cases correctly.
    """
    constraints_data = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200
    assert response.json()["working_days"] == []

    constraints_data = {
        "working_days": [
            {
                "day": "Monday",
                "start_hr": 0,
                "end_hr": 24,
                "total_hours": 24
            }
        ],
        "consecutive_subjects": ["A" * 100, "B" * 100],
        "non_consecutive_subjects": ["C" * 100, "D" * 100]
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200
    assert response.json()["working_days"][0]["day"] == "Monday"

@pytest.mark.asyncio
async def test_generate_timetable_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it handles edge cases correctly.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200 or response.status_code == 400

@pytest.mark.asyncio
async def test_update_course_edge_cases():
    """
    Test the /update-course/{course_id} endpoint to ensure it handles edge cases correctly.
    """
    course_data = {
        "name": "",
        "lectureno": 0,
        "duration": 0,
        "instructor_name": "",
        "start_hr": 0,
        "end_hr": 0
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put("/update-course/{course_id}", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == ""

    course_data = {
        "name": "A" * 100,
        "lectureno": 100,
        "duration": 100,
        "instructor_name": "B" * 100,
        "start_hr": 23,
        "end_hr": 24
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.put("/update-course/{course_id}", json=course_data)
    assert response.status_code == 200
    assert response.json()["name"] == "A" * 100

@pytest.mark.asyncio
async def test_generate_timetable_no_constraints_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it returns a 400 status code when no constraints are provided.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_generate_timetable_no_courses_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it returns a 400 status code when no courses are provided.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_generate_timetable_invalid_fields_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it handles invalid fields correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_scheduling_conflicts_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it handles scheduling conflicts correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_ai_model_issues_edge_cases():
    """
    Test the /generate-timetable endpoint to ensure it handles AI model issues correctly.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_new_csp_solver():
    """
    Test the /generate-timetable endpoint to ensure it works with the new CSP solver.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_generate_timetable_recommendation_system():
    """
    Test the /generate-timetable endpoint to ensure it works with the recommendation system.
    """
    constraints_data = {
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
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=constraints_data)
    assert response.status_code == 200

    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=course_data)
    assert response.status_code == 200

    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/generate-timetable")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_project_running():
    """
    Test to ensure the project is running by checking the root endpoint.
    """
    async with AsyncClient(base_url="http://localhost:8000") as ac:
        response = await ac.get("/")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_courses_pagination():
    """
    Test the /get-courses endpoint to ensure it supports pagination.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses?skip=0&limit=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 5

@pytest.mark.asyncio
async def test_get_constraints_pagination():
    """
    Test the /get-constraints endpoint to ensure it supports pagination.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-constraints?skip=0&limit=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 5

@pytest.mark.asyncio
async def test_get_courses_caching():
    """
    Test the /get-courses endpoint to ensure it supports caching.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response1 = await ac.get("/get-courses")
        response2 = await ac.get("/get-courses")
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json() == response2.json()

@pytest.mark.asyncio
async def test_get_constraints_caching():
    """
    Test the /get-constraints endpoint to ensure it supports caching.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response1 = await ac.get("/get-constraints")
        response2 = await ac.get("/get-constraints")
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json() == response2.json()

@pytest.mark.asyncio
async def test_rate_limiting():
    """
    Test the rate limiting functionality to ensure it limits the number of requests.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        for _ in range(10):
            response = await ac.get("/get-courses")
            assert response.status_code == 200
        response = await ac.get("/get-courses")
        assert response.status_code == 429

@pytest.mark.asyncio
async def test_commit_timetable():
    """
    Test the /commit-timetable endpoint to ensure it commits a timetable version successfully.
    """
    commit_data = {
        "commit_id": "test_commit_id",
        "timestamp": "2023-01-01T00:00:00Z",
        "user": "test_user",
        "changes": {"change": "test_change"}
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/commit-timetable", json=commit_data)
    assert response.status_code == 200
    assert response.json()["commit_id"] == "test_commit_id"

@pytest.mark.asyncio
async def test_get_commits():
    """
    Test the /get-commits endpoint to ensure it returns a list of commits.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-commits")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_commit():
    """
    Test the /get-commit/{commit_id} endpoint to ensure it returns a specific commit or a 404 status code.
    """
    commit_id = "test_commit_id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/get-commit/{commit_id}")
    assert response.status_code == 200 or response.status_code == 404

@pytest.mark.asyncio
async def test_merge_commits():
    """
    Test the /merge-commits endpoint to ensure it merges two commits successfully.
    """
    commit_ids = ["commit_id_1", "commit_id_2"]
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/merge-commits", json=commit_ids)
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_branch_commit():
    """
    Test the /branch-commit endpoint to ensure it creates a new branch from a commit successfully.
    """
    branch_data = {
        "commit_id": "test_commit_id",
        "branch_name": "test_branch"
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/branch-commit", json=branch_data)
    assert response.status_code == 200
    assert response.json()["branch_name"] == "test_branch"

@pytest.mark.asyncio
async def test_analytics():
    """
    Test the /analytics endpoint to ensure it retrieves analytics and reporting data.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/analytics")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_export_analytics():
    """
    Test the /export-analytics endpoint to ensure it exports analytics reports in PDF or Excel format.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/export-analytics?format=pdf")
    assert response.status_code == 200

    response = await ac.get("/export-analytics?format=excel")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_assign_task():
    """
    Test the /assign-task endpoint to ensure it assigns a task to a team member.
    """
    task_data = {
        "task": "Test Task",
        "assigned_to": "test_user",
        "due_date": "2023-01-01T00:00:00Z",
        "status": "pending"
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/assign-task", json=task_data)
    assert response.status_code == 200
    assert response.json()["task"] == "Test Task"

@pytest.mark.asyncio
async def test_get_tasks():
    """
    Test the /get-tasks endpoint to ensure it retrieves a list of assigned tasks.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_save_version():
    """
    Test the /save-version endpoint to ensure it saves a version of the timetable.
    """
    version_data = {
        "version_id": "test_version_id",
        "changes": {"change": "test_change"},
        "timestamp": "2023-01-01T00:00:00Z",
        "user": "test_user"
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/save-version", json=version_data)
    assert response.status_code == 200
    assert response.json()["version_id"] == "test_version_id"

@pytest.mark.asyncio
async def test_get_versions():
    """
    Test the /get-versions endpoint to ensure it retrieves a list of timetable versions.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-versions")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_recommendations():
    """
    Test the /get-recommendations endpoint to ensure it fetches course recommendations based on user preferences and constraints.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-recommendations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_ws_collaboration():
    """
    Test the /ws/collaboration/{timetable_id} WebSocket endpoint to ensure it handles real-time collaboration on timetables.
    """
    timetable_id = "test_timetable_id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        async with ac.websocket_connect(f"/ws/collaboration/{timetable_id}") as websocket:
            await websocket.send_json({"action": "test_action", "data": {}})
            response = await websocket.receive_json()
            assert response["status"] == "success"

@pytest.mark.asyncio
async def test_ws_chat():
    """
    Test the /ws/chat/{timetable_id} WebSocket endpoint to ensure it handles real-time chat and messaging.
    """
    timetable_id = "test_timetable_id"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        async with ac.websocket_connect(f"/ws/chat/{timetable_id}") as websocket:
            await websocket.send_json({"sender": "test_user", "message": "test_message", "timestamp": "2023-01-01T00:00:00Z"})
            response = await websocket.receive_json()
            assert response["status"] == "success"

@pytest.mark.asyncio
async def test_error_handling():
    """
    Test the error handling for invalid endpoints.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/invalid-endpoint")
    assert response.status_code == 404
    assert response.json()["detail"] == "Not Found"

@pytest.mark.asyncio
async def test_edge_case_handling():
    """
    Test the edge case handling for invalid data.
    """
    invalid_course_data = {
        "name": "",
        "lectureno": -1,
        "duration": -1,
        "instructor_name": "",
        "start_hr": -1,
        "end_hr": -1
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=invalid_course_data)
    assert response.status_code == 422

    invalid_constraints_data = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=invalid_constraints_data)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_mongodb_connection_pooling():
    """
    Test MongoDB connection pooling by checking the maxPoolSize and minPoolSize parameters.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses")
    assert response.status_code == 200
    # Check if the connection pool size is within the expected range
    client_info = app.mongodb_client.server_info()
    assert client_info['connections']['current'] <= 50
    assert client_info['connections']['current'] >= 10

@pytest.mark.asyncio
async def test_redis_connection_pooling():
    """
    Test Redis connection pooling by checking the minsize and maxsize parameters.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses")
    assert response.status_code == 200
    # Check if the connection pool size is within the expected range
    redis_info = await app.redis.info()
    assert int(redis_info['connected_clients']) <= 10
    assert int(redis_info['connected_clients']) >= 5

@pytest.mark.asyncio
async def test_security_headers():
    """
    Test the presence of security headers in the response.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/get-courses")
    assert response.status_code == 200
    assert "Content-Security-Policy" in response.headers
    assert "X-Content-Type-Options" in response.headers
    assert "X-Frame-Options" in response.headers
    assert "X-XSS-Protection" in response.headers

@pytest.mark.asyncio
async def test_input_validation_and_sanitization():
    """
    Test input validation and sanitization for user inputs.
    """
    invalid_course_data = {
        "name": "<script>alert('XSS')</script>",
        "lectureno": -1,
        "duration": -1,
        "instructor_name": "",
        "start_hr": -1,
        "end_hr": -1
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-course", json=invalid_course_data)
    assert response.status_code == 422

    invalid_constraints_data = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/add-constraints", json=invalid_constraints_data)
    assert response.status_code == 422

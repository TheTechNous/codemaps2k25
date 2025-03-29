# Testing

This document provides detailed information about the testing framework, how to run tests, and how to write new tests for the project.

## Table of Contents

1. [Testing Framework](#testing-framework)
2. [Running Tests](#running-tests)
3. [Writing New Tests](#writing-new-tests)
4. [Example Test](#example-test)
5. [New Tests and Changes](#new-tests-and-changes)

## Testing Framework

The project uses the following testing frameworks and libraries:

- **pytest**: A mature full-featured Python testing tool that helps you write better programs.
- **pytest-asyncio**: A pytest plugin for testing asyncio code.
- **pytest-cov**: A plugin for measuring code coverage with pytest.
- **fastapi**: The web framework used in the project, which includes built-in support for testing.

## Running Tests

To run the tests, follow these steps:

1. **Install dependencies**: Ensure that all the required dependencies are installed. You can do this by running the following command:

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the tests**: Execute the tests using the following command:

   ```bash
   pytest
   ```

3. **Run tests with coverage**: To run the tests and measure code coverage, use the following command:

   ```bash
   pytest --cov=Backend
   ```

4. **View coverage report**: After running the tests with coverage, you can view the coverage report by opening the `htmlcov/index.html` file in your web browser.

## Writing New Tests

When writing new tests for the project, follow these guidelines:

1. **Test structure**: Organize your tests in a way that makes them easy to understand and maintain. Group related tests together and use descriptive names for test functions.

2. **Use fixtures****: Utilize pytest fixtures to set up any necessary test data or state. This helps keep your tests clean and focused on the specific functionality being tested.

3. **Test async code**: If you need to test asynchronous code, use the `pytest-asyncio` plugin. Decorate your test functions with the `@pytest.mark.asyncio` decorator to indicate that they are asynchronous.

4. **Mock external dependencies**: When testing functions or methods that rely on external dependencies (e.g., database connections, API calls), use mocking to isolate the code being tested. This ensures that your tests are reliable and not affected by external factors.

5. **Test edge cases**: Ensure that your tests cover a wide range of scenarios, including edge cases and potential error conditions. This helps improve the overall robustness of the code.

6. **Add comments**: Include comments in your test code to explain the purpose of each test and any important details about the test setup. This makes it easier for others to understand and maintain the tests.

## Example Test

Here is an example of a simple test for a FastAPI endpoint:

```python
from fastapi.testclient import TestClient
from Backend.app import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}
```

This test uses the `TestClient` from FastAPI to make a request to the root endpoint (`/`) and checks that the response status code is 200 and the response JSON matches the expected output.

## New Tests and Changes

### New Tests

The following new tests have been added to the project:

1. **Backend Tests**:
   - `test_generate_timetable_no_constraints_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it returns a 400 status code when no constraints are provided.
   - `test_generate_timetable_no_courses_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it returns a 400 status code when no courses are provided.
   - `test_generate_timetable_invalid_fields_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles invalid fields correctly.
   - `test_generate_timetable_scheduling_conflicts_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles scheduling conflicts correctly.
   - `test_generate_timetable_ai_model_issues_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles AI model issues correctly.
   - `test_generate_timetable_new_csp_solver`: Tests the `/generate-timetable` endpoint to ensure it works with the new CSP solver.
   - `test_generate_timetable_recommendation_system`: Tests the `/generate-timetable` endpoint to ensure it works with the recommendation system.
   - `test_get_courses_edge_cases`: Tests the `/get-courses` endpoint to ensure it handles edge cases correctly.
   - `test_get_constraints_edge_cases`: Tests the `/get-constraints` endpoint to ensure it handles edge cases correctly.
   - `test_post_course_edge_cases`: Tests the `/add-course` endpoint to ensure it handles edge cases correctly.
   - `test_post_constraints_edge_cases`: Tests the `/add-constraints` endpoint to ensure it handles edge cases correctly.
   - `test_generate_timetable_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles edge cases correctly.
   - `test_update_course_edge_cases`: Tests the `/update-course/{course_id}` endpoint to ensure it handles edge cases correctly.
   - `test_generate_timetable_no_constraints_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it returns a 400 status code when no constraints are provided.
   - `test_generate_timetable_no_courses_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it returns a 400 status code when no courses are provided.
   - `test_generate_timetable_invalid_fields_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles invalid fields correctly.
   - `test_generate_timetable_scheduling_conflicts_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles scheduling conflicts correctly.
   - `test_generate_timetable_ai_model_issues_edge_cases`: Tests the `/generate-timetable` endpoint to ensure it handles AI model issues correctly.
   - `test_generate_timetable_new_csp_solver`: Tests the `/generate-timetable` endpoint to ensure it works with the new CSP solver.
   - `test_generate_timetable_recommendation_system`: Tests the `/generate-timetable` endpoint to ensure it works with the recommendation system.

2. **Frontend Tests**:
   - `test_add_constraints_edge_cases`: Tests the `AddConstraints` component to ensure it handles edge cases correctly.
   - `test_add_course_edge_cases`: Tests the `AddCourse` component to ensure it handles edge cases correctly.
   - `test_edit_constraints_edge_cases`: Tests the `EditConstraints` component to ensure it handles edge cases correctly.
   - `test_edit_course_edge_cases`: Tests the `EditCourse` component to ensure it handles edge cases correctly.
   - `test_edit_template_edge_cases`: Tests the `EditTemplate` component to ensure it handles edge cases correctly.
   - `test_recommendation_system_edge_cases`: Tests the `RecommendationSystem` component to ensure it handles edge cases correctly.
   - `test_timetable_edge_cases`: Tests the `Timetable` component to ensure it handles edge cases correctly.

### Changes to Existing Tests

The following changes have been made to existing tests:

1. **Backend Tests**:
   - Updated the `test_generate_timetable` test to include additional assertions for edge cases.
   - Updated the `test_add_constraints` test to include additional assertions for edge cases.
   - Updated the `test_add_course` test to include additional assertions for edge cases.
   - Updated the `test_edit_constraints` test to include additional assertions for edge cases.
   - Updated the `test_edit_course` test to include additional assertions for edge cases.
   - Updated the `test_edit_template` test to include additional assertions for edge cases.
   - Updated the `test_recommendation_system` test to include additional assertions for edge cases.
   - Updated the `test_timetable` test to include additional assertions for edge cases.

2. **Frontend Tests**:
   - Updated the `test_add_constraints` test to include additional assertions for edge cases.
   - Updated the `test_add_course` test to include additional assertions for edge cases.
   - Updated the `test_edit_constraints` test to include additional assertions for edge cases.
   - Updated the `test_edit_course` test to include additional assertions for edge cases.
   - Updated the `test_edit_template` test to include additional assertions for edge cases.
   - Updated the `test_recommendation_system` test to include additional assertions for edge cases.
   - Updated the `test_timetable` test to include additional assertions for edge cases.

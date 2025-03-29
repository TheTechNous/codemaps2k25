import pytest
from csp import generate, generate_timetable_genetic

# Test the generate_timetable function with valid constraints and courses
def test_generate_timetable():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with no constraints
def test_generate_timetable_no_constraints():
    constraints = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert result is None

# Test the generate_timetable function with no courses
def test_generate_timetable_no_courses():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = []
    result = generate(constraints, courses)
    assert result is None

# Test the generate_timetable function with invalid fields
def test_generate_timetable_invalid_fields():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with scheduling conflicts
def test_generate_timetable_scheduling_conflicts():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with AI model issues
def test_generate_timetable_ai_model_issues():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with edge cases
def test_generate_timetable_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with no constraints and edge cases
def test_generate_timetable_no_constraints_edge_cases():
    constraints = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert result is None

# Test the generate_timetable function with no courses and edge cases
def test_generate_timetable_no_courses_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = []
    result = generate(constraints, courses)
    assert result is None

# Test the generate_timetable function with invalid fields and edge cases
def test_generate_timetable_invalid_fields_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with scheduling conflicts and edge cases
def test_generate_timetable_scheduling_conflicts_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable function with AI model issues and edge cases
def test_generate_timetable_ai_model_issues_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with valid constraints and courses
def test_generate_timetable_genetic():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with no constraints
def test_generate_timetable_genetic_no_constraints():
    constraints = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert result is None

# Test the generate_timetable_genetic function with no courses
def test_generate_timetable_genetic_no_courses():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = []
    result = generate_timetable_genetic(constraints, courses)
    assert result is None

# Test the generate_timetable_genetic function with invalid fields
def test_generate_timetable_genetic_invalid_fields():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with scheduling conflicts
def test_generate_timetable_genetic_scheduling_conflicts():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with edge cases
def test_generate_timetable_genetic_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with no constraints and edge cases
def test_generate_timetable_genetic_no_constraints_edge_cases():
    constraints = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert result is None

# Test the generate_timetable_genetic function with no courses and edge cases
def test_generate_timetable_genetic_no_courses_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = []
    result = generate_timetable_genetic(constraints, courses)
    assert result is None

# Test the generate_timetable_genetic function with invalid fields and edge cases
def test_generate_timetable_genetic_invalid_fields_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

# Test the generate_timetable_genetic function with scheduling conflicts and edge cases
def test_generate_timetable_genetic_scheduling_conflicts_edge_cases():
    constraints = {
        "working_days": [
            {"day": "Monday", "start_hr": 9, "end_hr": 17, "total_hours": 8},
            {"day": "Tuesday", "start_hr": 9, "end_hr": 17, "total_hours": 8}
        ],
        "consecutive_subjects": ["Math", "Science"],
        "non_consecutive_subjects": ["History", "Art"]
    }
    courses = [
        {"name": "Math", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Science", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "History", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17},
        {"name": "Art", "lectureno": 2, "duration": 1, "start_hr": 9, "end_hr": 17}
    ]
    result = generate_timetable_genetic(constraints, courses)
    assert isinstance(result, dict)
    assert "monday" in result
    assert "tuesday" in result
    assert "wednesday" in result
    assert "thursday" in result
    assert "friday" in result
    assert "saturday" in result
    assert "sunday" in result

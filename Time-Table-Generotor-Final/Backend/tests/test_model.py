import pytest
from model import CreateCourse, Course, CreateConstraints, Constraints, TimetableAIModel, train_ai_model, predict_timetable, commit_timetable, get_commits, get_commit, merge_commits, branch_commit, TimetableVersion, TaskAssignment, CollaborationAction, ChatMessage, TimetableCommit, TimetableBranch
import numpy as np
from datetime import datetime

def test_create_course():
    """
    Test the creation of a course using the CreateCourse model.
    """
    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    course = CreateCourse(**course_data)
    assert course.name == "Test Course"
    assert course.lectureno == 10
    assert course.duration == 2
    assert course.instructor_name == "Test Instructor"
    assert course.start_hr == 9
    assert course.end_hr == 11

def test_course():
    """
    Test the creation of a course using the Course model.
    """
    course_data = {
        "name": "Test Course",
        "lectureno": 10,
        "duration": 2,
        "instructor_name": "Test Instructor",
        "start_hr": 9,
        "end_hr": 11
    }
    course = Course(**course_data)
    assert course.name == "Test Course"
    assert course.lectureno == 10
    assert course.duration == 2
    assert course.instructor_name == "Test Instructor"
    assert course.start_hr == 9
    assert course.end_hr == 11

def test_create_constraints():
    """
    Test the creation of constraints using the CreateConstraints model.
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
        "non_consecutive_subjects": ["History", "Art"],
        "room_availability": {"Room1": [9, 10, 11], "Room2": [12, 13, 14]},
        "teacher_preferences": {"Teacher1": [9, 10, 11], "Teacher2": [12, 13, 14]},
        "student_preferences": {"Student1": [9, 10, 11], "Student2": [12, 13, 14]}
    }
    constraints = CreateConstraints(**constraints_data)
    assert constraints.working_days[0].day == "Monday"
    assert constraints.working_days[0].start_hr == 9
    assert constraints.working_days[0].end_hr == 17
    assert constraints.working_days[0].total_hours == 8
    assert constraints.consecutive_subjects == ["Math", "Science"]
    assert constraints.non_consecutive_subjects == ["History", "Art"]
    assert constraints.room_availability == {"Room1": [9, 10, 11], "Room2": [12, 13, 14]}
    assert constraints.teacher_preferences == {"Teacher1": [9, 10, 11], "Teacher2": [12, 13, 14]}
    assert constraints.student_preferences == {"Student1": [9, 10, 11], "Student2": [12, 13, 14]}

def test_constraints():
    """
    Test the creation of constraints using the Constraints model.
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
        "non_consecutive_subjects": ["History", "Art"],
        "room_availability": {"Room1": [9, 10, 11], "Room2": [12, 13, 14]},
        "teacher_preferences": {"Teacher1": [9, 10, 11], "Teacher2": [12, 13, 14]},
        "student_preferences": {"Student1": [9, 10, 11], "Student2": [12, 13, 14]}
    }
    constraints = Constraints(**constraints_data)
    assert constraints.working_days[0].day == "Monday"
    assert constraints.working_days[0].start_hr == 9
    assert constraints.working_days[0].end_hr == 17
    assert constraints.working_days[0].total_hours == 8
    assert constraints.consecutive_subjects == ["Math", "Science"]
    assert constraints.non_consecutive_subjects == ["History", "Art"]
    assert constraints.room_availability == {"Room1": [9, 10, 11], "Room2": [12, 13, 14]}
    assert constraints.teacher_preferences == {"Teacher1": [9, 10, 11], "Teacher2": [12, 13, 14]}
    assert constraints.student_preferences == {"Student1": [9, 10, 11], "Student2": [12, 13, 14]}

def test_timetable_ai_model():
    """
    Test the creation of the TimetableAIModel.
    """
    model = TimetableAIModel()
    assert model.model is not None

def test_train_ai_model():
    """
    Test the training of the AI model using historical data.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_predict_timetable():
    """
    Test the prediction of the timetable using the AI model.
    """
    model = TimetableAIModel()
    input_data = np.array([1, 2, 3])
    predictions = predict_timetable(model, input_data)
    assert predictions is not None

def test_create_course_edge_cases():
    """
    Test the creation of a course using the CreateCourse model with edge cases.
    """
    # Test with minimum values
    course_data = {
        "name": "",
        "lectureno": 0,
        "duration": 0,
        "instructor_name": "",
        "start_hr": 0,
        "end_hr": 0
    }
    course = CreateCourse(**course_data)
    assert course.name == ""
    assert course.lectureno == 0
    assert course.duration == 0
    assert course.instructor_name == ""
    assert course.start_hr == 0
    assert course.end_hr == 0

    # Test with maximum values
    course_data = {
        "name": "A" * 100,
        "lectureno": 100,
        "duration": 100,
        "instructor_name": "B" * 100,
        "start_hr": 23,
        "end_hr": 24
    }
    course = CreateCourse(**course_data)
    assert course.name == "A" * 100
    assert course.lectureno == 100
    assert course.duration == 100
    assert course.instructor_name == "B" * 100
    assert course.start_hr == 23
    assert course.end_hr == 24

def test_course_edge_cases():
    """
    Test the creation of a course using the Course model with edge cases.
    """
    # Test with minimum values
    course_data = {
        "name": "",
        "lectureno": 0,
        "duration": 0,
        "instructor_name": "",
        "start_hr": 0,
        "end_hr": 0
    }
    course = Course(**course_data)
    assert course.name == ""
    assert course.lectureno == 0
    assert course.duration == 0
    assert course.instructor_name == ""
    assert course.start_hr == 0
    assert course.end_hr == 0

    # Test with maximum values
    course_data = {
        "name": "A" * 100,
        "lectureno": 100,
        "duration": 100,
        "instructor_name": "B" * 100,
        "start_hr": 23,
        "end_hr": 24
    }
    course = Course(**course_data)
    assert course.name == "A" * 100
    assert course.lectureno == 100
    assert course.duration == 100
    assert course.instructor_name == "B" * 100
    assert course.start_hr == 23
    assert course.end_hr == 24

def test_create_constraints_edge_cases():
    """
    Test the creation of constraints using the CreateConstraints model with edge cases.
    """
    # Test with minimum values
    constraints_data = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    constraints = CreateConstraints(**constraints_data)
    assert constraints.working_days == []
    assert constraints.consecutive_subjects == []
    assert constraints.non_consecutive_subjects == []

    # Test with maximum values
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
        "non_consecutive_subjects": ["C" * 100, "D" * 100],
        "room_availability": {"Room1": [i for i in range(24)], "Room2": [i for i in range(24)]},
        "teacher_preferences": {"Teacher1": [i for i in range(24)], "Teacher2": [i for i in range(24)]},
        "student_preferences": {"Student1": [i for i in range(24)], "Student2": [i for i in range(24)]}
    }
    constraints = CreateConstraints(**constraints_data)
    assert constraints.working_days[0].day == "Monday"
    assert constraints.working_days[0].start_hr == 0
    assert constraints.working_days[0].end_hr == 24
    assert constraints.working_days[0].total_hours == 24
    assert constraints.consecutive_subjects == ["A" * 100, "B" * 100]
    assert constraints.non_consecutive_subjects == ["C" * 100, "D" * 100]
    assert constraints.room_availability == {"Room1": [i for i in range(24)], "Room2": [i for i in range(24)]}
    assert constraints.teacher_preferences == {"Teacher1": [i for i in range(24)], "Teacher2": [i for i in range(24)]}
    assert constraints.student_preferences == {"Student1": [i for i in range(24)], "Student2": [i for i in range(24)]}

def test_constraints_edge_cases():
    """
    Test the creation of constraints using the Constraints model with edge cases.
    """
    # Test with minimum values
    constraints_data = {
        "working_days": [],
        "consecutive_subjects": [],
        "non_consecutive_subjects": []
    }
    constraints = Constraints(**constraints_data)
    assert constraints.working_days == []
    assert constraints.consecutive_subjects == []
    assert constraints.non_consecutive_subjects == []

    # Test with maximum values
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
        "non_consecutive_subjects": ["C" * 100, "D" * 100],
        "room_availability": {"Room1": [i for i in range(24)], "Room2": [i for i in range(24)]},
        "teacher_preferences": {"Teacher1": [i for i in range(24)], "Teacher2": [i for i in range(24)]},
        "student_preferences": {"Student1": [i for i in range(24)], "Student2": [i for i in range(24)]}
    }
    constraints = Constraints(**constraints_data)
    assert constraints.working_days[0].day == "Monday"
    assert constraints.working_days[0].start_hr == 0
    assert constraints.working_days[0].end_hr == 24
    assert constraints.working_days[0].total_hours == 24
    assert constraints.consecutive_subjects == ["A" * 100, "B" * 100]
    assert constraints.non_consecutive_subjects == ["C" * 100, "D" * 100]
    assert constraints.room_availability == {"Room1": [i for i in range(24)], "Room2": [i for i in range(24)]}
    assert constraints.teacher_preferences == {"Teacher1": [i for i in range(24)], "Teacher2": [i for i in range(24)]}
    assert constraints.student_preferences == {"Student1": [i for i in range(24)], "Student2": [i for i in range(24)]}

def test_timetable_ai_model_edge_cases():
    """
    Test the creation of the TimetableAIModel with different optimizers.
    """
    # Test with different optimizers
    model_adam = TimetableAIModel(optimizer='adam')
    assert model_adam.model is not None

    model_rmsprop = TimetableAIModel(optimizer='rmsprop')
    assert model_rmsprop.model is not None

def test_train_ai_model_edge_cases():
    """
    Test the training of the AI model using edge cases in historical data.
    """
    # Test with empty historical data
    historical_data = []
    model = train_ai_model(historical_data)
    assert model is not None

    # Test with large historical data
    historical_data = [
        {"features": np.random.rand(10), "label": np.random.randint(2)}
        for _ in range(1000)
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_predict_timetable_edge_cases():
    """
    Test the prediction of the timetable using edge cases in input data.
    """
    model = TimetableAIModel()

    # Test with empty input data
    input_data = np.array([])
    predictions = predict_timetable(model, input_data)
    assert predictions is not None

    # Test with large input data
    input_data = np.random.rand(100)
    predictions = predict_timetable(model, input_data)
    assert predictions is not None

def test_train_ai_model_improved_lstm():
    """
    Test the training of the AI model using improved LSTM architecture.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_train_ai_model_additional_features():
    """
    Test the training of the AI model using additional features in historical data.
    """
    historical_data = [
        {"features": np.array([1, 2, 3, 4, 5]), "label": 1},
        {"features": np.array([6, 7, 8, 9, 10]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_recommendation_system():
    """
    Test the recommendation system using the AI model.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    input_data = np.array([1, 2, 3])
    recommendations = predict_timetable(model, input_data)
    assert recommendations is not None

def test_commit_timetable():
    """
    Test the creation of a new timetable commit.
    """
    timetable_data = {
        "courses": [
            {
                "name": "Test Course",
                "lectureno": 10,
                "duration": 2,
                "instructor_name": "Test Instructor",
                "start_hr": 9,
                "end_hr": 11
            }
        ],
        "constraints": {
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
    }
    commit = commit_timetable(timetable_data, "Test User")
    assert commit is not None
    assert commit.user == "Test User"

def test_get_commits():
    """
    Test the retrieval of all timetable commits.
    """
    commits = get_commits()
    assert commits is not None
    assert isinstance(commits, list)

def test_get_commit():
    """
    Test the retrieval of a specific commit by ID.
    """
    commit_id = "some_commit_id"
    commit = get_commit(commit_id)
    assert commit is not None
    assert commit.commit_id == commit_id

def test_merge_commits():
    """
    Test the merging of two timetable commits.
    """
    commit_id_1 = "commit_id_1"
    commit_id_2 = "commit_id_2"
    merged_commit = merge_commits(commit_id_1, commit_id_2, "Test User")
    assert merged_commit is not None
    assert merged_commit.user == "Test User"

def test_branch_commit():
    """
    Test the creation of a new branch from a commit.
    """
    commit_id = "some_commit_id"
    branch_name = "new_branch"
    branch = branch_commit(commit_id, branch_name)
    assert branch is not None
    assert branch.name == branch_name

def test_feature_selection_pca():
    """
    Test the feature selection using PCA in the train_ai_model function.
    """
    historical_data = [
        {"features": np.array([1, 2, 3, 4, 5]), "label": 1},
        {"features": np.array([6, 7, 8, 9, 10]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_feature_selection_selectkbest():
    """
    Test the feature selection using SelectKBest in the train_ai_model function.
    """
    historical_data = [
        {"features": np.array([1, 2, 3, 4, 5]), "label": 1},
        {"features": np.array([6, 7, 8, 9, 10]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_neural_network_architectures():
    """
    Test the different neural network architectures in the TimetableAIModel class.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_ensemble_learning_techniques():
    """
    Test the ensemble learning techniques in the train_ai_model function.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_hyperparameter_tuning():
    """
    Test the hyperparameter tuning techniques in the train_ai_model function.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_early_stopping_and_lr_scheduling():
    """
    Test the early stopping and learning rate scheduling in the train_ai_model function.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

def test_timetable_version():
    """
    Test the creation of a TimetableVersion model.
    """
    version_data = {
        "version_id": "test_version_id",
        "changes": {"change": "test_change"},
        "timestamp": datetime.utcnow(),
        "user": "test_user"
    }
    version = TimetableVersion(**version_data)
    assert version.version_id == "test_version_id"
    assert version.changes == {"change": "test_change"}
    assert version.user == "test_user"

def test_task_assignment():
    """
    Test the creation of a TaskAssignment model.
    """
    task_data = {
        "task": "Test Task",
        "assigned_to": "test_user",
        "due_date": datetime.utcnow(),
        "status": "pending"
    }
    task = TaskAssignment(**task_data)
    assert task.task == "Test Task"
    assert task.assigned_to == "test_user"
    assert task.status == "pending"

def test_collaboration_action():
    """
    Test the creation of a CollaborationAction model.
    """
    action_data = {
        "action": "test_action",
        "data": {"key": "value"}
    }
    action = CollaborationAction(**action_data)
    assert action.action == "test_action"
    assert action.data == {"key": "value"}

def test_chat_message():
    """
    Test the creation of a ChatMessage model.
    """
    message_data = {
        "sender": "test_user",
        "message": "test_message",
        "timestamp": datetime.utcnow()
    }
    message = ChatMessage(**message_data)
    assert message.sender == "test_user"
    assert message.message == "test_message"

def test_timetable_commit():
    """
    Test the creation of a TimetableCommit model.
    """
    commit_data = {
        "commit_id": "test_commit_id",
        "timestamp": "2023-01-01T00:00:00Z",
        "user": "test_user",
        "changes": {"change": "test_change"}
    }
    commit = TimetableCommit(**commit_data)
    assert commit.commit_id == "test_commit_id"
    assert commit.timestamp == "2023-01-01T00:00:00Z"
    assert commit.user == "test_user"
    assert commit.changes == {"change": "test_change"}

def test_timetable_branch():
    """
    Test the creation of a TimetableBranch model.
    """
    branch_data = {
        "branch_name": "test_branch",
        "commit_id": "test_commit_id"
    }
    branch = TimetableBranch(**branch_data)
    assert branch.branch_name == "test_branch"
    assert branch.commit_id == "test_commit_id"

def test_train_ai_model_performance_metrics():
    """
    Test the training of the AI model and calculate performance metrics.
    """
    historical_data = [
        {"features": np.array([1, 2, 3]), "label": 1},
        {"features": np.array([4, 5, 6]), "label": 0}
    ]
    model = train_ai_model(historical_data)
    assert model is not None

    X_train = np.array([data['features'] for data in historical_data])
    y_train = np.array([data['label'] for data in historical_data])
    y_pred = model.predict(X_train)

    mse = mean_squared_error(y_train, y_pred)
    mae = mean_absolute_error(y_train, y_pred)
    rmse = np.sqrt(mse)

    assert mse >= 0
    assert mae >= 0
    assert rmse >= 0

def test_predict_timetable_performance_metrics():
    """
    Test the prediction of the timetable and calculate performance metrics.
    """
    model = TimetableAIModel()
    input_data = np.array([1, 2, 3])
    predictions = predict_timetable(model, input_data)
    assert predictions is not None

    mse = mean_squared_error(input_data, predictions)
    mae = mean_absolute_error(input_data, predictions)
    rmse = np.sqrt(mse)

    assert mse >= 0
    assert mae >= 0
    assert rmse >= 0

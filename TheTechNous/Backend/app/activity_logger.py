from datetime import datetime
from app.viwes import db
from app.models import UserActivityLog
from app import preprocess  # Import the preprocess module
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_user_activity(user_id, activity):
    """
    Log user activity.

    :param user_id: The ID of the user.
    :param activity: The activity description.
    """
    log = UserActivityLog(user_id=user_id, activity=activity, timestamp=datetime.utcnow())
    db.session.add(log)
    db.session.commit()
    logger.info(f"User {user_id} activity: {activity}")

    # Call preprocessing functions after logging activities
    preprocessed_data = preprocess.preprocess_activity_data()
    logger.info(f"Preprocessed activity data: {preprocessed_data}")


"""
Activity Logger

This module provides functionality to log user activities in the application.

Usage:
1. Import the `log_user_activity` function.
2. Call the function with the user ID and activity description.

Example:
```python
from app.activity_logger import log_user_activity

log_user_activity(user_id=1, activity="User logged in")
```
"""

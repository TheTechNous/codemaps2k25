# Setting up Celery Worker and Beat Scheduler

## Setting up Celery Worker

1. Install Celery and Redis (or RabbitMQ) by adding them to your `requirements.txt` file:
    ```
    celery==5.2.3
    redis==4.1.0
    kombu==5.2.3
    ```

2. Configure Celery in your Django settings file (`Backend/api/api/settings.py`):
    ```python
    # Celery settings
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    ```

3. Create a new file `Backend/api/celery.py` and add the following code:
    ```python
    import os
    from celery import Celery

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

    app = Celery('api')

    app.config_from_object('django.conf:settings', namespace='CELERY')

    app.autodiscover_tasks()
    ```

4. Define a sample task in `Backend/api/tasks.py`:
    ```python
    from .celery import app

    @app.task
    def sample_task():
        print("Sample task executed")
    ```

5. Start the Celery worker by running the following command:
    ```
    celery -A api worker --loglevel=info
    ```

## Setting up Celery Beat Scheduler

1. Install the `celery[redis]` package if you haven't already:
    ```
    pip install celery[redis]
    ```

2. Add the following configuration to your Django settings file (`Backend/api/api/settings.py`):
    ```python
    # Celery Beat settings
    CELERY_BEAT_SCHEDULE = {
        'sample-task': {
            'task': 'api.tasks.sample_task',
            'schedule': 10.0,  # Run every 10 seconds
        },
    }
    ```

3. Start the Celery beat scheduler by running the following command:
    ```
    celery -A api beat --loglevel=info
    ```

4. You can also run both the worker and beat scheduler together using the following command:
    ```
    celery -A api worker --beat --loglevel=info
    ```

## Using the `make_celery` function

In the `Backend/api/celery.py` file, you can use the `make_celery` function to create a Celery instance. This function allows you to pass the Flask app instance to Celery, enabling better integration between Flask and Celery.

Here is an example of how to use the `make_celery` function:

```python
import os
from celery import Celery
from Backend.app.viwes import app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

def make_celery(app):
    celery = Celery('api', app=app)
    celery.config_from_object('django.conf:settings', namespace='CELERY')
    celery.autodiscover_tasks()
    return celery

celery_app = make_celery(app)
```

By following these steps, you have successfully set up Celery for asynchronous tasks and scheduled tasks in your Django project.

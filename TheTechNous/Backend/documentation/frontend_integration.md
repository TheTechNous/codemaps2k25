# Frontend Integration with Backend

This documentation provides detailed steps to integrate the back-end with the front-end of the LMS website.

## Setting Up Frontend to Communicate with Backend APIs

1. **Install Axios**: Axios is a popular HTTP client for making API requests. Install it using npm or yarn.
   ```bash
   npm install axios
   ```

2. **Create an Axios Instance**: Create a new file `api.js` in your frontend project and configure an Axios instance with the base URL of your backend API.
   ```javascript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:8000/api', // Update with your backend URL
   });

   export default api;
   ```

3. **Set Up API Endpoints**: Define functions to interact with the backend APIs for user authentication, blog post management, and admin functionalities.

   ```javascript
   // api.js

   // User Authentication
   export const registerUser = (userData) => api.post('/auth/register', userData);
   export const loginUser = (userData) => api.post('/auth/login', userData);
   export const getUserProfile = (token) => api.get('/auth/profile', {
     headers: { Authorization: `Bearer ${token}` },
   });

   // Blog Post Management
   export const getBlogPosts = () => api.get('/blog/post');
   export const createBlogPost = (postData, token) => api.post('/blog/post', postData, {
     headers: { Authorization: `Bearer ${token}` },
   });
   export const updateBlogPost = (postId, postData, token) => api.put(`/blog/post/${postId}`, postData, {
     headers: { Authorization: `Bearer ${token}` },
   });
   export const deleteBlogPost = (postId, token) => api.delete(`/blog/post/${postId}`, {
     headers: { Authorization: `Bearer ${token}` },
   });

   // Admin Functionalities
   export const getUsers = (token) => api.get('/admin/users', {
     headers: { Authorization: `Bearer ${token}` },
   });
   export const updateUser = (userId, userData, token) => api.put(`/admin/users/${userId}`, userData, {
     headers: { Authorization: `Bearer ${token}` },
   });
   export const deleteUser = (userId, token) => api.delete(`/admin/users/${userId}`, {
     headers: { Authorization: `Bearer ${token}` },
   });
   ```

## Examples of API Requests and Responses

### User Registration
**Request:**
```javascript
const userData = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'password123',
};

registerUser(userData)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

### User Login
**Request:**
```javascript
const userData = {
  username: 'john_doe',
  password: 'password123',
};

loginUser(userData)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "access_token": "your_jwt_token"
}
```

### Get User Profile
**Request:**
```javascript
const token = 'your_jwt_token';

getUserProfile(token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false
}
```

### Create Blog Post
**Request:**
```javascript
const postData = {
  title: 'New Blog Post',
  content: 'This is the content of the new blog post.',
};

const token = 'your_jwt_token';

createBlogPost(postData, token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "msg": "Post Created Successfully",
  "id": 1
}
```

### Update Blog Post
**Request:**
```javascript
const postId = 1;
const postData = {
  title: 'Updated Blog Post',
  content: 'This is the updated content of the blog post.',
};

const token = 'your_jwt_token';

updateBlogPost(postId, postData, token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "msg": "Post Updated Successfully"
}
```

### Delete Blog Post
**Request:**
```javascript
const postId = 1;
const token = 'your_jwt_token';

deleteBlogPost(postId, token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "msg": "Post Deleted Successfully"
}
```

### Get Users (Admin)
**Request:**
```javascript
const token = 'your_jwt_token';

getUsers(token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_admin": false
  },
  {
    "id": 2,
    "username": "jane_doe",
    "email": "jane@example.com",
    "is_admin": true
  }
]
```

### Update User (Admin)
**Request:**
```javascript
const userId = 1;
const userData = {
  is_admin: true,
};

const token = 'your_jwt_token';

updateUser(userId, userData, token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "msg": "User updated successfully"
}
```

### Delete User (Admin)
**Request:**
```javascript
const userId = 1;
const token = 'your_jwt_token';

deleteUser(userId, token)
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

**Response:**
```json
{
  "msg": "User deleted successfully"
}
```

## Handling Authentication Tokens in Frontend

1. **Store Token Securely**: Store the JWT token securely in local storage or cookies.
   ```javascript
   localStorage.setItem('token', response.data.access_token);
   ```

2. **Retrieve Token**: Retrieve the token when making authenticated requests.
   ```javascript
   const token = localStorage.getItem('token');
   ```

3. **Include Token in Requests**: Include the token in the Authorization header when making authenticated requests.
   ```javascript
   const token = localStorage.getItem('token');

   api.get('/auth/profile', {
     headers: { Authorization: `Bearer ${token}` },
   })
   .then(response => console.log(response.data))
   .catch(error => console.error(error.response.data));
   ```

## Integrating Celery for Asynchronous Tasks

1. **Install Celery and Redis**: Install Celery and Redis (or RabbitMQ) by adding them to your `requirements.txt` file:
   ```bash
   celery==5.2.3
   redis==4.1.0
   kombu==5.2.3
   ```

2. **Configure Celery in Django Settings**: Add the following configuration to your Django settings file (`Backend/api/api/settings.py`):
   ```python
   # Celery settings
   CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
   CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
   CELERY_ACCEPT_CONTENT = ['json']
   CELERY_TASK_SERIALIZER = 'json'
   CELERY_RESULT_SERIALIZER = 'json'
   ```

3. **Create Celery Instance**: Create a new file `Backend/api/celery.py` and add the following code:
   ```python
   import os
   from celery import Celery

   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

   app = Celery('api')

   app.config_from_object('django.conf:settings', namespace='CELERY')

   app.autodiscover_tasks()
   ```

4. **Define Celery Tasks**: Define a sample task in `Backend/api/tasks.py`:
   ```python
   from .celery import app

   @app.task
   def sample_task():
       print("Sample task executed")
   ```

5. **Start Celery Worker**: Start the Celery worker by running the following command:
   ```bash
   celery -A api worker --loglevel=info
   ```

6. **Set Up Celery Beat Scheduler**: Add the following configuration to your Django settings file (`Backend/api/api/settings.py`):
   ```python
   # Celery Beat settings
   CELERY_BEAT_SCHEDULE = {
       'sample-task': {
           'task': 'api.tasks.sample_task',
           'schedule': 10.0,  # Run every 10 seconds
       },
   }
   ```

7. **Start Celery Beat Scheduler**: Start the Celery beat scheduler by running the following command:
   ```bash
   celery -A api beat --loglevel=info
   ```

8. **Run Both Worker and Beat Scheduler Together**: You can also run both the worker and beat scheduler together using the following command:
   ```bash
   celery -A api worker --beat --loglevel=info
   ```

By following these steps, you can successfully integrate Celery for asynchronous tasks in your Django project.

## Standardized API Responses

To ensure that all API responses follow a consistent structure, the backend has been configured to return responses in a standardized format. This makes it easier for frontend developers to handle responses from different endpoints.

### Example of Standardized API Response

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "New Blog Post",
    "content": "This is the content of the new blog post.",
    "author": "john_doe",
    "url": "/blog/post/1"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "An error occurred while processing your request."
}
```

### Metadata in API Responses

To help frontend developers manage data more effectively, metadata such as pagination information is included in the API responses.

**Example of API Response with Metadata:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "New Blog Post",
      "content": "This is the content of the new blog post.",
      "author": "john_doe",
      "url": "/blog/post/1"
    },
    {
      "id": 2,
      "title": "Another Blog Post",
      "content": "This is the content of another blog post.",
      "author": "jane_doe",
      "url": "/blog/post/2"
    }
  ],
  "metadata": {
    "page": 1,
    "per_page": 10,
    "total_pages": 5,
    "total_items": 50
  }
}
```

## CORS Settings

To enable Cross-Origin Resource Sharing (CORS) in the backend, the following settings have been added to the Django settings file (`Backend/api/api/settings.py`):

```python
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

This configuration allows frontend applications hosted on `http://localhost:3000` and `http://127.0.0.1:3000` to access the API.

## Custom Pagination

The backend uses a custom pagination class to standardize the pagination of API responses. This ensures that all paginated responses follow a consistent structure, making it easier for frontend developers to handle paginated data.

### CustomPagination Class

The `CustomPagination` class is defined in `Backend/api/api/views.py` and extends the `PageNumberPagination` class from Django REST framework. It overrides the `get_paginated_response` method to return a standardized response format.

```python
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'status': 'success',
            'data': data,
            'metadata': {
                'page': self.page.number,
                'page_size': self.page_size,
                'total_pages': self.page.paginator.num_pages,
                'total_items': self.page.paginator.count
            }
        })
```

### Using CustomPagination in API Views

To use the `CustomPagination` class in your API views, set it as the `pagination_class` in your viewsets or API views.

```python
from rest_framework import viewsets
from .models import YourModel
from .serializers import YourModelSerializer
from .pagination import CustomPagination

class YourModelViewSet(viewsets.ModelViewSet):
    queryset = YourModel.objects.all()
    serializer_class = YourModelSerializer
    pagination_class = CustomPagination
```

By using the `CustomPagination` class, you ensure that all paginated API responses follow a consistent structure, making it easier for frontend developers to handle paginated data.

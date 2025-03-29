# API Documentation

This document provides detailed information about the API endpoints, request/response formats, and examples for TheTechNous project.

## Authentication

### Register a New User

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "mfa_secret": "your_mfa_secret"
}
```

### Log In

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "otp": "123456"  # If MFA is enabled
}
```

**Response:**
```json
{
  "access_token": "your_jwt_token"
}
```

### Get User Profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false
}
```

## Blog Post Management

### Get Blog Posts

**Endpoint:** `GET /blog/post`

**Response:**
```json
[
  {
    "id": 1,
    "title": "New Blog Post",
    "content": "This is the content of the new blog post.",
    "author": "john_doe",
    "url": "/blog/post/1"
  }
]
```

### Create Blog Post

**Endpoint:** `POST /blog/post`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "title": "New Blog Post",
  "content": "This is the content of the new blog post."
}
```

**Response:**
```json
{
  "msg": "Post Created Successfully",
  "id": 1
}
```

### Update Blog Post

**Endpoint:** `PUT /blog/post/{post_id}`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "title": "Updated Blog Post",
  "content": "This is the updated content of the blog post."
}
```

**Response:**
```json
{
  "msg": "Post Updated Successfully"
}
```

### Delete Blog Post

**Endpoint:** `DELETE /blog/post/{post_id}`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "msg": "Post Deleted Successfully"
}
```

### Search Blog Posts

**Endpoint:** `GET /blog/search?q={query}`

**Response:**
```json
[
  {
    "id": 1,
    "title": "New Blog Post",
    "content": "This is the content of the new blog post.",
    "author": "john_doe",
    "url": "/blog/post/1"
  }
]
```

## Admin Functionalities

### Get Users

**Endpoint:** `GET /admin/users`

**Headers:**
```http
Authorization: Bearer your_jwt_token
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

### Update User

**Endpoint:** `PUT /admin/users/{user_id}`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "is_admin": true
}
```

**Response:**
```json
{
  "msg": "User updated successfully"
}
```

### Delete User

**Endpoint:** `DELETE /admin/users/{user_id}`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "msg": "User deleted successfully"
}
```

## User Roles and Permissions Management

### Get User Roles

**Endpoint:** `GET /roles/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "roles": ["admin", "editor"]
  },
  {
    "id": 2,
    "username": "jane_doe",
    "roles": ["editor"]
  }
]
```

### Add User Role

**Endpoint:** `POST /roles/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "user_id": 1,
  "role_name": "editor"
}
```

**Response:**
```json
{
  "message": "Role added successfully"
}
```

## Notification System

### Get Notifications

**Endpoint:** `GET /notifications/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
[
  {
    "id": 1,
    "message": "New comment on your post",
    "timestamp": "2023-08-01T12:34:56Z"
  },
  {
    "id": 2,
    "message": "Your post has been approved",
    "timestamp": "2023-08-02T09:21:45Z"
  }
]
```

### Send Notification

**Endpoint:** `POST /notifications/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "message": "New comment on your post"
}
```

**Response:**
```json
{
  "message": "Notification sent successfully"
}
```

## Social Media Sharing

### Share Post on Social Media

**Endpoint:** `POST /social/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "post_id": 1
}
```

**Response:**
```json
{
  "message": "Post shared successfully",
  "post_url": "http://example.com/post/1"
}
```

## File Uploads and Media Management

### Upload File

**Endpoint:** `POST /media/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
- Multipart form data with the file to be uploaded

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file_url": "http://example.com/media/file.jpg"
}
```

## Advanced Search Functionality

### Search Users

**Endpoint:** `GET /search/`

**Request:**
```http
GET /search/?q=john
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "username": "john_smith",
    "email": "john.smith@example.com"
  }
]
```

## Error Handling

### HTTP Exceptions

**Description:**
Handles various HTTP exceptions and returns appropriate error messages and status codes.

**Example:**
```json
{
  "error": "Resource not found"
}
```

### Database Errors

**Description:**
Handles database errors and returns appropriate error messages and status codes.

**Example:**
```json
{
  "error": "A database error occurred"
}
```

### Validation Errors

**Description:**
Handles validation errors and returns appropriate error messages and status codes.

**Example:**
```json
{
  "error": "A validation error occurred"
}
```

### Authentication Errors

**Description:**
Handles authentication errors and returns appropriate error messages and status codes.

**Example:**
```json
{
  "error": "An authentication error occurred"
}
```

## Activity Logging

### Log User Activity

**Description:**
Logs user activities in the application.

**Usage:**
1. Import the `log_user_activity` function.
2. Call the function with the user ID and activity description.

**Example:**
```python
from app.activity_logger import log_user_activity

log_user_activity(user_id=1, activity="User logged in")
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

## Examples of Using the API with Different JavaScript Libraries

### Using Axios

**Example:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const getBlogPosts = async () => {
  try {
    const response = await api.get('/blog/post');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

getBlogPosts();
```

### Using Fetch

**Example:**

```javascript
const getBlogPosts = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/blog/post');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

getBlogPosts();
```

### Using jQuery

**Example:**

```javascript
$.ajax({
  url: 'http://localhost:8000/api/blog/post',
  method: 'GET',
  success: function(data) {
    console.log(data);
  },
  error: function(error) {
    console.error(error);
  }
});
```

## User Role Management

### Get User Roles

**Endpoint:** `GET /roles/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "roles": ["admin", "editor"]
  },
  {
    "id": 2,
    "username": "jane_doe",
    "roles": ["editor"]
  }
]
```

### Add User Role

**Endpoint:** `POST /roles/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "user_id": 1,
  "role_name": "editor"
}
```

**Response:**
```json
{
  "message": "Role added successfully"
}
```

## Notification Management

### Get Notifications

**Endpoint:** `GET /notifications/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Response:**
```json
[
  {
    "id": 1,
    "message": "New comment on your post",
    "timestamp": "2023-08-01T12:34:56Z"
  },
  {
    "id": 2,
    "message": "Your post has been approved",
    "timestamp": "2023-08-02T09:21:45Z"
  }
]
```

### Send Notification

**Endpoint:** `POST /notifications/`

**Headers:**
```http
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "message": "New comment on your post"
}
```

**Response:**
```json
{
  "message": "Notification sent successfully"
}
```

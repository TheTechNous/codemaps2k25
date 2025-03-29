# TheTechNous
Web site for The TechNous club

## Project Overview

This is a Backend for the main website of our TechNous club .

## Setup Instructions

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TheTechNous.git
   cd TheTechNous
   ```

2. Set up a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```bash
   pip install -r Backend/requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the `Backend` directory and add the following environment variables:
   ```env
   DJANGO_SECRET_KEY=your_secret_key
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Apply database migrations:
   ```bash
   python Backend/api/manage.py migrate
   ```

6. Start the development server:
   ```bash
   python Backend/api/manage.py runserver
   ```

## Usage Examples

### Register a New User
To register a new user, send a POST request to the `/auth/register` endpoint with the following JSON payload:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Log In
To log in, send a POST request to the `/auth/login` endpoint with the following JSON payload:
```json
{
  "username": "john_doe",
  "password": "password123",
  "otp": "123456"  # If MFA is enabled
}
```

### Create a Blog Post
To create a new blog post, send a POST request to the `/blog/post` endpoint with the following JSON payload:
```json
{
  "title": "New Blog Post",
  "content": "This is the content of the new blog post."
}
```
Include the JWT token in the Authorization header:
```http
Authorization: Bearer your_jwt_token
```

## Contribution Guidelines

We welcome contributions to TheTechNous! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them with a descriptive commit message.
4. Push your changes to your forked repository:
   ```bash
   git push origin my-feature-branch
   ```
5. Create a pull request to the main repository.

## API Documentation

For detailed API documentation, including endpoints, request/response formats, and examples, please refer to the [API Documentation](Backend/documentation/api_documentation.md).

## Deployment Instructions

For detailed deployment instructions, including environment setup, configuration, and deployment steps, please refer to the [Deployment Instructions](Backend/documentation/deployment_instructions.md).

## Troubleshooting Guide

For a troubleshooting guide to help resolve common issues, please refer to the [Troubleshooting Guide](Backend/documentation/troubleshooting_guide.md).

## Additional Documentation

For detailed steps on how to integrate the back-end with the front-end of the LMS website, please refer to the [Frontend Integration Documentation](Backend/documentation/frontend_integration.md).

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

## Security Enhancements

### Rate Limiting
To prevent abuse and DDoS attacks, rate limiting has been implemented for all API endpoints using the `flask_limiter` package. This helps to ensure that the API remains responsive and available to legitimate users.

### Input Validation and Sanitization
Comprehensive input validation and sanitization have been added to all schemas using the `marshmallow` library. This helps to prevent SQL injection and other attacks by ensuring that all input data is properly validated and sanitized before being processed.

### Password Security
Password security has been enhanced by using the Argon2 hashing algorithm in the `User` model. Argon2 is a more secure hashing algorithm that provides better protection against brute-force attacks.

### Two-Factor Authentication (2FA)
Two-factor authentication (2FA) has been implemented for user accounts using the `pyotp` library. This adds an extra layer of security by requiring users to provide a one-time password (OTP) in addition to their regular password when logging in.

## Performance Optimizations

### Caching
Caching has been implemented for frequently accessed data using the `flask_caching` package. This helps to reduce database load and improve response times by storing frequently accessed data in memory.

### Database Query Optimization
Database queries have been optimized by using indexing and query optimization techniques. This helps to improve the performance of database operations and reduce the time it takes to retrieve data.

### Asynchronous Processing
Asynchronous processing has been implemented for time-consuming tasks, such as sending emails or processing large datasets, using Celery. This helps to improve the responsiveness of the API by offloading time-consuming tasks to background workers.

### Connection Pooling
Connection pooling has been implemented for the database to improve performance and resource utilization. This helps to reduce the overhead of establishing new database connections and ensures that database connections are reused efficiently.

## Developer Experience Enhancements

### CI/CD Pipeline
A comprehensive CI/CD pipeline has been set up to automate testing, linting, and deployment. This helps to ensure that code changes are thoroughly tested and validated before being deployed to production.

### API Documentation
Detailed API documentation has been provided using tools like Swagger or ReDoc. This helps developers understand the available API endpoints, request/response formats, and usage examples.

### Standardized Response Format
A standardized response format has been implemented for all API endpoints. This ensures consistency and improves error handling by providing a uniform structure for all API responses.

### Contribution Guidelines
Detailed contribution guidelines have been provided to help developers contribute to the project. This includes instructions for forking the repository, creating branches, making changes, and submitting pull requests.

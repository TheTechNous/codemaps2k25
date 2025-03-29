from django.utils.deprecation import MiddlewareMixin
from corsheaders.middleware import CorsMiddleware


class CustomCorsMiddleware(MiddlewareMixin, CorsMiddleware):
    def process_response(self, request, response):
        response = super().process_response(request, response)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response


class CustomCookieMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response.set_cookie(
            'custom_cookie',
            'cookie_value',
            max_age=3600,
            secure=True,
            httponly=True,
            samesite='Strict'
        )
        return response


class CustomSecurityMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["X-Content-Type-Options"] = "nosniff"
        response["X-XSS-Protection"] = "1; mode=block"
        response["Referrer-Policy"] = "same-origin"
        return response

from django.utils.deprecation import MiddlewareMixin

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Only process API requests
        if request.path.startswith('/api/'):
            # Get the token from cookies
            access_token = request.COOKIES.get('access_token')
            
            # If token exists in cookies, add it to the Authorization header
            if access_token:
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}' 
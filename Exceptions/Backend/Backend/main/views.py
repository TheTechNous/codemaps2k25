from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.urls import reverse, get_resolver
from django.urls.resolvers import URLPattern, URLResolver

def get_all_urls(urlpatterns, prefix=''):
    """
    Recursively get all URLs from URL patterns
    """
    urls = {}
    for pattern in urlpatterns:
        if isinstance(pattern, URLPattern):
            if pattern.name:
                urls[pattern.name] = {
                    'url': prefix + str(pattern.pattern),
                    'methods': getattr(pattern.callback, 'actions', {}).keys() if hasattr(pattern.callback, 'actions') else ['GET']
                }
        elif isinstance(pattern, URLResolver):
            urls.update(get_all_urls(pattern.url_patterns, prefix + str(pattern.pattern)))
    return urls

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API root view that lists all available endpoints
    """
    # Get all URL patterns
    resolver = get_resolver()
    all_urls = get_all_urls(resolver.url_patterns)
    
    # Filter and organize API URLs
    api_urls = {}
    for name, info in all_urls.items():
        if name and name.startswith('api-') or name in ['token_obtain_pair', 'token_refresh', 'register']:
            api_urls[name] = {
                'url': request.build_absolute_uri(reverse(name)),
                'methods': info['methods']
            }
    
    # Organize URLs by category
    organized_urls = {
        'authentication': {
            'login': api_urls.get('token_obtain_pair', {}),
            'refresh': api_urls.get('token_refresh', {}),
            'register': api_urls.get('register', {}),
        },
        'items': {
            'list_all': api_urls.get('item-list', {}),
            'list_unclaimed': api_urls.get('non-approved-item-list', {}),
            'create_lost': api_urls.get('lost-item-create', {}),
            'create_found': api_urls.get('found-item-create', {}),
            'item_detail': api_urls.get('item-detail', {}),
        },
        'users': {
            'profile': api_urls.get('user-profile', {}),
            'update_profile': api_urls.get('user-profile-update', {}),
        }
    }

    # Create direct links for each endpoint
    direct_links = {
        'authentication': {
            'login': f"{request.build_absolute_uri('/api/v1/token/')}",
            'refresh': f"{request.build_absolute_uri('/api/v1/token/refresh/')}",
            'register': f"{request.build_absolute_uri('/api/v1/register/')}",
        },
        'items': {
            'list_all': f"{request.build_absolute_uri('/api/v1/items/')}",
            'list_unclaimed': f"{request.build_absolute_uri('/api/v1/items/unclaimed/')}",
            'create_lost': f"{request.build_absolute_uri('/api/v1/items/lost/')}",
            'create_found': f"{request.build_absolute_uri('/api/v1/items/found/')}",
            'item_detail': f"{request.build_absolute_uri('/api/v1/items/1/')}",
        },
        'users': {
            'profile': f"{request.build_absolute_uri('/api/v1/profile/')}",
            'update_profile': f"{request.build_absolute_uri('/api/v1/profile/update/')}",
        }
    }
    
    return Response({
        'message': 'Welcome to the Lost and Found API',
        'version': '1.0',
        'endpoints': organized_urls,
        'direct_links': direct_links,
        'documentation': {
            'authentication': 'All endpoints except login, refresh, and register require authentication. Use the access token in the Authorization header as "Bearer <token>"',
            'methods': {
                'GET': 'Retrieve data',
                'POST': 'Create new data',
                'PUT': 'Update all fields',
                'PATCH': 'Update specific fields',
                'DELETE': 'Remove data'
            },
            'example_requests': {
                'login': {
                    'url': '/api/v1/token/',
                    'method': 'POST',
                    'body': {
                        'username': 'your_username',
                        'password': 'your_password'
                    }
                },
                'create_lost_item': {
                    'url': '/api/v1/items/lost/',
                    'method': 'POST',
                    'headers': {
                        'Authorization': 'Bearer your_access_token',
                        'Content-Type': 'application/json'
                    },
                    'body': {
                        'title': 'Lost Item Title',
                        'description': 'Item description',
                        'location': 'Where it was lost',
                        'category': 'item_category'
                    }
                }
            }
        }
    }) 
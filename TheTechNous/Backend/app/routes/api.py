"""
This module defines the API routes for the application.

It includes the following routes:
- Authentication routes
- Admin routes
- Blog routes
- User roles and permissions management routes
- Notification system routes
- Social media sharing routes
- File uploads and media management routes
- Advanced search functionality routes
"""


from flask import Blueprint
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app.routes.auth import auth
from app.routes.admin import admin
from app.routes.blog import blog
from app.routes.roles import roles
from app.routes.notifications import notifications
from app.routes.social import social
from app.routes.media import media
from app.routes.search import search


api = Blueprint('api', __name__)


limiter = Limiter(
    get_remote_address,
    app=api,
    default_limits=["200 per day", "50 per hour"]
)


api.register_blueprint(auth, url_prefix='/auth')
api.register_blueprint(admin, url_prefix='/admin')
api.register_blueprint(blog, url_prefix='/blog')

# User roles and permissions management
api.register_blueprint(roles, url_prefix='/roles')

# Notification system
api.register_blueprint(notifications, url_prefix='/notifications')

# Social media sharing
api.register_blueprint(social, url_prefix='/social')

# File uploads and media management
api.register_blueprint(media, url_prefix='/media')

# Advanced search functionality
api.register_blueprint(search, url_prefix='/search')

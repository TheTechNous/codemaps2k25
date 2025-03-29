import os
import re
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash
from argon2 import PasswordHasher
from cryptography.fernet import Fernet
from datetime import datetime, timedelta


db = SQLAlchemy()


ph = PasswordHasher()

# Generate a key for encryption
key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
cipher_suite = Fernet(key)


class User(db.Model):
    """
    User model representing a user in the system.

    Attributes:
        id (int): The unique identifier for the user.
        username (str): The username of the user.
        email (str): The email address of the user.
        password_hash (str): The hashed password of the user.
        is_admin (bool): Indicates if the user is an admin.
        roles (list): The roles assigned to the user.
        mfa_secret (str): The secret key for multi-factor authentication.
        salt (str): The salt used for password hashing.
        password_history (list): The history of passwords used by the user.
        last_login (datetime): The timestamp of the user's last login.
        is_active (bool): Indicates if the user is active.
        password_reset_token (str): The token for password reset.
        password_reset_token_expiry (datetime): The expiry timestamp for the password reset token.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy='dynamic'))
    mfa_secret = db.Column(db.String(32), nullable=True)
    salt = db.Column(db.String(32), nullable=False, default=os.urandom(16).hex())
    password_history = db.relationship('PasswordHistory', backref='user', lazy=True)
    last_login = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    password_reset_token = db.Column(db.String(128), nullable=True)
    password_reset_token_expiry = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        if not self.validate_password(password):
            raise ValueError("Password does not meet the required criteria")
        if self.is_common_password(password):
            raise ValueError("Password is too common")
        if self.is_password_reused(password):
            raise ValueError("Password has been used before")
        self.password_hash = ph.hash(password + self.salt)
        self.add_password_to_history(password)

    def check_password(self, password):
        try:
            return ph.verify(self.password_hash, password + self.salt)
        except:
            return False

    def validate_password(self, password):
        if len(password) < 8:
            return False
        if not re.search(r"[A-Z]", password):
            return False
        if not re.search(r"[a-z]", password):
            return False
        if not re.search(r"[0-9]", password):
            return False
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False
        return True

    def is_common_password(self, password):
        common_passwords = [
            "123456", "password", "123456789", "12345678", "12345", "1234567", "1234567890", "qwerty", "abc123",
            "password1"
        ]
        return password in common_passwords

    def is_password_reused(self, password):
        for history in self.password_history:
            if ph.verify(history.password_hash, password + self.salt):
                return True
        return False

    def add_password_to_history(self, password):
        password_history = PasswordHistory(user_id=self.id, password_hash=ph.hash(password + self.salt))
        db.session.add(password_history)
        db.session.commit()

    def encrypt_data(self, data):
        return cipher_suite.encrypt(data.encode()).decode()

    def decrypt_data(self, encrypted_data):
        return cipher_suite.decrypt(encrypted_data.encode()).decode()

    def set_email(self, email):
        self.email = self.encrypt_data(email)

    def get_email(self):
        return self.decrypt_data(self.email)


class Role(db.Model):
    """
    Role model representing a role in the system.

    Attributes:
        id (int): The unique identifier for the role.
        name (str): The name of the role.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)


class UserRoles(db.Model):
    """
    UserRoles model representing the association between users and roles.

    Attributes:
        id (int): The unique identifier for the user-role association.
        user_id (int): The unique identifier for the user.
        role_id (int): The unique identifier for the role.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'))


class BlogPost(db.Model):
    """
    BlogPost model representing a blog post in the system.

    Attributes:
        id (int): The unique identifier for the blog post.
        title (str): The title of the blog post.
        content (str): The content of the blog post.
        author_id (int): The unique identifier for the author of the blog post.
        created_at (datetime): The timestamp when the blog post was created.
        updated_at (datetime): The timestamp when the blog post was last updated.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    author = db.relationship('User', backref=db.backref('blog_posts', lazy=True))

    def get_absolute_url(self):
        return f"/blog/post/{self.id}"


class UserActivityLog(db.Model):
    """
    UserActivityLog model representing a log of user activities.

    Attributes:
        id (int): The unique identifier for the activity log.
        user_id (int): The unique identifier for the user.
        activity (str): The description of the activity.
        timestamp (datetime): The timestamp when the activity occurred.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    activity = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('activity_logs', lazy=True))


class Notification(db.Model):
    """
    Notification model representing a notification for a user.

    Attributes:
        id (int): The unique identifier for the notification.
        user_id (int): The unique identifier for the user.
        message (str): The message of the notification.
        timestamp (datetime): The timestamp when the notification was created.
        is_read (bool): Indicates if the notification has been read.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    message = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    is_read = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))


class SocialMediaShare(db.Model):
    """
    SocialMediaShare model representing a social media share of a blog post.

    Attributes:
        id (int): The unique identifier for the social media share.
        post_id (int): The unique identifier for the blog post.
        platform (str): The social media platform where the post was shared.
        shared_at (datetime): The timestamp when the post was shared.
    """
    id = db.Column(db.Integer, primary key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False, index=True)
    platform = db.Column(db.String(64), nullable=False)
    shared_at = db.Column(db.DateTime, server_default=db.func.now())

    post = db.relationship('BlogPost', backref=db.backref('social_shares', lazy=True))


class MediaFile(db.Model):
    """
    MediaFile model representing a media file uploaded by a user.

    Attributes:
        id (int): The unique identifier for the media file.
        file_name (str): The name of the media file.
        file_url (str): The URL of the media file.
        uploaded_at (datetime): The timestamp when the media file was uploaded.
    """
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())


class SearchQuery(db.Model):
    """
    SearchQuery model representing a search query made by a user.

    Attributes:
        id (int): The unique identifier for the search query.
        query (str): The search query string.
        user_id (int): The unique identifier for the user who made the query.
        timestamp (datetime): The timestamp when the search query was made.
    """
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, index=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

    user = db.relationship('User', backref=db.backref('search_queries', lazy=True))


class PasswordHistory(db.Model):
    """
    PasswordHistory model representing the history of passwords used by a user.

    Attributes:
        id (int): The unique identifier for the password history entry.
        user_id (int): The unique identifier for the user.
        password_hash (str): The hashed password.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

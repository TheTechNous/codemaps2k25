import jwt
import datetime
from flask import render_template
from flask_mail import Message
from app import app, mail
from app.models import User

def generate_password_reset_token(user_id):
    """
    Generate a password reset token for the given user ID.

    :param user_id: The ID of the user.
    :return: The generated token.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def verify_password_reset_token(token):
    """
    Verify the password reset token and return the user ID if valid.

    :param token: The password reset token.
    :return: The user ID if the token is valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def send_password_reset_email(email, token):
    """
    Send a password reset email to the given email address.

    :param email: The email address to send the password reset email to.
    :param token: The password reset token.
    """
    user = User.query.filter_by(email=email).first()
    if user:
        reset_link = f"{app.config['FRONTEND_URL']}/reset_password?token={token}"
        html = render_template('email/password_reset.html', user=user, reset_link=reset_link)
        msg = Message(subject="Password Reset Instructions",
                      sender=app.config['MAIL_DEFAULT_SENDER'],
                      recipients=[email],
                      html=html)
        mail.send(msg)

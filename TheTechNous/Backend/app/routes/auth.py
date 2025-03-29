from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import pyotp
from datetime import datetime, timedelta

from app.models import db, User
from app.activity_logger import log_user_activity
from app.utils import generate_password_reset_token, verify_password_reset_token, send_password_reset_email


auth = Blueprint('auth', __name__)


# Account lockout settings
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_TIME = timedelta(minutes=15)


@auth.route('/')
def auth_home():
    """
    Auth Home endpoint.

    :return: JSON response with a message.
    """
    return jsonify({'msg': 'Auth Home'}), 200


@auth.route('/register', methods=['POST'])
def register():
    """
    Register a new user.

    :return: JSON response with a message and MFA secret.
    """
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    new_user.mfa_secret = pyotp.random_base32()
    db.session.add(new_user)
    db.session.commit()

    log_user_activity(new_user.id, 'User registered')

    return jsonify({'message': 'User created successfully', 'mfa_secret': new_user.mfa_secret}), 201


@auth.route('/login', methods=['POST'])
def login():
    """
    User login endpoint.

    :return: JSON response with an access token or error message.
    """
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if user:
        if user.failed_attempts >= MAX_FAILED_ATTEMPTS and datetime.utcnow() < user.lockout_until:
            return jsonify({'message': 'Account locked. Try again later.'}), 403

        if user.check_password(data.get('password')):
            otp = data.get('otp')
            totp = pyotp.TOTP(user.mfa_secret)
            if totp.verify(otp):
                access_token = create_access_token(identity=user.id)
                log_user_activity(user.id, 'User logged in')
                user.failed_attempts = 0
                user.last_login = datetime.utcnow()
                db.session.commit()
                return jsonify({'access_token': access_token}), 200
            else:
                user.failed_attempts += 1
                db.session.commit()
                return jsonify({'message': 'Invalid OTP'}), 401
        else:
            user.failed_attempts += 1
            db.session.commit()
            return jsonify({'message': 'Invalid login credentials'}), 401

    return jsonify({'message': 'Invalid login credentials'}), 401


@auth.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """
    Get user profile information.

    :return: JSON response with user profile information.
    """
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    log_user_activity(current_user, 'Viewed profile')
    return jsonify({'username': user.username, 'email': user.email, 'is_admin': user.is_admin}), 200


@auth.route('/enable_2fa', methods=['POST'])
@jwt_required()
def enable_2fa():
    """
    Enable 2FA for the user.

    :return: JSON response with a message and MFA secret.
    """
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user.mfa_secret:
        user.mfa_secret = pyotp.random_base32()
        db.session.commit()
        log_user_activity(current_user, 'Enabled 2FA')
        return jsonify({'message': '2FA enabled successfully', 'mfa_secret': user.mfa_secret}), 200
    return jsonify({'message': '2FA is already enabled'}), 400


@auth.route('/disable_2fa', methods=['POST'])
@jwt_required()
def disable_2fa():
    """
    Disable 2FA for the user.

    :return: JSON response with a message.
    """
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if user.mfa_secret:
        user.mfa_secret = None
        db.session.commit()
        log_user_activity(current_user, 'Disabled 2FA')
        return jsonify({'message': '2FA disabled successfully'}), 200
    return jsonify({'message': '2FA is not enabled'}), 400


@auth.route('/request_password_reset', methods=['POST'])
def request_password_reset():
    """
    Request a password reset.

    :return: JSON response with a message.
    """
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if user:
        token = generate_password_reset_token(user.id)
        send_password_reset_email(user.email, token)
        log_user_activity(user.id, 'Requested password reset')
        return jsonify({'message': 'Password reset email sent'}), 200

    return jsonify({'message': 'Email not found'}), 404


@auth.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Reset the user's password using a token.

    :return: JSON response with a message.
    """
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    user_id = verify_password_reset_token(token)
    if user_id:
        user = User.query.get(user_id)
        user.set_password(new_password)
        user.password_reset_token = None
        user.password_reset_token_expiry = None
        db.session.commit()
        log_user_activity(user.id, 'Password reset successfully')
        return jsonify({'message': 'Password reset successfully'}), 200

    return jsonify({'message': 'Invalid or expired token'}), 400

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User
from app.activity_logger import log_user_activity


admin = Blueprint('admin', __name__)


@admin.route('/')
def admin_home():
    """
    Admin Home endpoint.

    :return: JSON response with a message.
    """
    return jsonify({'msg': 'Admin Home'}), 200


def is_admin(user_id):
    """
    Check if the user is an admin.

    :param user_id: The ID of the user.
    :return: True if the user is an admin, False otherwise.
    """
    user = User.query.get(user_id)
    return user.is_admin if user else False


@admin.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """
    Retrieve a list of users.

    **Headers:**
    Authorization: Bearer your_jwt_token

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
    """
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'msg': 'Admin Access required'}), 403

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    users = User.query.paginate(page=page, per_page=per_page)
    log_user_activity(current_user_id, 'Retrieved user list')
    return jsonify([{"id": user.id, "username": user.username,
                     "email": user.email, "is_admin": user.is_admin} for user in users.items]), 200


@admin.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Update an existing user.

    **Headers:**
    Authorization: Bearer your_jwt_token

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
    """
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'msg': 'Admin Access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    data = request.get_json()
    user.is_admin = data.get('is_admin', user.is_admin)
    db.session.commit()
    log_user_activity(current_user_id, f'Updated user {user_id}')

    return jsonify({"msg": "User updated successfully"}), 200


@admin.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """
    Delete an existing user.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Response:**
    ```json
    {
      "msg": "User deleted successfully"
    }
    ```
    """
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'msg': 'Admin Access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    log_user_activity(current_user_id, f'Deleted user {user_id}')

    return jsonify({"msg": "User deleted successfully"}), 200


@admin.route('/users/<int:user_id>/activate', methods=['PUT'])
@jwt_required()
def activate_user(user_id):
    """
    Activate a user account.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Response:**
    ```json
    {
      "msg": "User activated successfully"
    }
    ```
    """
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'msg': 'Admin Access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    user.is_active = True
    db.session.commit()
    log_user_activity(current_user_id, f'Activated user {user_id}')

    return jsonify({"msg": "User activated successfully"}), 200


@admin.route('/users/<int:user_id>/deactivate', methods=['PUT'])
@jwt_required()
def deactivate_user(user_id):
    """
    Deactivate a user account.

    **Headers:**
    Authorization: Bearer your_jwt_token

    **Response:**
    ```json
    {
      "msg": "User deactivated successfully"
    }
    ```
    """
    current_user_id = get_jwt_identity()
    if not is_admin(current_user_id):
        return jsonify({'msg': 'Admin Access required'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    user.is_active = False
    db.session.commit()
    log_user_activity(current_user_id, f'Deactivated user {user_id}')

    return jsonify({"msg": "User deactivated successfully"}), 200

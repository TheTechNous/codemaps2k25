from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Notification


notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/notifications/mark_as_read', methods=['POST'])
@jwt_required()
def mark_as_read():
    """
    Mark notifications as read for the authenticated user.

    :return: JSON response with a message.
    """
    user_id = get_jwt_identity()
    notification_ids = request.json.get('notification_ids', [])
    
    if not notification_ids:
        return jsonify({"msg": "No notification IDs provided"}), 400

    notifications = Notification.query.filter(Notification.id.in_(notification_ids), Notification.user_id == user_id).all()
    
    for notification in notifications:
        notification.is_read = True

    db.session.commit()
    
    return jsonify({"msg": "Notifications marked as read"}), 200


@notifications_bp.route('/notifications/delete', methods=['DELETE'])
@jwt_required()
def delete_notifications():
    """
    Delete notifications for the authenticated user.

    :return: JSON response with a message.
    """
    user_id = get_jwt_identity()
    notification_ids = request.json.get('notification_ids', [])
    
    if not notification_ids:
        return jsonify({"msg": "No notification IDs provided"}), 400

    notifications = Notification.query.filter(Notification.id.in_(notification_ids), Notification.user_id == user_id).all()
    
    for notification in notifications:
        db.session.delete(notification)

    db.session.commit()
    
    return jsonify({"msg": "Notifications deleted"}), 200

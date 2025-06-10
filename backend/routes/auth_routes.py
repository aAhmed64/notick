from flask import Blueprint, request, jsonify, session
from models import db, User
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already taken"}), 409

    session["user_id"] = new_user.id  # Login after registering
    return jsonify({"message": "User registered", "user": {"id": new_user.id, "username": new_user.username}}), 201


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session["user_id"] = user.id
        return jsonify({"message": "Login successful", "user": {"id": user.id, "username": user.username}})
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/api/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out"}), 200


@auth_bp.route("/api/me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"user": None}), 200

    user = User.query.get(user_id)
    if not user:
        return jsonify({"user": None}), 404

    return jsonify({"user": {"id": user.id, "username": user.username}})

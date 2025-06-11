from flask import Blueprint, request, jsonify
from models import db, User
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

auth_bp = Blueprint("auth", __name__)

# Register Route
@auth_bp.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({
            "message": "User registered",
            "access_token": access_token,
            "user": {"id": new_user.id, "username": new_user.username}
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Username or email already taken"}), 409

    except Exception as e:
        print("Unexpected error during registration:", str(e))
        return jsonify({"error": "Server error", "details": str(e)}), 500


# Login Route
@auth_bp.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "user": {"id": user.id, "username": user.username}
            }), 200

        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        print("Unexpected error during login:", str(e))
        return jsonify({"error": "Server error", "details": str(e)}), 500

# Get Current User (Protected)
@auth_bp.route("/api/me", methods=["GET"])
@jwt_required()
def get_current_user():
    print("Received request to /api/me")
    print("Request headers:", dict(request.headers))
    
    try:
        user_id = get_jwt_identity()
        print("JWT identity:", user_id)
        
        # Convert string ID to integer for database query
        user = User.query.get(int(user_id))
        if not user:
            print("User not found for ID:", user_id)
            return jsonify({"user": None}), 404

        print("Found user:", user.username)
        return jsonify({"user": {"id": user.id, "username": user.username}}), 200
    except Exception as e:
        print("Error in get_current_user:", str(e))
        return jsonify({"error": "Server error", "details": str(e)}), 500

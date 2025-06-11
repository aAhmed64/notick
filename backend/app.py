from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from routes.main_routes import main_bp
from routes.auth_routes import auth_bp
from models import db
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

load_dotenv()

app = Flask(__name__)

# Configure app BEFORE extensions
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY", "super-secret")

# Optional (for sessions if used elsewhere)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True

# CORS config (for JWT, no need for supports_credentials)
CORS(app,
     origins=[
         "http://localhost:5173",
         "https://notick-silk.vercel.app",
         "https://notick.onrender.com",
         "https://notick-frontend.onrender.com"
     ],
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     max_age=600)


# Init extensions
db.init_app(app)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(main_bp)
app.register_blueprint(auth_bp)

# Create DB tables if they don't exist
with app.app_context():
    db.create_all()

# Run server
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

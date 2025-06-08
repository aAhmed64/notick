from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from routes.main_routes import main_bp
from models import db  # Make sure `db = SQLAlchemy()` is in models.py
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)

# Database configuration: use PostgreSQL from Neon via .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure CORS
CORS(app, 
     origins=[
         "http://localhost:5173",
         "https://notick-silk.vercel.app",
         "https://*.vercel.app",
         "https://*.ngrok-free.app"
     ],
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     max_age=600)

# Initialize extensions
db.init_app(app)

# Register Blueprints
app.register_blueprint(main_bp)

# Create tables (run once or conditionally)
with app.app_context():
    db.create_all()

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

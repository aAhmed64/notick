from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes.main_routes import main_bp
from models import db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///journals.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(main_bp)

# Create tables if they don't exist
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)


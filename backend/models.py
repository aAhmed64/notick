from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class Journal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(10), default="note")  # "note" or "ai"
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content': self.get_content(),  # Handles JSON parsing for AI
            'type': self.type,
            'user_id': self.user_id
        }

    def get_content(self):
        if self.type == 'ai_chat':
            try:
                return json.loads(self.content or "[]")
            except json.JSONDecodeError:
                return []
        return self.content


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)

    journals = db.relationship('Journal', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

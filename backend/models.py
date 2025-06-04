from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Journal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<Journal {self.id}: {self.title}>"


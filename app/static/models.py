# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Station(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    # ... other fields ...

# After the app is initialized, you will create a session object.

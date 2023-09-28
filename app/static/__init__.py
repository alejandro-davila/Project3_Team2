# __init__.py
from flask import Flask
from .models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///yourdatabase.db'  # adjust the URI accordingly
db.init_app(app)

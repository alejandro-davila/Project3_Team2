## Flask API Endpoints

##  Create an API endpoint for each unique piece of information you want to provide to the frontend.

from flask import Flask, jsonify
from .models import DBSession  # import your database session or connection

app = Flask(__name__)

@app.route('/api/stations', methods=['GET'])
def get_stations():
    # Fetch and process the data from the database or external API
    # Return the processed data as JSON
    session = DBSession()
    stations = session.query(Station).all()  # assuming Station is your model
    return jsonify([station.serialize for station in stations])

from flask import Flask, jsonify, request
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import requests

# Creating Flask app
app = Flask(__name__)

DATABASE_URI = 'sqlite:///fuel_stations.db'
API_KEY = 'RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q'  # Replace with your actual API Key
BASE_URL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json"

# Define the database engine
engine = create_engine(DATABASE_URI, echo=True)

# Set up the session
Session = sessionmaker(bind=engine)

# Define the declarative base
Base = declarative_base()

# Define the FuelStation model
class FuelStation(Base):
    __tablename__ = 'fuel_stations'  # Specifying the name of the table
    
    id = Column(Integer, primary_key=True)
    station_name = Column(String)
    address = Column(String)
    fuel_type_code = Column(String)
    ev_network = Column(String)
    ev_level1_evse_num = Column(Integer)
    ev_level2_evse_num = Column(Integer)
    ev_dc_fast_num = Column(Integer)
    ev_connector_types = Column(String)
    ev_pricing = Column(String)
    ev_renewable_source = Column(String)
    restricted_access = Column(Boolean)
    state = Column(String)
    city = Column(String)
    zip = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    
# After defining the model, create all the tables in the database
Base.metadata.create_all(engine)

# Index
@app.route('/')
def index():
    return "Welcome to the Fuel Station API! Add /api/fuel_stations to the url"

# Defining route to get fuel stations
@app.route('/api/fuel_stations', methods=['GET'])
def get_fuel_stations():
    # Create a session
    session = Session()

    # Query the database for electric fuel stations in Texas
    stations = session.query(FuelStation).filter_by(fuel_type_code='ELEC', state='TX').all()

    # Close the session to release resources
    session.close()

    result = []
    # Iterating over retrieved stations to prepare the response
    for station in stations:
        station_data = {
            'id': station.id,
            'station_name': station.station_name,
            'address': station.address,
            'fuel_type_code': station.fuel_type_code,
            'ev_network': station.ev_network,
            'ev_level1_evse_num': station.ev_level1_evse_num,
            'ev_level2_evse_num': station.ev_level2_evse_num,
            'ev_dc_fast_num': station.ev_dc_fast_num,
            'ev_connector_types': station.ev_connector_types,
            'ev_pricing': station.ev_pricing,
            'ev_renewable_source': station.ev_renewable_source,
            'restricted_access': station.restricted_access,
            'state': station.state,
            'city': station.city,
            'zip': station.zip,
            'latitude': station.latitude,
            'longitude': station.longitude
        }
        result.append(station_data)

    # Returning the JSONified result
    return jsonify(result)

# Running the app in debug mode
if __name__ == '__main__':
    app.run(debug=True, port=5001)
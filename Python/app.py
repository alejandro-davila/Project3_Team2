from flask import Flask, jsonify, g
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import requests

app = Flask(__name__)

# Database setup
DATABASE_URI = 'sqlite:///fuel_stations.db'
Base = declarative_base()
engine = create_engine(DATABASE_URI, echo=True)
Session = scoped_session(sessionmaker(bind=engine))


class FuelStation(Base):
    __tablename__ = 'fuel_stations'
    id = Column(Integer, primary_key=True)
    station_name = Column(String)
    address = Column(String)
    fuel_type_code = Column(String)
    state = Column(String)

Base.metadata.create_all(engine)

API_KEY = 'YOUR_API_KEY'  # Replace with your actual API Key
BASE_URL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json"

@app.route('/populate_db', methods=['GET'])
def populate_db():
    params = {
        'api_key': API_KEY,
        'fuel_type': 'ELEC',
        'state': 'TX',
        'limit': 200,
    }
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()

    with Session() as session:
        for station in data['fuel_stations']:
            fuel_station = FuelStation(
                id=station['id'],
                station_name=station['station_name'],
                address=station['street_address'],
                fuel_type_code=station['fuel_type_code'],
                state=station['state']
            )
            session.add(fuel_station)
        session.commit()
    return "Database populated successfully!"

@app.route('/api/fuel_stations', methods=['GET'])
def get_fuel_stations():
    with Session() as session:
        stations = session.query(FuelStation).filter_by(fuel_type_code='ELEC', state='TX').all()
        result = [
            {
                'id': station.id,
                'station_name': station.station_name,
                'address': station.address,
                'fuel_type_code': station.fuel_type_code,
                'state': station.state
            } for station in stations
        ]
    return jsonify(result)

@app.teardown_appcontext
def cleanup(resp_or_exc):
    Session.remove()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
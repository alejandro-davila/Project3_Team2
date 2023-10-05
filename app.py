import requests
import json
import pandas as pd
from flask import Flask, jsonify
from sqlalchemy import create_engine, Column, Integer, Text, Float, Boolean, Date
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

# Fetching data from the API
API_KEY = 'RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q'
BASE_URL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json"
params = {"api_key": API_KEY, "state": 'TX', "fuel_type": 'ELEC'}
data = requests.get(BASE_URL, params=params).json()['fuel_stations']

# Transform into DataFrame and drop unnecessary columns
cols_to_drop = [ 'access_detail_code',
    'cards_accepted',
    'date_last_confirmed',
    'expected_date',
    'groups_with_access_code',
    'owner_type_code', 
    'status_code',
    'maximum_vehicle_class',
    'updated_at',
    'intersection_directions', 
    'plus4',
    'bd_blends', 
    'cng_dispenser_num', 
    'cng_fill_type_code', 
    'cng_psi', 'cng_renewable_source', 
    'cng_total_compression', 
    'cng_total_storage', 
    'cng_vehicle_class', 
    'cng_has_rng', 
    'e85_blender_pump', 
    'e85_other_ethanol_blends',
    'hy_is_retail', 
    'hy_pressures', 
    'hy_standards', 
    'hy_status_link', 
    'lng_renewable_source', 
    'lng_vehicle_class', 
    'lng_has_rng', 
    'lpg_primary', 
    'lpg_nozzle_types', 
    'ng_fill_type_code', 
    'ng_psi', 
    'ng_vehicle_class', 
    'rd_blends', 
    'rd_blends_fr',
    'rd_blended_with_biodiesel',
    'rd_max_biodiesel_level',
    'nps_unit_name',
    'access_days_time_fr',
    'intersection_directions_fr',
    'bd_blends_fr',
    'groups_with_access_code_fr',
    'ev_pricing_fr',
    'federal_agency',
    'ev_network_ids']
df = pd.DataFrame(data).drop(columns=cols_to_drop, errors='ignore')

# Convert specific columns to JSON strings
df['ev_connector_types'] = df['ev_connector_types'].apply(json.dumps)

# Setup SQLite and save DataFrame
DATABASE_URI = 'sqlite:///fuel_stations.db'
engine = create_engine(DATABASE_URI)
df.to_sql('fuel_stations', con=engine, if_exists='replace', index=False)

# Flask Setup
app = Flask(__name__)
db_session = scoped_session(sessionmaker(bind=engine))

# Reflect db tables using automap_base
# Manual table mapping
Base = declarative_base()

class FuelStation(Base):
    __tablename__ = 'fuel_stations'

    access_code = Column(Text)
    access_days_time = Column(Text)
    fuel_type_code = Column(Text)
    id = Column(Integer, primary_key=True)
    open_date = Column(Date)
    restricted_access = Column(Boolean)
    station_name = Column(Text)
    station_phone = Column(Text)
    facility_type = Column(Text)
    geocode_status = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    city = Column(Text)
    state = Column(Text)
    street_address = Column(Text)
    zip = Column(Text)
    country = Column(Text)
    ev_connector_types = Column(Text)
    ev_dc_fast_num = Column(Float)
    ev_level1_evse_num = Column(Float)
    ev_level2_evse_num = Column(Float)
    ev_network = Column(Text)
    ev_network_web = Column(Text)
    ev_other_evse = Column(Text)
    ev_pricing = Column(Text)
    ev_renewable_source = Column(Text)
    ev_workplace_charging = Column(Integer)

@app.route('/stations', methods=['GET'])
def get_stations():
    stations = db_session.query(FuelStation).all()
    stations_list = [
        {
            "access_code": station.access_code,
            "access_days_time": station.access_days_time,
            "fuel_type_code": station.fuel_type_code,
            "id": station.id,
            "open_date": station.open_date,
            "restricted_access": station.restricted_access,
            "station_name": station.station_name,
            "station_phone": station.station_phone,
            "facility_type": station.facility_type,
            "geocode_status": station.geocode_status,
            "latitude": station.latitude,
            "longitude": station.longitude,
            "city": station.city,
            "state": station.state,
            "street_address": station.street_address,
            "zip": station.zip,
            "country": station.country,
            "ev_connector_types": json.loads(station.ev_connector_types),
            "ev_dc_fast_num": station.ev_dc_fast_num,
            "ev_level1_evse_num": station.ev_level1_evse_num,
            "ev_level2_evse_num": station.ev_level2_evse_num,
            "ev_network": station.ev_network,
            "ev_network_web": station.ev_network_web,
            "ev_other_evse": station.ev_other_evse,
            "ev_pricing": station.ev_pricing,
            "ev_renewable_source": station.ev_renewable_source,
            "ev_workplace_charging": station.ev_workplace_charging
        }
        for station in stations
    ]
    return jsonify(stations_list)

@app.route('/station/<int:station_id>', methods=['GET'])
def get_station(station_id):
    station = db_session.query(FuelStation).filter_by(id=station_id).first()
    if station:
        station_data = {
            "access_code": station.access_code,
            "access_days_time": station.access_days_time,
            "fuel_type_code": station.fuel_type_code,
            "id": station.id,
            "open_date": station.open_date,
            "restricted_access": station.restricted_access,
            "station_name": station.station_name,
            "station_phone": station.station_phone,
            "facility_type": station.facility_type,
            "geocode_status": station.geocode_status,
            "latitude": station.latitude,
            "longitude": station.longitude,
            "city": station.city,
            "state": station.state,
            "street_address": station.street_address,
            "zip": station.zip,
            "country": station.country,
            "ev_connector_types": json.loads(station.ev_connector_types),
            "ev_dc_fast_num": station.ev_dc_fast_num,
            "ev_level1_evse_num": station.ev_level1_evse_num,
            "ev_level2_evse_num": station.ev_level2_evse_num,
            "ev_network": station.ev_network,
            "ev_network_web": station.ev_network_web,
            "ev_other_evse": station.ev_other_evse,
            "ev_pricing": station.ev_pricing,
            "ev_renewable_source": station.ev_renewable_source,
            "ev_workplace_charging": station.ev_workplace_charging
        }
        return jsonify(station_data)
    else:
        return jsonify({"error": "Station not found"}), 404
@app.teardown_appcontext
def cleanup(resp_or_exc):
    db_session.remove()

if __name__ == '__main__':
    app.run(debug=True)
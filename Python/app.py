{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 10,
   "id": "8c9ec2e7-940f-459f-8ed4-dc9d2e57b2be",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "from flask import Flask, jsonify\n",
    "import numpy as np\n",
    "import sqlalchemy\n",
    "from sqlalchemy.ext.automap import automap_base\n",
    "from sqlalchemy.orm import Session\n",
    "from sqlalchemy import create_engine, func, distinct \n",
    "import datetime as dt\n",
    "\n",
    "\n",
    "\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 11,
   "id": "22c7e6cf-d93c-466a-bebf-935bd3aba45e",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Creating Flask app\n",
    "app = Flask(__name__)\n",
    "\n",
    "DATABASE_URI = 'sqlite:///fuel_stations.db'\n",
    "API_KEY = 'RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q'  # Replace with your actual API Key\n",
    "BASE_URL = \"https://developer.nrel.gov/api/alt-fuel-stations/v1.json\""
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 12,
   "id": "61933ce6-2c38-4adf-987e-1228a1108284",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Define the database engine\n",
    "engine = create_engine(DATABASE_URI, echo=True)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 13,
   "id": "105ad3d2-1527-4c1f-b40e-f4ae64bc0a8b",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Set up the session\n",
    "Session = sessionmaker(bind=engine)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 14,
   "id": "bfb0c29d-cce9-4ea9-9ef7-f00ed7861d3b",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Define the declarative base\n",
    "Base = declarative_base()"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 15,
   "id": "d733a2fa-6fbe-45be-9db4-318ce04a005e",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Define the FuelStation model\n",
    "class FuelStation(Base):\n",
    "    __tablename__ = 'fuel_stations'  # Specifying the name of the table\n",
    "    \n",
    "    id = Column(Integer, primary_key=True)\n",
    "    station_name = Column(String)\n",
    "    address = Column(String)\n",
    "    fuel_type_code = Column(String)\n",
    "    ev_network = Column(String)\n",
    "    ev_level1_evse_num = Column(Integer)\n",
    "    ev_level2_evse_num = Column(Integer)\n",
    "    ev_dc_fast_num = Column(Integer)\n",
    "    ev_connector_types = Column(String)\n",
    "    ev_pricing = Column(String)\n",
    "    ev_renewable_source = Column(String)\n",
    "    restricted_access = Column(Boolean)\n",
    "    state = Column(String)\n",
    "    city = Column(String)\n",
    "    zip = Column(String)\n",
    "    latitude = Column(Float)\n",
    "    longitude = Column(Float)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 16,
   "id": "31586882-0d00-4683-9310-5c290bdd26bf",
   "metadata": {
    "tags": []
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "2023-10-02 13:14:45,084 INFO sqlalchemy.engine.Engine BEGIN (implicit)\n",
      "2023-10-02 13:14:45,085 INFO sqlalchemy.engine.Engine PRAGMA main.table_info(\"fuel_stations\")\n",
      "2023-10-02 13:14:45,086 INFO sqlalchemy.engine.Engine [raw sql] ()\n",
      "2023-10-02 13:14:45,087 INFO sqlalchemy.engine.Engine COMMIT\n"
     ]
    }
   ],
   "source": [
    "# After defining the model, create all the tables in the database\n",
    "Base.metadata.create_all(engine)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 20,
   "id": "c43ee80d-c9a3-45aa-b6f9-c57508e36e09",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "app = Flask(__name__)\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 21,
   "id": "bcf644e2-c605-4cde-a195-2016aac7c336",
   "metadata": {
    "tags": []
   },
   "outputs": [],
   "source": [
    "# Defining route to get fuel stations\n",
    "@app.route('/api/fuel_stations', methods=['GET'])\n",
    "def get_fuel_stations():\n",
    "    # Querying the database for electric fuel stations in Texas\n",
    "    stations = FuelStation.query.filter_by(fuel_type_code='ELEC', state='TX').all()\n",
    "    result = []\n",
    "    # Iterating over retrieved stations to prepare the response\n",
    "    for station in stations:\n",
    "        station_data = {\n",
    "            'id': station.id,\n",
    "            'station_name': station.station_name,\n",
    "            'address': station.address,\n",
    "            'fuel_type_code': station.fuel_type_code,\n",
    "            'ev_network': station.ev_network,\n",
    "            'ev_level1_evse_num': station.ev_level1_evse_num,\n",
    "            'ev_level2_evse_num': station.ev_level2_evse_num,\n",
    "            'ev_dc_fast_num': station.ev_dc_fast_num,\n",
    "            'ev_connector_types': station.ev_connector_types,\n",
    "            'ev_pricing': station.ev_pricing,\n",
    "            'ev_renewable_source': station.ev_renewable_source,\n",
    "            'restricted_access': station.restricted_access,\n",
    "            'state': station.state,\n",
    "            'city': station.city,\n",
    "            'zip': station.zip,\n",
    "            'latitude': station.latitude,\n",
    "            'longitude': station.longitude\n",
    "        }\n",
    "        result.append(station_data)\n",
    "    # Returning the JSONified result\n",
    "    return jsonify(result)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 22,
   "id": "f83ee95f-ba62-46d3-8132-e82f3ccae40a",
   "metadata": {
    "tags": []
   },
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      " * Serving Flask app '__main__'\n",
      " * Debug mode: on\n"
     ]
    },
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.\n",
      " * Running on http://127.0.0.1:5002\n",
      "Press CTRL+C to quit\n",
      " * Restarting with watchdog (fsevents)\n",
      "Traceback (most recent call last):\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/ipykernel_launcher.py\", line 15, in <module>\n",
      "    from ipykernel import kernelapp as app\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/ipykernel/__init__.py\", line 5, in <module>\n",
      "    from .connect import *  # noqa\n",
      "    ^^^^^^^^^^^^^^^^^^^^^^\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/ipykernel/connect.py\", line 11, in <module>\n",
      "    import jupyter_client\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_client/__init__.py\", line 8, in <module>\n",
      "    from .asynchronous import AsyncKernelClient  # noqa\n",
      "    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_client/asynchronous/__init__.py\", line 1, in <module>\n",
      "    from .client import AsyncKernelClient  # noqa\n",
      "    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_client/asynchronous/client.py\", line 8, in <module>\n",
      "    from jupyter_client.client import KernelClient\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_client/client.py\", line 22, in <module>\n",
      "    from .connect import ConnectionFileMixin\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_client/connect.py\", line 27, in <module>\n",
      "    from jupyter_core.paths import jupyter_data_dir\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/jupyter_core/paths.py\", line 19, in <module>\n",
      "    from pathlib import Path\n",
      "  File \"/Users/Alejandrodavila/anaconda3/lib/python3.11/site-packages/pathlib.py\", line 10, in <module>\n",
      "    from collections import Sequence\n",
      "ImportError: cannot import name 'Sequence' from 'collections' (/Users/Alejandrodavila/anaconda3/lib/python3.11/collections/__init__.py)\n"
     ]
    },
    {
     "ename": "SystemExit",
     "evalue": "1",
     "output_type": "error",
     "traceback": [
      "An exception has occurred, use %tb to see the full traceback.\n",
      "\u001b[0;31mSystemExit\u001b[0m\u001b[0;31m:\u001b[0m 1\n"
     ]
    }
   ],
   "source": [
    "# Running the app in debug mode\n",
    "if __name__ == '__main__':\n",
    "    app.run(debug=True,port=5002)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "6d46396f-d2fb-4d9d-8f91-609768df903c",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "f645f08b-17b1-403b-a02d-20967d25d7e7",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "8f890bf3-f230-473a-968c-204777b0e848",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "a6128560-b1b8-44f3-9450-1d066e411ab2",
   "metadata": {},
   "outputs": [],
   "source": []
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "55443b85-b874-47d8-b24b-817ebf17c5dc",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.11.4"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}

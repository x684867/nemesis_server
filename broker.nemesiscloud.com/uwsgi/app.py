# broker.nemesiscloud.com (app.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
from flask import Flask
from flask import request
from BrokerDocumentation import API_Documentation
from BrokerHeartbeat import brokerHeartbeat
from BrokerObjectFactory import objectFactory

app = Flask(__name__)
#
# -----------------------------------------
# Broker Documentation Routes
# -----------------------------------------
#
@app.route("/api/")
def docs_api_general():
	docs=API_Documentation
	return docs.show('api_general')

@app.route("api/object/")
def docs_api_object():
	docs=API_Documentation
	return docs.show('api_general')
#
# -----------------------------------------
# Broker Heartbeat
# -----------------------------------------
#
@app.route("/heartbeat")
def broker_api_heartbeat():
	heartbeat=brokerHeartbeat
	return heartbeat.main()

@app.route("/stats")
	heartbeat=brokerHeartbeat
	return heartbeat.stats()
#
# -----------------------------------------
# Broker Object API
# -----------------------------------------
#
@app.route("api/object/create/")
def broker_api_object_create():
	factory=objectFactory()
	return "{'status':200,'error':False,'uuid':'"+str(factory.create())+"'}"



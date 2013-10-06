# broker.nemesiscloud.com (app.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
class brokerHeartbeat:
	def main():
		return "{'status':200,'message':'OK'}"
		#This method will query all of the servers (keys, cipher) and return a status.

	def stats():
		return "{'status':404,'message':'Stats not implemented'}"
		#Statistics will be delivered.


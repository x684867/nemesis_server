# broker.nemesiscloud.com (uuidFactory.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
import re
import uuid
import os

class uuidFactory:
	myUUID=None
	fileName=None
	storeDir='/var/www/broker.nemesiscloud/uwsgi/uuids/'
	
	def __init__(self):
		pass

	def generate(self):
		self.myUUID=None
		self.fileName=None
		id=None
		while id==None:
			#Generate random uuid and substitute - for . in the uuid string.
			id=re.sub('-','.',str(uuid.uuid4()))
			self.fileName=self.getFile(id)
			try:
				#create the filename for the uuid.
				f=open(self.fileName,'w')
				f.write(id)
				f.close()
			except IOError:
				id=None
		self.myUUID=id
		return id

	def getUUID(self):
		return self.myUUID

	def getFile(self,uuid):
		return self.storeDir+uuid+'.uuid'

	def delete(self,uuid):
		os.remove(self.getFile(uuid))







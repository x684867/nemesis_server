# cipher.nemesiscloud.com (CipherObjectFactory.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
import re
from uuidFactory import uuidFactory
from NemesisWebClient import nemesisWebClient
class objectFactory:

def __init__();
		pass

	def create():
		uuid=uuidFactory

		cipherUUID=uuid.generate()
		keyPublicUUID=uuid.generate()
		keyPrivateUUID=uuid.generate()
		keyCipherUUID=uuid.generate()

		response=200
		agent=nemesisWebClient("https://cipher.nemesiscloud.com")
		response=agent.register(keyCipherUUID)
		if response==200:
			agent=nemesisWebClient("https://keys.nemesiscloud.com")
			response=agent.register(keyPrivateUUID)
			if response==200:
				response=agent.register(keyPublicUUID)

		if response==200:
			#
			# No agent returned an error, so we can create
			# the UUID files, etc.
			#
			map_file=open(uuid.getFile(cipherUUID),'w')
			map_file.write(keyCipherUUID)
			map_file.write(keyPrivateUUID)
			map_file.write(keyPublicUUID)
			map_file.close()
			return "{'status':200,'error':False,'uuid':'"+cipherUUID+"'}"
		else:
			uuid.delete(keyCipherUUID)
			uuid.delete(keyPublicUUID)
			uuid.delete(keyPrivateuuID)
			uuid.delete(cipherUUID)

	def read(self,objectUUID):
		pass

	def update(self,objectUUID):
		pass

	def delete(self,objectUUID):
		pass
	

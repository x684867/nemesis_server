# broker.nemesiscloud.com (NemesisWebClient.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#
from urllib import urlopen

class nemesisWebClient:
	baseURL=None
	def __init__(self,url_string):
		if(len(url_string)==0):
			try:
				raise Exception("nemesisWebClient bad url_string: ("+url_string+")")
			except:
				exit(1)
		else:
			url_string="http://localhost"
		self.baseURL=url_string

	def create(self,uuid):
		doc=urlopen(self.baseURL+"/create/"+uuid)
		response_code=doc.getcode()
		if response_code==200:
			return response_code
		else:
			response_text=doc.read()
			return "{'status':"+response_code+",'message':'"+response_text+"'}"

	def read(self,uuid):
		doc=urlopen(self.baseURL+"/read/"+uuid)
		response_code=doc.getcode()
        if response_code==200:
            return response_code
        else:
            response_text=doc.read()
            return "{'status':"+response_code+",'message':'"+response_text+"'}"

	def update(self,uuid,post_data):
		pass

	def delete(self,uuid):
		doc=url(self.baseURL+"/delete/"+uuid)
		response_code=doc.getcode()
        if response_code==200:
            return response_code
        else:
            response_text=doc.read()
            return "{'status':"+response_code+",'message':'"+response_text+"'}"






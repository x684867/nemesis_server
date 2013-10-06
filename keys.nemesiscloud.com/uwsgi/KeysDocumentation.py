# keys.nemesiscloud.com (KeysDocumentation.py)
# (c) 2013 Sam Caldwell.  All Rights Reserved.
#

class API_Documentation:
	def show(self,name):
		content_file=open(name+".html")
		return content_file.read()


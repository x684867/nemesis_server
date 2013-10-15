/*
	Nemesis Web Server Class
	/srv/nemesis/app/servers/web/webServer.js
	(c) Sam Caldwell.  All Rights Reserved.
	
	This file creates a generic web server process for use by the Nemesis web services.
	When instantiated, this Class will require a configuration (JSON) object depicted
	below, a message processor class (msgProc) filename and a message router (msgRouter)
	class filename.  The msgProc and msgRouter classes must comply with--
	
		1. "Nemesis Message Processor Class Specification"  
		2. "Nemesis Message Router Class Specification."
*/
module.exports=webServerClass;

function webServerClass(config,msgProcFname,msgRouterFname){
	
	if(typeof(config)!='object') throw new Error(E_CFG_NOT_OBJECT);
	if(typeof(msgProcFname)!='string') throw new Error(E_MSGPROCFNAME_NOT_STRING);
	if(typeof(msgRouterFname)!='string') thow new Error(E_MSGROUTERFNAME_NOT_STRING);
	
	

}
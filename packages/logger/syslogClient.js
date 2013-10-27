/*
	Nemesis SYSLOG / Console Log Package
	/srv/nemesis/packages/logger/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package provides centralized logging for the application/framework
	through console and SYSLOG by overloading the screen.log() method to 
	tee writes to screen.log() both to the screen and to the logger's alternate
	output streams (e.g. log file).
		
	USE:
		root.logger
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Logger

*/
module.exports=syslogClient;

function syslogClient(){
	screen.log("syslogClient() launched.");
	screen.log("syslogClient() is not implemented");
	
	this.log=function(message){
		screen.log("syslogClient.log() fired. [msg:"+message+"]");
		screen.log("syslogClient.log() is not implemented in "+module.filename);
	}
	
	screen.log("syslogClient() constructor finished.");
}
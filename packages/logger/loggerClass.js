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
module.exports=loggerClass;

function loggerClass(loggerSourceString,loggerProcessPID,loggerPriorityString,loggerFacilityString){
	
	var sourceString;
	var processPIDnumber;
	var priorityString;
	var facilityString;
	
	Object.defineProperty(this,"source",{
		get:function(){if(types.isString(sourceString)){return sourceString;}else{error.raise(error.logger.getter.nonStringSource);}},
		set:function(s){if(types.isString(s)){sourceString=s;}else{error.raise(error.logger.setter.nonStringSource);}}
	});
	Object.defineProperty(this,"pid",{
		get:function(){if(type.isNumber(processPIDnumber)){return processPIDnumber;}else{error.raise(error.logger.getter.nonNumberPID);},
		set:function(p){if(types.isNumber(p)){processPIDnumber=p;}else{error.raise(error.logger.setter.nonNumberPID);}	}
	});
	Object.defineProperty(this,"priority",{
		get:function(){if(type.isSysLogPriority(priorityString)){return priorityString;}else{error.raise(error.logger.getter.nonSysLogPriorityValue);}},
		set:function(p){if(type.isSysLogPriority(p)){priorityString=p;}else{error.raise(error.logger.setter.nonSysLogPriorityValue);}}
	});
	Object.defineProperty(this,"facility",{
		get:function(){if(type.isSyslogFacility(facilityString)){return facilityString;}else{error.raise(error.logger.getter.nonSyslogFacilityValue);}},
		set:function(p){if(type.isSyslogFacility(p)){return facilityString;}else{error.raise(error.logger.getter.nonSyslogFacilityValue);}}
	});
	/*Initialize values with parameters passed into constructor.*/
	this.source=(loggerSourceString)?loggerSourceString:module.filename;
	this.pid=(loggerProcessPID)?loggerProcessPID:process.pid;
	this.priority=(loggerPriorityString)?loggerPriorityString:types.syslog.priority.info;
	this.facility=(loggerFacilityString)?loggerFacilityString:types.syslog.facility.local1;
	
	this.log=function(message){
		var syslog=require('./packages/logger/syslogClient.js')();
		var m=screen.now()+":"+this.source+"("+this.pid+") ["+this.facility+"]["+this.priority+"]("+message.length+")"+message;
		
		if((config.logger.display.logLevel).indexOf(this.priority)==-1) screen.log(m);
		syslog.write(m);
	}
	
	
}
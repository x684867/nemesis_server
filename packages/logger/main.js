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
{
	init=function(source,priority,facility, pid){
		/*Validate the configuration file*/
		switch(false){
			case types.isObject(config.logger.syslog):			errors.raise(errors.logger.init.invalidConfig.syslog);			break;
			case types.isString(config.logger.syslog.ip):		errors.raise(errors.logger.init.invalidConfig.syslogIp);		break;
			case types.isNumber(config.logger.syslog.port):		errors.raise(errors.logger.init.invalidConfig.syslogPort);		break;
			case types.isObject(config.logger.syslog.tls):		errors.raise(errors.logger.init.invalidConfig.syslogTLS);		break;
			case types.isString(config.logger.syslog.tls.key):	errors.raise(errors.logger.init.invalidConfig.syslogTLSkey);	break;
			case types.isString(config.logger.syslog.tls.cert):	errors.raise(errors.logger.init.invalidConfig.syslogTLScert);	break;
			case types.isString(config.logger.syslog.tls.ca):	errors.raise(errors.logger.init.invalidConfig.syslogTLSca);		break;
			default: return messages.logger.validate.codes.invalidConfig.unknown; break;
		}
		screen.log('logger configuration is valid.');

		loggerClass=require('./packages/logger/loggerClass.js');

		if(types.isUndefined(root.logger)){
			overloadScreenLog();
			root.logger=new loggerClass('app',process.pid);
		}
		if(	types.isString(source) && types.isNumber(pid)){ 
			return new loggerClass(source,pid);
			screen.log('creating local logger');
		}
	}
}

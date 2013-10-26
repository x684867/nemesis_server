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
	init=function(source,pid){
		if(validate_configuration()){
			
			/*Create the global logger if not already defined*/
			if(root.types.isUndefined(root.logger)){
			
				screen.log("     global logger not found....creating [pid:"+process.pid+"]");
				root.logger=new logger_class(root.app.title,process.pid);
				
			}else{
			
				screen.log("     global logger exists.");
				
			}		
			if(root.types.isString(source) || root.types.isNumber(pid)){
			
				screen.log("     local logger ["+source+"] for process [pid:"+pid+"] requested.");
				return new logger_class(source,pid);
				
			}else{
			
				error.warn("Invalid inputs...diagnosing....");
				if(!root.types.isString(source))
					raise(root.errors.logger.init.missingInput.Source);
				else
					raise(root.errors.logger.init.missingInput.PID);
			}
			/* */
		}else{
		
			root.error.warn("Invalid package configuration file...diagnosing....");
			
			switch(validate_configuration){
				case messages.logger.validate.codes.invalidConfig.syslog:
					errors.raise(errors.logger.init.invalidConfig.syslog);break;
				case messages.logger.validate.codes.invalidConfig.syslogIp:
					errors.raise(errors.logger.init.invalidConfig.syslogIp);break;
				case messages.logger.validate.codes.invalidConfig.syslogPort:
					errors.raise(errors.logger.init.invalidConfig.syslogPort);break;
				case messages.logger.validate.codes.invalidConfig.syslogTLS:
					errors.raise(errors.logger.init.invalidConfig.syslogTLS);break;
				case messages.logger.validate.codes.invalidConfig.syslogTLSkey:
					errors.raise(errors.logger.init.invalidConfig.syslogTLSkey);break;
				case messages.logger.validate.codes.invalidConfig.syslogTLScert:
					errors.raise(errors.logger.init.invalidConfig.syslogTLScert);break;
				case messages.logger.validate.codes.invalidConfig.syslogTLSca:
					errors.raise(errors.logger.init.invalidConfig.syslogTLSca);break;
				default:
					errors.raise(errors.logger.init.invalidConfig.unknown);break;
			}/*end of switch*/			
		}
	}
}

function logger(source.pid){


}

function validate_configuration(){

}	


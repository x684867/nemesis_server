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
	init=function(source,pid,options){
		if(!root.types.isString(source))
			root.error.raise(root.error.logger.init.invalidSourceInput);
		if(!root.types.isNumber(pid)) 
			root.error.raise(root.error.logger.init.invalidPID);
		if((!root.types.isUndefined(options)) && (!root.types.isObject(options)))
			root.error.raise(root.error.logger.init.invalidOptions);
		
		var hasConsole=(isBoolean(options.hasConsole) && (options.hasConsole))?true:false;
			hasConsole=(isUndefined(options.hasConsole))?true:hasConsole;
			
		var hasSyslog=(isBoolean(options.hasSyslog) && (options.hasSyslog))?true:false;
			hasSyslog=(isUndefined(options.hasSyslog))?false:hasSyslog;
		
		c=hasConsole?new ConsoleWriter():undefined,
		s=hasSyslog?new SyslogWriter():undefined
		
		var logWriter=new writerHead(c,s);
		logWriter.banner(['log initializing','source:'+source+' process PID:'+pid]);
		return logWriter;
	}
}
/*
*/
function ConsoleWriter(){
	this.write=function(timestamp,text){console.log('['+timestamp+']:'+text);};
}
/*
*/
function SyslogWriter(){
	this.write=function(timestamp,text){/*Not implemented*/};
}
/*
*/
function writerHead(consoleWriter,syslogWriter){

	this.write=function(text){
		var timestamp=(new Date).toISOString();
		if(consoleWriter) consoleWriter.write(timestamp,text);
		if(syslogWriter)  syslogWriter.write(timestamp,text);
	}
	
	this.drawLine=function(){
		var lineText=Array(root.config.logger.width).join('-');
		this.write(lineText);
	}
	
	this.drawDoubleLine=function(){
		var lineText=Array(root.config.logger.width).join('=');
		this.write(lineText);
	}
	
	this.banner=function(text){
		this.drawLine();
		if(isArray(text)){
			text.forEach(function(d,i,a){
				this.write("("+i+")"+d);
			});
		}else{
			this.write(text);
		}
		this.drawDoubleLine();
	}
	this.error=function(errorJSON,errorObj){
		this.write("["+errorJSON.code+"]:"+errorJSON.message);
		if(data.type.isObject(errorObj)){
			this.write(
				 "EXCEPTION:\n"
				+"\n\t["+exceptionObject.code+"]:"
						+exceptionObject.message+"\n"
			);
		}
	}
}


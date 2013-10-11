/*
	/srv/nemsis/app/nemesis-logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a syslog logging tool.
	
	Currently only TCP connections are supported.  This will go production with 
	encrypted communications over TLS (TCP).
*/

module.exports=logger;

const LOG_LINE_WIDTH=60;

const TSTR='string';
const TNUM='number';
const TOBJ='object';

const E_SYSLOG_BAD_SOURCE='SYSLOG source not a string (expected)';
const E_SYSLOG_BAD_PRIORITY='SYSLOG priority not a string (expected)';
const E_SYSLOG_BAD_FACILITY='SYSLOG facility not a string (expected)';
const E_INVALID_SOURCE='SYSLOG source not in param list';
const E_INVALID_PRIORITY='SYSLOG priority not in param list';
const E_INVALID_FACILITY='SYSLOG facility not in param list';
const E_SYSLOG_BAD_BASEDIR='SYSLOG baseDir invalid (expect string)';

const LOGGER_CONFIG='./loggerConfig.js';
const SYSLOG_CONFIG='/srv/nemesis/app/logger/logger.config.json';

function logger(s,p,f){
	if(typeof(s)!=TSTR) throw new Error(E_SYSLOG_BAD_SOURCE+':'+s);
	if(typeof(p)!=TSTR) throw new Error(E_SYSLOG_BAD_PRIORITY+':'+p);
	if(typeof(f)!=TSTR) throw new Error(E_SYSLOG_BAD_FACILITY+':'+f);
	var config=(require(LOGGER_CONFIG))(SYSLOG_CONFIG);
	if(typeof(config)!=TOBJ) throw new Error(E_SYSLOG_CONFIG_FAILED_LOAD);
	if(config.facility.indexOf(f) == -1) throw new Error(E_INVALID_SOURCE+" ["+f+"]["+config.facility.join()+"]");
	if(config.priority.indexOf(p) == -1) throw new Error(E_INVALID_PRIORITY+" ["+p+"]["+config.priority.join()+"]");
	if(typeof(config.baseDir)!=TSTR) throw new Error(E_SYSLOG_BAD_BASEDIR+" ["+config.log.baseDir+"]");

	this.source=s;
	this.priority=p;
	this.facility=f;
	
	var config_file=config.baseDir+this.sources+'.log';
	/*rotate log file*/
	try{
		b=(config_file)+'.'+parseInt((new Date).getTime()/1000);
		fs=require('fs');
		fs.renameSync(config_file,b);
		fs.writeFileSync(config_file,format(this.source,this.facility,this.priority,'log started'));
	}catch(e){
		console.log("logger.js: no log file to rotate when starting ["+config_file+"]");
	}
	/*end of rotate log file.*/
	
	var timestamp=function(){return (new Date).toUTCString();}
	var format=function(s,f,p,m){return s+"["+timestamp()+"]["+f+"]["+p+"]:"+m;}
	this.rawWrite=function(msg){(new require('fs')).appendFile(config_file,msg,function(err){if(err) throw err;});}
	this.write=function(msg){rawWrite(source,facility,priority,msg);}
	this.drawLine=function(w){
		this.rawWrite(Array((((w==undefined)||(w<0))?LOG_LINE_WIDTH:w)).join("-"));
	}
	this.drawBanner=function(t){
		this.drawLine(LOG_LINE_WIDTH);
		this.rawWrite(t);
		this.drawLine(LOG_LINE_WIDTH);
	}

}




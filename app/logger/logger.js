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
	if(config.facility.indexOf(f) == -1) throw new Error(E_INVALID_SOURCE+" ["+config.facility.join()+"]");
	if(config.priority.indexOf(p) == -1) throw new Error(E_INVALID_PRIORITY+" ["+config.priority.join()+"]");
	if(config.sources.indexOf(s) == -1) throw new Error(E_INVALID_SOURCE+" ["+config.sources.join()+"]");
	if(typeof(config.log.baseDir)!=TSTR) throw new Error(E_SYSLOG_BAD_BASEDIR+" ["+config.log.baseDir+"]");

	this.source=s;
	this.priority=p;
	this.facility=f;
	
	var config_file=config.baseDir+this.sources+'.log';

	rotateLog(config_file);
	var timestamp=function(){return (new Date).toUTCString();}
	var format=function(s,f,p,m){
		return s+"["+timestamp()+"]["+f+"]["+p+"]:"+m;
	}
	var rotateLog=function(f){
		b=(f)+'.'+parseInt((new Date).getTime()/1000);
		fs=require('fs');
		try{fs.renameSync(f,b);}catch(e){/*do nothing.*/}
		fs.writeFileSync(f,format(this.source,this.facility,this.priority,'log started'));
	}
	this.rawWrite=function(msg){
		(require('fs')).appendFile(config_file,msg,function(err){if(err) throw err;});
	}
	this.write=function(msg){rawWrite(source,facility,priority,msg);}
	this.drawLine=function(w){
		this.rawWrite(Array((((w==undefined)||(w<0))?LOG_LINE_WIDTH:w).join("-")));
	}
	this.drawBanner=function(t){
		this.drawLine(LOG_LINE_WIDTH);
		this.rawWrite(t);
		this.drawLine(LOG_LINE_WIDTH);
	}

}




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

const logfile='/var/log/nemesis/nemesis.log';

function logger(source){
	
	this.rawWrite=function(message){
		(require('fs')).writeFileSync(logfile,message,{'flags':'a'});
	}
	this.write=function(message){
		this.rawWrite(source+"["+(new Date).toUTCString()+"] "+message);
	}
	this.drawLine=function(w){
		this.rawWrite(Array((((w==undefined)||(w<0))?LOG_LINE_WIDTH:w)).join("-"));
	}
	this.drawBanner=function(t){
		this.drawLine(LOG_LINE_WIDTH);
		this.write(t);
		this.drawLine(LOG_LINE_WIDTH);
	}
}




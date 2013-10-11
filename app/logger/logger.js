/*
	/srv/nemsis/app/nemesis-logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a syslog logging tool.
	
	Currently only TCP connections are supported.  This will go production with 
	encrypted communications over TLS (TCP).
*/

module.exports=logger;

const TSTR='string';
const TNUM='number';

const SYSLOG_CONFIG='/srv/nemesis/app/logger/logger.config.json';
const SYSLOG_PARAMETERS='/srv/nemesis/app/logger/parameters.json';

function logger(src,pri,fac){

	if(typeof(src)!=TSTR) throw new Error('SYSLOG source not a string (expected)');
	if(typeof(pri)!=TNUM) throw new Error('SYSLOG priority not a number (expected)');
	if(typeof(fac)!=TNUM) throw new Error('SYSLOG facility not a number (expected)');
	var config=this.loadConfig(SYSLOG_CONFIG);
	var parameters=this.loadParameters(SYSLOG_PARAMETERS);

	if(typeof(config)!='object') throw new Error('SYSLOG config file failed to load');
	if(typeof(config)!='object') throw new Error('SYSLOG parameters file failed to load');
	if(config.facility.indexOf(fac) == -1) throw new Error('SYSLOG facility is invalid');
	if(config.priority.indexOf(pri) == -1) throw new Error('SYSLOG priority is invalid');
	if(config.sources.indexOf(src) == -1) throw new Error('SYSLOG source is invalid');

	this.source=src;
	this.priority=pri;
	this.facility=fac;
	
	var config_file=config.baseDir+config.sources+'.log';

	rotateLog(config_file);
	var timestamp(){return (new Date).toUTCString();}
	var format=function(s,f,p,m){
		return s+"["+parseInt((new Date).getTime()/1000)+"]["+f+"]["+p+"]:"+m;
	}
	var rotateLog=function(f){
		b=(f)+'.'+parseInt((new Date).getTime()/1000);
		fs=require('fs');
		try{fs.renameSync(f,b);}catch(e){/*do nothing.*/}
		fs.writeFileSync(f,format(this.source,this.facility,this.priority,'log started'));
	}
	var loadConfig=function(c){
		try{
			return JSON.parse((require('fs')).readFileSync(c));
		}catch(e){
			throw new Error('SYSLOG config file failed to read.');
		}
	}
	var loadParameters=function(p){
		try{
			return JSON.parse((require('fs')).readFileSync(p));
		}catch(e){
			throw new Error('SYSLOG parameters file failed to read.');
		}	
	}
	this.write=function(msg){
		(require('fs')).appendFile(
			config_file,
			format(source,facility,priority,msg),
			function(err){if(err) throw err;}
		);
	}
	this.drawLine=function(w){this.write(Array((((w==undefined)||(w<0))?70:w).join("-")));}
	this.drawBanner=function(t){
		i=(i==undefined)?0:i;
		this.drawLine(60,i);
		this.write(t);
		this.drawLine(60,i);
	}

}




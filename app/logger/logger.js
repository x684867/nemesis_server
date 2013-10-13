/*
	/srv/nemsis/app/logger/logger.js
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

function logger(){
	this.banner=function(m,w){log.line(w);log.write(m);log.line(w);console.log(" ");},
	this.line=function(w){console.log(Array(w).join('-'));},
	this.write=function(m){console.log(timestamp()+m)},
	this.list_pids=function(){
		for(i=0,p='';i<global.procs.length;i++){p=p+global.procs[i].pid+',';}
		log.write("   PID_List:["+p.substring(0,p.length-1)+"]");
	}
}



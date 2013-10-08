/*
	/srv/nemsis/app/nemesis-logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates the Nemesis Logger, which will allow the application
	to write output to stdout or syslog with only a single change in this 
	file.
	
	While working on development, this file will simply write output to
	stdout.  It will take care of any formatting or other cosmetic issues.
	But before this project goes into production, syslog will be added so that
	daemonized processes can send their output to syslog without much effort.
*/
module.exports=logger;

function logger(){/* Constructor*/}

logger.source='SourceNotSet';

logger.indent=function(i){return Array(i).join(" ");}

/*write(message,intend)*/
logger.write=function(m,i){
	i=(i==undefined)?0:i-(logger.source.length+1);
	i=(i<=0)?0:i;
	console.log(logger.source+":"+logger.indent(i)+m);
}

/*drawLine(width,indent). Default Width==60*/
logger.drawLine=function(w,i){
	i=(i==undefined)?0:i;
	w=((w==undefined)?60:w)-i-(logger.source.length+1);
	w=(w<=0)?0:w;
	console.log(logger.source+":"+logger.indent(i)+Array(w).join("-"));
}

/*drawBanner(message)*/
logger.drawBanner=function(t,i){
	i=(i==undefined)?0:i;
	logger.drawLine(60,i);
	logger.write(t);
	logger.drawLine(60,i);
}
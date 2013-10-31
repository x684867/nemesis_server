/*
	Nemesis Global Logger Management Package
	/srv/nemesis/packages/logger/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package overloads the console object [e.g. console.log() and console.error()]
	to add functionality.
		
	USE:
		root.logger
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Logger
	
*/
module.exports=function(){

	console.now=function(){
		var d=new Date;
		return d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()+'@'
			  +d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	};
	console.source='no_source';
	console.syslog=void(0); /*Undefined by default*/
	console.stdout=console.log;
	console.stderr=console.error;
	console.stdlog=console.syslog;	
	console.width=process.stdout.columns;
	console.height=process.stdout.rows;
	process.on('resize',function(){
		console.width=process.stdout.columns;
		console.height=process.stdout.rows;
	});
	console.log=function(m){
		var currMessage=console.now()+"["+console.source+"]:"+m;
		console.stdout(currMessage);
		if((typeof(console.syslog)=='undefined')) console.syslog.write(currMessage);
	}
	console.error=function(m){
		var currMessage=console.now()+"["+console.source+"]:"+m;
		console.stderr(currMessage);
		if((typeof(console.syslog)=='undefined')) console.syslog.write(currMessage);
	}
	console.clear=function(){console.stdout(Array(console.height).join('\n'));}

	console.create=function(src,options){
		var nc=new console.constructor(process.stdout);
		nc.syslog=new syslogClient(src,options);
		return nc;
	}

	if(root.config.logger.debug){
		console.error("Starting types constructor.");
		console.error("----------------------------");
		console.error("    SCREEN  CONFIG:");	
		console.error("----------------------------");
		console.dir(root.config.logger);	
		console.error("----------------------------");
	};
}	

function syslogClient(src,options){
	/*
		Prototype for the syslogClient
	*/
	console.log("syslogClient is not yet implemented.");
}
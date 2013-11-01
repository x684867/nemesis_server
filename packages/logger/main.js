/*
	Nemesis Global Console/Log Management Package
	/srv/nemesis/packages/logger/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package overloads the console object [e.g. console.log() and console.error()]
	to add functionality.
		
	USE:
	
		console
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Logger
	
*/
module.exports=function(source){
	console.now=function(){
		var d=new Date;
		return d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()+'@'
			  +d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	};
	console.source=(typeof(source)=='undefined')?process.title:source;
	if(config.logger.syslog.enabled){
		console.syslog=new syslogClient(config.logger.syslog); /*Undefined by default*/
	}
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
		var currMessage=console.now()+"["+console.source+"("+process.pid+")]:"+m;
		console.stdout(currMessage);
		if((typeof(console.syslog)=='undefined')) console.syslog.write(currMessage);
	}
	console.error=function(m){
		var currMessage=console.now()+"["+console.source+"("+process.pid+")]:"+m;
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
		console.error("Starting types constructor.\n"+
					  "----------------------------\n"+
					  "      SCREEN  CONFIG:\n");	
		console.error("----------------------------\n");
		console.dir(root.config.logger);	
		console.error("----------------------------");
	};
}	

function syslogClient(src,options){
	/*
		Prototype for the syslogClient
	*/
	console.log("syslogClient is not yet implemented.");
	/*
		syslogClient will configure the client to--
		
		   -provide a write() method to open a TCP (TLS-encrypted) 
			socket on some port specified in the config options 
			(JSON) passed into the constructor.
			
		   -send a message to a target server over the above socket.
	*/
		
		
}
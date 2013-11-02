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
module.exports=function(src,options){
	console.now=function(){
		var d=new Date;
		return d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()+'@'
			  +d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	};
	console.source=(typeof(src)=='undefined')?process.title:src;

	console.init=function(localConsole,src,options){	
		if(config.logger.syslog.enabled){
			localConsole.syslog=new syslogClient(options); /*Undefined by default*/
		}
		localConsole.stdout=localConsole.log;
		localConsole.stderr=localConsole.error;
		localConsole.stdlog=localConsole.syslog;	
		localConsole.width=process.stdout.columns;
		localConsole.height=process.stdout.rows;
		process.on('resize',function(){
			localConsole.width=process.stdout.columns;
			localConsole.height=process.stdout.rows;
		});
		localConsole.log=function(m){
			var currMessage=console.now()+"["+localConsole.source+"("+process.pid+")]:"+m;
			localConsole.stdout(currMessage);
			if((typeof(localConsole.syslog)=='undefined')) localConsole.syslog.write(currMessage);
		}
		console.error=function(m){
			var currMessage=localConsole.now()+"["+localConsole.source+"("+process.pid+")]:"+m;
			localConsole.stderr(currMessage);
			if((typeof(localConsole.syslog)=='undefined')) localConsole.syslog.write(currMessage);
		}
		localConsole.clear=function(){localConsole.stdout(Array(localConsole.height).join('\n'));}
		localConsole.drawDoubleLine=function(){localConsole.log(Array(localConsole.width).join('='));}
		localConsole.drawLine=function(){localConsole.log(Array(localConsole.width).join('-'));}
	};
	
	console.create=function(src,options){
		newConsole=new console.constructor(process.stdout);
		console.init(newConsole,src,options);
		return newConsole;
	}
	console.init(console,src,options);
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
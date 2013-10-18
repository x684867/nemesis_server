/*
	/srv/nemsis/core/core.logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a syslog logging tool.
	
	Currently only TCP connections are supported.  This will go production with 
	encrypted communications over TLS (TCP).
*/

module.exports=logger;

require('util');

function logger(source,pid,w){

	this.width=(w==undefined)?60:w;
	
	this.screen={
	
		print:function(text){util.log("["+source+":"+pid+"]"+text);}
		line:function(){util.log(Array(logger.width).join("-"));}
		doubleLine:function(){util.log(Array(logger.width).join("="));}

		banner:function(text){
				console.log(" ");
				logger.screen.doubleLine();
				logger.screen.print(text);
				logger.screen.doubleLine();
				console.log(" ");
		}	
	}
	this.write=function(m){util.log(m);},

	this.error(errorJSON,errorObj){
		this.write("["+errorJSON.code+"]:"+errorJSON.message);
		if(typeof(errorObj)=='object'){
			this.write(
				 "EXCEPTION:\n"
				+"\n\t["+exceptionObject.code+"]:"
						+exceptionObject.message+"\n"
			);
		}
	}
	
}


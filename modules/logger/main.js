/*
	/srv/nemsis/core/core.logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a syslog logging tool.
	
	Currently only TCP connections are supported.  This will go production with 
	encrypted communications over TLS (TCP).
*/

module.exports=init;

require('util');

function init(source,pid,options){
	if(typeof(soruce)!='string') root.error

}
	
	root.modules.logger.screen={
	
		print:function(text){
			util.log(
				"["+source+":"+pid+"]"+text
			);
		},
		
		line:function(){
			util.log(
				Array(
					root.config.logger.width).join("-")
				);
		},
		
		doubleLine:function(){
			util.log(
				Array(root.config.logger.width).join("=")
			);
		},

		banner:function(text){
				console.log(" ");
				logger.screen.doubleLine();
				logger.screen.print(text);
				logger.screen.doubleLine();
				console.log(" ");
		}	
	};
	this.write=function(m){util.log(m);};

	this.error=function(errorJSON,errorObj){
		this.write("["+errorJSON.code+"]:"+errorJSON.message);
		if(data.type.isObject(errorObj)){
			this.write(
				 "EXCEPTION:\n"
				+"\n\t["+exceptionObject.code+"]:"
						+exceptionObject.message+"\n"
			);
		}
	}
	
}


/*
	Nemesis Error Handling Constructor
	/srv/nemesis/core/core.error.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file will establish error handling as root.error.{messages,raise()}
	
*/
module.exports=error_handler;


function error_handler(){
	console.log('error_handler() executing.');
	root.error={};
	root.error.messages=require(root.conf_dir+"/errors/errors-"+root.config.language+".json");
	
	console.log(Array(50).join('-'));
	console.dir(root.error);
	console.log(Array(50).join('-'));
	
	
	raise=function(e){	
		require('util');
		util.log(Array(60).join('=')+"\nERROR:");
		switch(typeof(e)){
			case "object":
				util.log("      CODE:"+e.code);
				util.log("   MESSAGE:"+e.text);
				if((typeof(e.code.fatal)=='boolean') && e.code.fatal ){
					util.log("----STACK TRACE----");
					console.trace();
					/*
						Need a debugging stack trace.
					*/
					process.exit(e.code);
				}
				break;
			case "string":
			case "number":
			case "boolean":
				util.log("   MESSAGE:"+e);
				break;
			default:
				util.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
				util.log("   MESSAGE:"+e);
				break;
		}
	}
	console.log('error_handler() terminating.');
}
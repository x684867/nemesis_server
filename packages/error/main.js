/*
	Nemesis Global Error Handler Package
	/srv/nemesis/packages/error/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package creates a centralized error handling mechanism for the framework, including
	error management and error reporting.  Each package consuming this error handler service
	can provide its own localized and package-specific error strings, extending the root.error
	object created by this package so that packages are kept light and free of expensive load
	time binding.
	
	USE:
		root.error
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Error
	
*/
module.exports=function(){

	if((typeof(root.config.error.debug)=='boolean')&&(root.config.error.debug)){
		console.log("starting error constructor.");
		console.log("----------------------------");
		console.log("    ERROR CONFIG:");	
		console.log("----------------------------");
		console.dir(root.config.error);	
		console.log("----------------------------");
	}

		
	root.error.warn=function(message){
		screen.log("WARNING! "+message);
	};
		
	root.error.raise=function(errorJSON,detail){ 
		root.screen.drawDoubleLine();
		if(isObject(errorJSON)){
			root.screen.log("      CODE:"+errorJSON.code);
			root.screen.log("   MESSAGE:"+errorJSON.text);
			if(typeof(detail)=='string') root.screen.log("    DETAIL:"+detail);  
			if((typeof(errorJSON.code.fatal)=='boolean') && errorJSON.code.fatal ){
				console.trace();
				if(errorJSON.type=='fatal'){
					process.exit(errorJSON.code);
				}else{
					root.screen.log("ERROR IS NON-FATAL!  Type:"+errorJSON.type);
				}
			}
		}else{
			root.screen.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
			root.screen.log("   MESSAGE:"+errorJSON);
		}
	}
	
	if((typeof(root.config.error.debug)=='boolean')&&(root.config.error.debug)){
		console.log("----------------------------");
		console.log("    ERROR PACKAGE:");	
		console.log("----------------------------");
		console.dir(root.error);	
		console.log("----------------------------");
	}	
}


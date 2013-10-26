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
{
	init=function(){
		root.error.raise=function(errorJSON,detail){ evaluate_error(errorJSON,detail); }
		root.error.warn=function(message){screen.log("WARNING! "+message);}	
	}
}

/*----------------*/

function evaluate_error(errorJSON,detail){
	root.screen.drawDoubleLine();
	switch(typeof(errorJSON)){
		case "object":
			root.screen.log("      CODE:"+errorJSON.code);
			root.screen.log("   MESSAGE:"+errorJSON.text);
			if(typeof(detail)=='string') root.screen.log("    DETAIL:"+detail);  
			if((typeof(errorJSON.code.fatal)=='boolean') && errorJSON.code.fatal ){
				root.screen.log("----STACK TRACE----");
				console.trace();
				/*
					Need a debugging stack trace.
				*/
				process.exit(errorJSON.code);
			}
			break;
			
		case "string":
		case "number":
		case "boolean":
			root.screen.log("   MESSAGE:"+errorJSON);
			break;
			
		default:
			root.screen.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
			root.screen.log("   MESSAGE:"+errorJSON);
			break;
	}
}

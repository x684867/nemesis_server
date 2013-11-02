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
	error.warn=function(m){console.error("WARNING! "+m);};
	error.raise=function(errorJSON,detail){ 
		console.drawDoubleLine();
		if(types.isObject(errorJSON)){
			console.error("Error!\n\t\tCODE:"+errorJSON.code+", MESSAGE:'"+errorJSON.text+"'");
			if(typeof(detail)=='string') root.screen.log("\tDETAIL:"+detail);  
			if((typeof(errorJSON.code.fatal)=='boolean') && errorJSON.code.fatal ){
				console.trace();
				if(errorJSON.type=='fatal')
					process.exit(errorJSON.code);
				else
					console.error("ERROR IS NON-FATAL!  Type:"+errorJSON.type);
			}
		}else{
			console.error("UNEXPECTED ERROR TYPE:"+typeof(e)+", MESSAGE:"+errorJSON);
		}
	}	
}


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
		root.error.warn=function(message){ display_error(message);}
		root.error.write_log(message){console.log(message);/*Generic output method for overloading.*/}
		
		process.stdout.on('resize'
		
	}
}

var util=require('util');

const timestamp_width=19;
/*
	timestamp_width is determined by
	
	1. require('util').log('');
	2. copy the result (below, see #3)
	3. Execute the following for size...
	
			'25 Oct 22:08:56 - '.length +1
			
	4. Add one for \n presumed.
*/

function get_default_timestamp(){
	var d=new Date();
	
function drawDoubleLine(){util.log(Array(process.stdout.columns - timestamp_width));}
function drawSingleLine(){util.log(Array(process.stdout.columns - timestamp_width));}
function display_error(message){

}
function evaluate_error(errorJSON,detail){
	var util=require('util');
	util.log(Array(60).join('=')+"\nERROR:");
	switch(typeof(errorJSON)){
			case "object":
				util.log("      CODE:"+errorJSON.code);
				util.log("   MESSAGE:"+errorJSON.text);
				if(typeof(detail)=='string') util.log("    DETAIL:"+detail);  
				if((typeof(errorJSON.code.fatal)=='boolean') && errorJSON.code.fatal ){
					util.log("----STACK TRACE----");
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
				util.log("   MESSAGE:"+errorJSON);
				break;
				
			default:
				util.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
				util.log("   MESSAGE:"+errorJSON);
				break;
		}
	}
}
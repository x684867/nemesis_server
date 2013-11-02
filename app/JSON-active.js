/*
	JSON Active (JSON Object Extension)
	(c) 2013 Sam Caldwell.  Public Domain
	
	Requires JSON-commented.js
	
	JSON-active.js extends the JSON.commented object (which in turn extends JSON-active) to allow
	a JSON file which contains both C-Style comments and functions.  The JSON specification does not
	allow either comments or functions.  While the lack of comments is poorly justified by most 
	perspectives, the lack of functions is seen as more reasonable.  JSON (according to the 
	specification) is intended as a means of transferring information rather than as a means of 
	transferring instructions.  However, "active JSON" extends the purpose of traditional JSON
	to merge code and data as a single unit.
	
	JSON-active provides calls to parse() and load() which will load a .json file into memory and 
	'parse' (exec) the JSON string.  This is a specifically *DANGEROUS* feature if not used 
	properly and with planning.  Active JSON is no different than any other .js file.  It is code
	as well as data.  
	
	When the JSON-active.js file is required (example below), the JSON object is extended for 
	JSON-commented *AND* JSON-active:
	
	require('JSON-active.js')();
	
	If the above line appears more than once, no harm will occur.  A simple notice will appear in 
	console.log if the showWarning property is set.
		
 */
module.exports=function(){
 
 	JSON.showWarnings=false,
 	require('./JSON-commented.js')();
 	
 	
 	
 	if(typeof(root.JSON.active)=='undefined'){
	 	JSON.active={
		 	parse:function(jsonString){
	 			if(typeof(jsonString)=='string')
	 				return exec(jsonString);
	 			else
	 				throw new Error('jsonString is not a string as expected.');
	 		},
	 		load:function(jsonFile){
	 			var fs=require('fs');
	 			if(typeof(jsonFile)=='string')
	 				if(fs.lstatSync(jsonFile).isFile()){
	 					if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings){
	 						console.log('jsonFile ['+jsonFile+'] exist!');
	 					}
	 					return eval(
	 						fs.readFileSync( jsonFile, {"encoding":"utf8"} )
	 					);
	 				}else
	 					throw new Error('     jsonFile does not exist: '+jsonFile);
	 			else
	 				throw new Error('jsonFile is not a string (filename) as expected');
			}
		}
	}else{
		if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings){
			console.log('     JSON.commented was already defined.  Not reloading.');
		}
	}
}
/*
	JSON Commented (JSON Object Extension)
	(c) 2013 Sam Caldwell.  Public Domain
	
	JSON-commented.js extends the JSON object to allow C-style comments in the JSON files.
	This extension creates JSON.commented as an object within JSON, preserving the original
	JSON.parse() functionality while also allowing calls to JSON.commented.parse() to return
	a JSON object cleaned of any embedded comments.  This extension also has a load() method
	which will load a JSON file, strip its comments and return the result.
	
	JSON.commented is only needed one time and should be required then executed as follows from
	any file in your project:
	
	require('JSON-commented.js')();
	
	If the above line appears more than once, no harm will occur.  A simple notice will appear in 
	console.log if the showWarning property is set.
	
	
 */
module.exports=function(){
 
 	JSON.showWarnings=false;
 	
 	if(typeof(root.JSON.commented)=='undefined'){
	 	JSON.commented={
		 	parse:function(jsonString){
	 			if(typeof(jsonString)=='string')
	 				return JSON.parse(jsonString.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,''));
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
	 					return JSON.commented.parse(
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
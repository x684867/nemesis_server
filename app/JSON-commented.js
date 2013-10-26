/*
	JSON Commented (JSON Object Extension)
	(c) 2013 Sam Caldwell.  Public Domain
 */
 module.exports=init;
 
 function init(){
 
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
	 					console.log('jsonFile ['+jsonFile+'] exist!');
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
		console.log('     JSON.commented was already defined.  Not reloading.');
	}
}
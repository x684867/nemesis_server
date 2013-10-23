/*
	JSON Commented (JSON Object Extension)
	(c) 2013 Sam Caldwell.  Public Domain
 */
 
 module.exports=init;
 
 function init(){
 
 	if(typeof(root.JSON.commented)=='object'){
 	
	 	root.JSON.commented={}
	 	root.JSON.commented.parse=function(jsonString){
	 		if(typeof(jsonString)=='string'){
	 			return JSON.parse(jsonString.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,''));
	 		}else{
	 			console.log('jsonString is not a string as expected.');
	 		}
	 	}
	 	root.JSON.commented.load=function(jsonFile){
	 		if(typeof(jsonFile)=='string'){
	 			if(require('fs').lstatFileSync(jsonFile).isFile){
	 				return this.parse(require('fs').readFileSync(jsonFile));
	 			}else{
	 				console.log('jsonFile does not exist: '+jsonFile);
	 			}
	 		}else{
	 			console.log('jsonFile is not a string (filename) as expected');
	 		}
		}
	}else{
		console.log('root.JSON.commented already loaded.');
	}
}
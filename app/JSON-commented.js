/*
	JSON Commented (JSON Object Extension)
	(c) 2013 Sam Caldwell.  Public Domain
 */
 
 module.exports=init;
 
 function init(){
 
 	if(typeof(root.JSON.commented)=='undefined'){
 		console.log("loading JSON.commented object");
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
		if(typeof(root.JSON.commented)!='object') console.log("failed to create JSON.commented object.");
		if(typeof(root.JSON.commented.parse)!='function') console.log("failed to create JSON.commented.parse() method.");
		if(typeof(root.JSON.commented.load)!='function') console.log("failed to create JSON.commented.load() method.");
	}else{
		console.log('root.JSON.commented already loaded.');
	}
}
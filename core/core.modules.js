/*
		Nemesis Application Core Module Loader
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the modules defined in 
		root.config.modules (defined by bootstrap.js).
 */
 
module.exports=load_modules;

function fileNotExists(fname){return require('fs').lstatSync(fname).isFile()}
function isUndefined(o){return (typeof(o)=='undefined')?true:false;}

function load_modules(){


	console.log(Array(50).join('-'));
	console.log("Dump root.error.messages in "+module.filename+":");
	console.log(Array(50).join('-'));
	console.dir(root.error);
	console.log(Array(50).join('-'));

	var o={}
	root.config.modules.forEach(function(m,i,a){
		if(typeof(m)=='object'){
			if(typeof(m.group)!='string'){
				root.error.raise(root.error.messages.bootstrap.invModuleGroup);
			}
			if(typeof(m.name)!='string'){
				root.error.raise(root.error.messages.bootstrap.invModuleName);
			}
			if(typeof(m.file)!='string'){
				root.error.raise(root.error.messages.bootstrap.invModuleFile);
			}
			if(fileNotExists(m.file)){
				root.error.raise(root.error.messages.bootstrap.missingModuleFile);
			}			
			if(isUndefined(root.config.modules)){
				root.config.modules={};
			}
			if(isUndefined(root.config.modules[m.group])){
				root.config.modules[m.group]={};
			}
			if(isUndefined(root.config.modules[m.group][m.name])){
				root.config.modules[m.group][m.name]={};
			}
			
			root.config.modules[m.group][m.name]=require(m.file);
			
		}else{
			console.log("In "+module.filename+" root.errors is not yet defined.");
			root.error.raise(root.error.messages.bootstrap.invalidModule);
		}
	});
	if(root.debug){
		console.log("-----MODULES LOADED-----");
		console.dir(root.config.modules);
		console.log("------------------------");
	}
}
/*
		Nemesis Application Core Module Loader
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the modules defined in 
		root.config.modules (defined by bootstrap.js).
 */
 
modules.export=function(){

	load_modules=function(){
		var o={}

			root.config.modules.forEach(
			function(m,i,a){
				if(typeof(m)=='object'){
				
					init_object=function(o){ if(typeof(o)==undefined) o={} };
					
					init_object(root.config.modules);
					init_object(root.config.modules[m.group]);
					init_object(root.config.modules[m.group][m.name]);
					
					root.config.modules[m.group][m.name]=require(m.file);
					
				}else{
				
					root.error.throw(root.error.messages.bootstrap.invalidModule);
					
				}
			}
		);
		if(root.debug){
			console.log("-----MODULES LOADED-----");
			console.dir(root.config.modules);
			console.log("------------------------");
		}
	}
}
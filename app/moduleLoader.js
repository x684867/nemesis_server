/*
		Nemesis Application Core Module Loader
		/srv/nemesis/core/core.modules.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the modules defined in 
		root.config.modules (defined by bootstrap.js).
 */
module.exports=init;
/* */
function init(){

	/*Inspect the root.config object to validate the Application configuration.*/
	if(typeof(root.config)!='object') throw new Error('root.config not defined as object');
	if(typeof(root.config.app)!='object') throw new Error('root.config.app not defined as object');
	if(typeof(root.config.app.modules)!='string') throw new Error('root.config.app.modules not defined as string');
	/*Verify that the modules directory (provided by root.config.app.modules) exists.*/
	if( !require('fs').statSync(root.config.app.modules).isDirectory() ) throw new Error('root.config.app.modules is not a valid directory');
	/*Initialize root.modules where modules will be loaded.*/
	root.modules={};

	root.modules.load=function(modName){
		var fs=require('fs');
		require('fs').readdirSync(root.config.app.modules).forEach(function(modName){
			if(typeof(root.modules[modName])=='undefined'){
				/*Module is not loaded*/
				console.log('Module ['+modName+'] loading...');
				var module_path=root.config.app.modules+modName+"/";
				if(fs.statSync(module_path).isDirectory()){
					/*Module directory exists*/
					var module_manifest=module_path+"manifest.json";
					if(fs.statSync(module_manifest).isFile()){
						/*The module manifest file is found.*/
						console.log("     loading module ["+module_manifest+"] manifest.");
						root.modules[modName]={};
						root.modules[modName].manifest=require(module_manifest);
						if(typeof(root.modules[modName].manifest)!='object'){
							throw new Error('ERROR! Failed to load module manifest ['+modName+']');
						}
						
						if (isManifestValid(root.modules[modName].manifest)){
							/*Satisfy the dependencies*/
							root.modules[modName].manifest.dependencies.forEach(function(dependencies,index,array){load_module_files(module_path,dependencies);});
							/*Then load the module in question*/
							load_module_files(module_path,modName);
						}else{
							throw new Error('     Module('+modName+') manifest file is invalid.');
						}
					}else{
						throw new Error('     Module ('+modName+') manifest file not found.  Check ('+module_manifest+')');
					}
				}else{
					throw new Error('module ('+modName+') not found.  Check ('+module_path+')');
				}
			}else{
				console.log('Module ['+modName+'] loaded already...skipping');
			}
		});
	}
}
/* */
function load_module_files(module_path,modName){
	/*Load the module configuration*/
	root.config[modName]=require(root.modules[modName].manifest.config);
	/*Load the module error localization file*/
	root.error[modName]=require(module_path+"errors"+process.env.LANG+".json");
	root.messages[modName]=require(module_path+"messages"+process.env.LANG+".json");
	root.modules[modName].main=require(root.modules[modName].manifest.main);
}
/* */
function isManifestValid(manifest){
	/*Validate manifest JSON*/
	if( typeof( manifest )=='object' )
		if( typeof( manifest.name )=='string' )
			if( typeof( manifest.group )=='string' )
				if( typeof( manifest.main )=='string' )
					if( typeof( manifest.config )=='string' )
						if( ( typeof( manifest.dependencies ) == 'object' ) && 
							( typeof( manifest.dependencies.forEach ) == 'function' ) 
						)						
							return true;
						else
							throw new Error('Invalid manifest.dependencies.  Expected Array.');						
					else
						throw new Error('Invalid manifest.config (expected string).');
				else
					throw new Error('Invalid manifest.main (expected string).');
			else
				throw new Error('Invalid manifest.group.  Expected string.');
		else
			throw new Error('Invalid manifest.name.  Expected string.');
	else
		throw new Error('Invalid manifest detected for module.  Expected object.');
}
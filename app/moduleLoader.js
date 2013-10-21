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
	if(typeof(root.config)!='object') throw new Error('root.config not defined as object');
	if(typeof(root.config.app)!='object') throw new Error('root.config.app not defined as object');
	if(typeof(root.config.app.modules)!='string') throw new Error('root.config.app.modules not defined as string');
	if( !require('fs').statSync(root.config.app.modules).isDirectory() ) throw new Error('root.config.app.modules is not a valid directory');
	
	root.modules={};
	
	root.modules.load=function(modName){	modInspect(modName,'standard');	}
	
	root.modules.preload=function(modName){	modInspect(modName,'preload');	}
	
	root.modules.loadall=function(){
		var fs=require('fs');
		console.log(Array(80).join('='));
		console.log('loading standard loadTime modules in ('+root.config.app.modules+').');
		console.log(Array(80).join('-'));
		require('fs').readdirSync(root.config.app.modules).forEach(
			function(modName,index,array){
				if(typeof(root.modules[modName])=='undefined'){
					console.log('Module ['+modName+'] loading...\t\t\t[loadall()]');
					modInspect(modName,'standard');
				}else{
					console.log('Module ['+modName+'] loaded already...skipping');
				}
			}
		);
		console.log(Array(80).join('=')+'\nDone Loading [loadall()]\n'+Array(80).join('='));
	}
}
/* */
function modInspect(modName,loadTime){
	fs=require('fs');
	
	if(['preload','standard','postload'].indexOf(loadTime)==-1) throw new Error('invalid loadTime parameter passed to modInspect().');

	/* init module object. */
	root.modules[modName]={}
	var module_path=root.config.app.modules+modName+"/";
	
	if( !fs.statSync(module_path).isDirectory() ) throw new Error('module ('+modName+') not found.  Check ('+module_path+')');

	var module_manifest=module_path+"manifest.json";
	if( fs.statSync(module_manifest).isFile() ) {
		console.log("     module_manifest ["+modName+"]: "+module_manifest);
		try{
			root.modules[modName].manifest=require(module_manifest);
		}catch(e){
			throw new Error('manifest.json failed to load.  ERROR='+e);
		}
	}else{
		throw new Error('manifest.json not found');
	}
	
	if (isManifestValid(root.modules[modName].manifest)&&(root.modules[modName].manifest.loader.loadTime==loadTime)){
		load_my_module(modName);			
	}else{
		console.log(
		     '     Not loading module [' + modName + '].'
			+'       Module loadTime=' + root.modules[modName].manifest.loader.loadTime 
			+'       Expected '+loadTime
		);
	}
	var error_file=module_path+"errors-"+process.env.LANG+".json"
	if( fs.statSync(error_file ) ){
		console.log("     error_file ["+modName+"]: "+error_file);
		root.config[modName]=require(error_file);
	}else{
		throw new Error ('error file not found: '+error_file);
	}
}
/* */
function missingDependencies(modName){
	if( (typeof(root.modules[modName].manifest.loader.dependencies)=='object') &&
		(typeof(root.modules[modName].manifest.loader.dependencies.forEach)=='function')){
		
		if(root.modules[modName].manifest.loader.dependencies.length == 0){
			return false; /*No dependencies specified.*/
		}else{
			root.modules[modName].manifest.loader.dependencies.forEach(function(d,i,a){
				if(typeof(d)!='string') 
					throw new Error('Bad dependency definition (expected string): '+d);
				if(typeof(root.modules[d])=='undefined'){
					return true;/*Missing dependency.*/
				}else{
					return false;/*This dependency is loaded.*/
				}
			});
		}
	}else{
		if(typeof(root.modules[modName].manifest.loader.dependencies)=='undefined'){
			return false; /*No dependencies specified.*/
		}else{
			throw new Error('module ['+modName+'] manifest is missing dependency array.')
		}	
	}
}
/* */
function load_my_module(modName){
 	if(missingDependencies(modName)){
		throw new Error('module '+modName+' is missing one or more dependencies.');
	}
	var config_file=root.modules[modName].manifest.config;
	if( fs.statSync(config_file) ) {
		console.log("     config_file ["+modName+"]: "+config_file);
		root.config[modName]=require(config_file);
	}else{
		throw new Error ('config file not found: '+config_file);
	}
	var main_file=root.modules[modName].manifest.main;
	if( fs.statSync(main_file) ) {
		console.log("     main_file ["+modName+"]: "+main_file);
		root.config[modName]=require(main_file);
	}else{
		throw new Error ('main file not found: '+main_file);
	}
	/*
		Add more objects from the manifest here.
	 */
}
/* */
function isManifestValid(manifest){
	/*Validate manifest JSON*/
	if(typeof( manifest )=='object' )
		if(typeof( manifest.name )=='string' )
			if(typeof( manifest.group )=='string' )
				if(typeof( manifest.main )=='string' )
					if(typeof( manifest.config )=='string' )
						if(typeof( manifest.loader )=='object' )
							if(typeof( manifest.loader.loadTime )=='string' )
								if(['preload','standard','postload'].indexOf(manifest.loader.loadTime)==-1)
									return true;
								else
									throw new Error('Invalid loader.loadTime value.  Expected {"preload" or "standard"}.  module:'+modName);
							else						
								throw new Error('Invalid loader.loadTime.  Expected string.  module:'+modName);
						else
							throw new Error('Invalid manifest loader object.  module:'+modName);
					else
						throw new Error('Invalid manifest config (expected string).  module:'+modName);
				else
					throw new Error('Invalid manifest main (expected string).  module:'+modName);
			else
				throw new Error('Invalid manifest group.  Expected string. module:'+modName);
		else
			throw new Error('Invalid manifest name.  Expected string.  module:'+modName);
	else
		throw new Error('Invalid manifest detected for module.  Expected object.'+modName);
}
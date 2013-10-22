/*
		Nemesis Application Core package Loader
		/srv/nemesis/core/core.packages.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the packages defined in 
		root.config.packages (defined by bootstrap.js).
 */
package.exports=init;
/* */
function init(){

	/*Inspect the root.config object to validate the Application configuration.*/
	if(typeof(root.config)!='object') throw new Error('root.config not defined as object');
	if(typeof(root.config.app)!='object') throw new Error('root.config.app not defined as object');
	if(typeof(root.config.app.packages)!='string') throw new Error('root.config.app.packages not defined as string');
	/*Verify that the packages directory (provided by root.config.app.packages) exists.*/
	if( !require('fs').statSync(root.config.app.packages).isDirectory() ) throw new Error('root.config.app.packages is not a valid directory');
	/*Initialize root.packages where packages will be loaded.*/
	root.packages={};

	root.packages.load=function(modName){
		var fs=require('fs');
		require('fs').readdirSync(root.config.app.packages).forEach(function(modName){
			if(typeof(root.packages[modName])=='undefined'){
				console.log('package ['+modName+'] loading...');
				/*
					Load the manifest and determine if there are dependencies.
				*/
				
				var package_path=root.config.app.packages+modName+"/";
				
				if(fs.statSync(package_path).isDirectory()){
					/*package directory exists*/
					var package_manifest=package_path+"manifest.json";
					if(fs.statSync(package_manifest).isFile()){
						/*The package manifest file is found.*/
						console.log("     loading package ["+package_manifest+"] manifest.");
						root.packages[modName]={};
						root.packages[modName].manifest=require(package_manifest);
						if(typeof(root.packages[modName].manifest)!='object'){
							throw new Error('ERROR! Failed to load package manifest ['+modName+']');
						}
						console.log("dumping package....");
						console.dir(root.packages[modName]);
						console.log("-----------------------------------");
						
						if (isManifestValid(root.packages[modName].manifest)){
							/*Satisfy the dependencies*/
							root.packages[modName].manifest.dependencies.forEach(function(dependencies,index,array){load_package_files(package_path,dependencies);});
							/*Then load the package in question*/
							load_package_files(package_path,modName);
						}else{
							throw new Error('     package('+modName+') manifest file is invalid.');
						}
					}else{
						throw new Error('     package ('+modName+') manifest file not found.  Check ('+package_manifest+')');
					}
				}else{
					throw new Error('package ('+modName+') not found.  Check ('+package_path+')');
				}
			}else{
				console.log('package ['+modName+'] loaded already...skipping');
			}
		});
	}
}
/* */
function load_package_files(package_path,modName){
	/*Load the package configuration*/
	root.config[modName]=require(root.packages[modName].manifest.config);
	/*Load the package error localization file*/
	root.error[modName]=require(package_path+"errors"+process.env.LANG+".json");
	root.messages[modName]=require(package_path+"messages"+process.env.LANG+".json");
	root.packages[modName].main=require(root.packages[modName].manifest.main);
}
/* */
function isManifestValid(manifest){
	/*Validate manifest JSON*/
	if( typeof( manifest )=='object' )
		if( typeof( manifest.name )=='string' )
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
			throw new Error('Invalid manifest.name.  Expected string.');
	else
		throw new Error('Invalid manifest detected for package.  Expected object.');
}
/*
		Nemesis Application Core package Loader
		/srv/nemesis/core/core.packages.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the packages defined in 
		root.config.packages (defined by bootstrap.js).
 */
module.exports=loader;
/* */
function loader(manifestFile,launchMode){
	
	JSON.commented=require('./JSON-commented.js')();
	
	/*Load the JSON manifest file.*/
	var manifest=JSON.commented.load(manifestFile);
	
	/*Make sure the launchMode has an associated serverPackage.*/
	if(manifest.serverPackages.indexOf(launchMode)==-1){
		console.log("ERROR! Invalid launch mode: "+launchMode);
		throw new Error('Invalid Launch Mode');
	}}
	
	root.package={};
	
	if(typeof(manifest.package_dir)=='string'){
	
		var pkgDir=manifest.package_dir;
	
		if(require('fs').lstatFileSync(pkgDir).isDirectory()){
			
			/*Load the application framework (core) packages*/
			manifest.corePackages.forEach(function(index,array){load_package(pkgDir,pkgName);});
			
			/*Load the server package.*/
			load_package(pkgDir,launchMode);
			
			/*Load the appPackages*/
			manifest.appPackages.forEach(function(pkgName){load_package(pkgDir,pkgName);});
			
		}else{
			throw new Error('package_dir does not exist')
		}
	}
}

function load_package(packageDirectory,packageName){
	if(typeof(packageName)=='string'){
		console.log('loading package ['+packageName+']');

		if(packageDirectory[packageDirectory.length-1] != '/'){
			packageDirectory+='/';
		}
		var p=packageDirectory+packageName;
		
		console.log('     loading config');
		root.config[packageName]=JSON.commented.load(p+'/config.json');
		console.log('     loading errors strings file');
		root.errors[packageName]=JSON.commented.load(p+'/errors-'+process.env.LANG+'.json');
		console.log('     loading the messages strings file');
		root.errors[packageName]=JSON.commented.load(p+'/messages-'+process.env.LANG+'.json');
		console.log('     loading the package constructor');
		root.packages[packageName]=JSON.commented.load(p+'/main.js');
		console.log('Package has been loaded ['+packageName+']');
	}else{
		console.log('packageName type mismatch.  Expected string.');
	}
}
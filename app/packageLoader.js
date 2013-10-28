/*
		Nemesis Application Core package Loader
		/srv/nemesis/core/core.packages.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the packages defined in 
		root.config.packages (defined by bootstrap.js).
 */
module.exports=function(manifestFile,launchMode){
	var fs=require('fs');
	if(typeof(root.config.debug)!='boolean') throw new Error('root.config.debug must be boolean');
	if(root.config.debug) console.log('  packageLoader is starting....');
	
	/*Load the JSON manifest file.*/
	if(root.config.debug) console.log("  verifying manifest before loading:"+manifestFile);
	if(fs.lstatSync(manifestFile).isFile()){
		if(root.config.debug) console.log("    loading...");
		var manifest=JSON.commented.load(manifestFile);
		if(root.config.debug){
			console.log("    returning from manifest load.");
			console.log("    manifest:"+typeof(manifest));
			console.dir(manifest);
			console.log("  ---------------------------");
		}
	}else
		throw('    manifest file not found ['+manifestFile+'].');

	/*Make sure the launchMode has an associated serverPackage.*/
	if(manifest.serverPackages.indexOf(launchMode)==-1){
		console.log("ERROR! Invalid launch mode: "+launchMode);
		throw new Error('Invalid Launch Mode');
	}
	console.log('launch_mode is valid.');
	
	root.package={};
	
	if(typeof(manifest.package_dir)=='string'){
	
		if(root.config.debug)
			console.log('manifest.package_dir ['+manifest.package_dir+'] is a valid (string) data type.');
	
		var pkgDir=manifest.package_dir;
	
		if(fs.lstatSync(manifest.package_dir).isDirectory()){
			
			if(root.config.debug) console.log("     package_dir exists!");
					
			/*Load the application framework (core) packages*/
			manifest.corePackages.forEach(function(pkgName,index,array){load_package(manifest.package_dir,pkgName);});
			
			/*Load the server package.*/
			load_package(manifest.package_dir,launchMode);
			
			/*Load the appPackages*/
			manifest.appPackages.forEach(function(pkgName){load_package(manifest.package_dir,pkgName);});
			
		}else
			throw new Error('package_dir does not exist')
	}else
		throw new Error('package_dir is not expected data type (string)');
}

function load_package(packageDirectory,packageName){

	var fs=require('fs');

	if(root.config.debug) console.log("LOADING PACKAGE! ["+packageDirectory+", "+packageName+"]");
	if(typeof(packageName)=='string'){
		if(root.config.debug) console.log('LOADING PACKAGE ['+packageName+']');

		if(packageDirectory[packageDirectory.length-1] != '/'){
			if(root.config.debug) console.log('     Appending a trailing slash(/) character');
			packageDirectory+='/';
		}else{
			if(root.config.debug) console.log('     NOT Appending a trailing slash(/) character');
		}
		
		var p=packageDirectory+packageName;
		var pfile;/*reusable package filename*/
		
		if(root.config.debug) console.log('\nLOADING config ['+p+']');
		
		if(typeof(root.config)=='undefined') root.config={};
		if(typeof(root.errors)=='undefined') root.errors={};
		if(typeof(root.messages)=='undefined') root.messages={};
		if(typeof(root.packages)=='undefined') root.packages={};
		
		if(root.config.debug) console.log('----CONFIG----');		
		root.config[packageName]=loadJSONfile(p+'/config.json',p+'/config.pattern.json');
		
		if(root.config.debug) console.log('----ERRORS----');
		root.errors[packageName]=loadJSONfile(p+'/errors-'+process.env.LANG+'.json',p+'/errors.pattern.json');
		
		if(root.config.debug) console.log('----MESSAGES----');
		root.messages[packageName]=loadJSONfile(p+'/messages-'+process.env.LANG+'.json',p+'/messages.pattern.json');
		
		if(root.config.debug) console.log('----PKG_MAIN----');
		root.packages[packageName]=require("../"+p+'/main.js');
			
		if(root.config.debug){
			console.log("+++++++++++++++++++++++++++++++++++++++");
			console.log("content:\n"+root.packages[packageName].toString())
			console.log("+++++++++++++++++++++++++++++++++++++++\nExecuting this object");
		}
		
		root.packages[packageName]();	
		
		if(typeof(root.packages[packageName].init)=='function'){
			if(root.config.debug) console.log('***Package ['+packageName+'] has initializer.  Executing init()');
			root.packages[packageName].init();
		}else{
			if(root.config.debug) console.log('***Package ['+packageName+'] does NOT have an initializer.');
		}
		
		if(root.config.debug) console.log('----DONE----');
	
	}else{
		if(root.config.debug) console.log('packageName type mismatch.  Expected string.');
	}
	if(root.config.debug) console.log('load_package() is completed.');
}

function loadJSONfile(jfile,pfile){

	var file_content='';
	if(root.config.debug) console.log("package file ["+jfile+"] loading (load_file)....");
	if(require('fs').lstatSync(jfile).isFile()){
		file_content=JSON.config.loadValidJSON(jfile,pfile);
		if(root.config.debug) console.log('\nFILE LOADED:['+jfile+']');
	}else{
		throw new Error('load_file ['+jfile+'] failed.  missing file: '+jfile);
	}
	return file_content;	
	if(root.config.debug) console.log("package file load ["+jfile+"] finished (load_file).");
}
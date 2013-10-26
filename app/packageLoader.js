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
	
	var fs=require('fs');
	
	console.log('     loader is starting....');
	
	require('./JSON-commented.js')();
	
	/*Load the JSON manifest file.*/
	console.log("     verifying manifest before loading:"+manifestFile);
	if(fs.lstatSync(manifestFile).isFile()){
		console.log("          loading...");
		var manifest=JSON.commented.load(manifestFile);
		console.log("          returning from manifest load.");
		console.log(" manifest:"+typeof(manifest));
		console.dir(manifest);
		console.log(" ---------------------------");
	}else
		throw('manifest file not found ['+manifestFile+'].');

	/*Make sure the launchMode has an associated serverPackage.*/
	if(manifest.serverPackages.indexOf(launchMode)==-1){
		console.log("ERROR! Invalid launch mode: "+launchMode);
		throw new Error('Invalid Launch Mode');
	}
	console.log('launch_mode is valid.');
	
	root.package={};
	
	if(typeof(manifest.package_dir)=='string'){
	
		console.log('manifest.package_dir ['+manifest.package_dir+'] is a valid (string) data type.');
	
		var pkgDir=manifest.package_dir;
	
		if(fs.lstatSync(manifest.package_dir).isDirectory()){
			
			console.log("     package_dir exists!");
					
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

	console.log("LOADING PACKAGE! ["+packageDirectory+", "+packageName+"]");
	if(typeof(packageName)=='string'){
		console.log('LOADING PACKAGE ['+packageName+']');

		if(packageDirectory[packageDirectory.length-1] != '/'){
			console.log('     Appending a trailing slash(/) character');
			packageDirectory+='/';
		}else{
			console.log('     NOT Appending a trailing slash(/) character');
		}
		
		var p=packageDirectory+packageName;
		var pfile;/*reusable package filename*/
		
		console.log('\nLOADING config ['+p+']');
		
		if(typeof(root.config)=='undefined') root.config={};
		if(typeof(root.errors)=='undefined') root.errors={};
		if(typeof(root.messages)=='undefined') root.messages={};
		if(typeof(root.packages)=='undefined') root.packages={};
		console.log('----CONFIG----');		
		root.config[packageName]=load_file(p+'/config.json');
		console.log('----ERRORS----');
		root.errors[packageName]=load_file(p+'/errors-'+process.env.LANG+'.json');
		console.log('----MESSAGES----');
		root.messages[packageName]=load_file(p+'/messages-'+process.env.LANG+'.json');
		console.log('----PKG_MAIN----');
		root.packages[packageName]=JSON.active.load(p+'/main.js');
		if(typeof(root.packages[packageName].init)=='function'){
			console.log('***Package ['+packageName+'] has initializer.  Executing init()');
			root.packages[packageName].init();
		}else{
			console.log('***Package ['+packageName+'] does NOT have an initializer.');
		}
		console.log('----DONE----');
	}else{
		console.log('packageName type mismatch.  Expected string.');
	}
	console.log('load_package() is completed.');
}

function load_file(pfile){

	var file_content='';
	console.log("package file ['+pfile+'] loading (load_file)....");
	if(require('fs').lstatSync(pfile).isFile()){
		file_content=JSON.commented.load(pfile);
		console.log('\nFILE LOADED:['+pfile+']');
	}else{
		throw new Error('load_file ['+pfile+'] failed.  missing file: '+pfile);
	}
	return file_content;	
	console.log("package file load ["+pfile+"] finished (load_file).");
}
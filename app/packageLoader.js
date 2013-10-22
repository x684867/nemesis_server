/*
		Nemesis Application Core package Loader
		/srv/nemesis/core/core.packages.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the packages defined in 
		root.config.packages (defined by bootstrap.js).
 */
module.exports=init;
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

	root.packages.load=function(pkgName){
		var fs=require('fs');
		require('fs').readdirSync(root.config.app.packages).forEach(function(pkgName){
			if(typeof(root.packages[pkgName])=='undefined'){
				console.log('package [' + pkgName + '] loading...');
				/*
					Load the manifest and determine if there are dependencies.
				*/
				var package_path=root.config.app.packages+pkgName + "/";
				if(fs.statSync(package_path).isDirectory()){
					console.log('   package_path is a valid directory');
					root.packages.loadManifest(pkgName);
					root.packages[pkgName].manifest.dependencies.forEach(function(pkgName){
						console.log('     dependency found: '+pkgName);
						root.packages.load(pkgName);
					});
					console.log('     -----Dependencies loaded-----');
					root.packages.loadConfig(pkgName);
					root.packages.loadErrors(pkgName);
					root.messages.loadMessages(pkgName);
					root.messages.LoadMain(pkgName);
					console.log('     Package Loaded.');
				}else{
					console.log("skipping non-directory: "+package_path);
				}
			}else{
				console.log("package ["+pkgName+"] already loaded.  Skipping...");
			}
		});
	}
	root.packages.loadManifest=function(pkgName){
		root.packages[pkgName]={};
		root.packages[pkgName].manifest=require(root.config.app.packages+pkgName + "/manifest.json");
	}
	root.packages.loadConfig=function(pkgName){
	root.config[pkgName]={};
	root.config[pkgName].config=require(root.config.app.packages+pkgName + "/config.json");
	}
	root.packages.loadErrors=function(pkgName){
		root.error[pkgName]={};
		root.error[pkgName]=require(root.config.app.packages+pkgName + "/errors-"+process.env.LANG+".json");
	}
	root.messages.loadMessages=function(pkgName){
		root.messages[pkgName]={};
		root.messages[pkgName]=require(root.config.app.packages+pkgName + "/messages-"+process.env.LANG+".json");
	}
	root.messages.LoadMain=function(pkgName){
		root.packages[pkgName]={};
		root.packages[pkgName].main=require(root.config.app.packages+pkgName + "/main.js");
	}
}

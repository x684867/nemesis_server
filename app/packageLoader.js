/*
		Nemesis Application Core package Loader
		/srv/nemesis/core/core.packages.js
		(c) Sam Caldwell.  All Rights Reserved.
		
		This file exports an object used to load the packages defined in 
		root.config.packages (defined by bootstrap.js).
 */
module.exports=function( mFile , mode ){
	var pFile=mFile.replace( /json/ , 'pattern.json' );
	
	var fs=require('fs');
	
	root.package={};
	
	if(typeof(root.config.debug)!='boolean') throw new Error('root.config.debug must be boolean');
	if(root.config.debug) console.log('PackageLoader is starting....');
	
	/*Load the JSON manifest file.*/
	if(root.config.debug) console.log("\tVerifying manifest before loading:" +mFile );
	if(!fs.lstatSync(mFile).isFile()) throw('\t\tmanifest file not found [' + mFile + '].' );
	if(!fs.lstatSync(pFile).isFile()) throw('\t\tmanifest pattern file not found [' + mFile + '].' );
	
	var manifest=JSON.config.loadValidJSON( mFile , pFile );
	
	if(root.config.debug) console.log(
			"\t\tloading...\n"+Array(process.stdout.columns).join('-')+'\n'+
			"\t\tmanifest:("+typeof(manifest)+")\n\t\t\t{"+Object.keys(manifest).join(',')+"}\n"+
			Array(process.stdout.columns).join('=')+'\n'
	);
	
	/*Make sure the mode has an associated serverPackage.*/
	if(manifest.serverPackages.indexOf(mode)==-1) throw new Error("ERROR! Bad launch: "+mode);
	
	if(typeof(manifest.package_dir)!='string') throw new Error('package_dir not a string');

	if(root.config.debug) console.log('manifest.package_dir['+manifest.package_dir+']:valid string');

	var pDir=manifest.package_dir;

	if(!fs.lstatSync(manifest.package_dir).isDirectory()) throw new Error("pDir doesn't exist!");
					
	/*Load the application framework (core) packages*/
	manifest.corePackages.forEach(function(pkgName){load(manifest.package_dir,pkgName);});
			
	/*Load the server package.*/
	load(manifest.package_dir,mode);
			
	/*Load the appPackages*/
	manifest.appPackages.forEach(function(pkgName){load(manifest.package_dir,pkgName);});
}

function load(pkgDir,pName){

	var fs=require('fs');
	if(typeof(pName)=='string'){
		if(root.config.debug) console.log("LOADING PACKAGE! ["+pkgDir+","+pName+"]");
		if(pkgDir[pkgDir.length-1] != '/') pkgDir+='/';
				
		var p=pkgDir+pName;
		var pfile;

		if(typeof(root.config)=='undefined') root.config={};
		if(typeof(root.errors)=='undefined') root.errors={};
		if(typeof(root.messages)=='undefined') root.messages={};
		if(typeof(root.packages)=='undefined') root.packages={};

		if(root.config.debug) console.log('\t-CONFIG');
		root.config[pName]=JSON.config.loadValidJSON(p+'/config.json',p+'/config.pattern.json');
		if(typeof(root.config[pName])=='undefined') throw new Error("root.config["+pName+"] failed");

		if(root.config.debug){
			console.log('\t\t-SUCCESS!');
			console.log('\t-ERRORS');
		}
		
		root.errors[pName]=JSON.config.loadValidJSON(p+'/errors-'+process.env.LANG+'.json',p+'/errors.pattern.json');
		if(typeof(root.errors[pName])=='undefined') throw new Error('root.errors['+pName+'] failed');
	
		if(root.config.debug){
			console.log('\t\t-SUCCESS!');
			console.log('\t-MESSAGES');
		}

		root.messages[pName]=JSON.config.loadValidJSON(p+'/messages-'+process.env.LANG+'.json',p+'/messages.pattern.json');
		if(typeof(root.messages[pName])=='undefined') throw new Error('root.messages['+pName+'] failed');

		if(root.config.debug){
			console.log('\t\t-SUCCESS!');
			console.log('\t-PKG_MAIN');
		}

		root.packages[pName]=require("../"+p+'/main.js');
		if(typeof(root.packages[pName])=='undefined') throw new Error('root.packages['+pName+'] failed to load.');

		if(root.config.debug) console.log('\t\t-SUCCESS!\n');

		root.packages[pName]();	

	}else if(root.config.debug) console.log('pName type mismatch.  Expected string.');

	if(root.config.debug) console.log('\nload completed.\n'+Array(process.stdout.columns).join('_'));
}
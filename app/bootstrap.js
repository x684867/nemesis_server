/*
	/srv/nemesis/app/bootstrap.js
	Nemesis Web Services Master Process Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.

	This is the master process (app.bootstrap.js) for the Nemesis web services.
	
	USE:
		root.app
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Logger	
	---------------------------------------------------------------------------------
*/
root.app={};
root.app.title="Nemesis"
root.app.version="2013.10.17.12.52"; /*Update when pushing to master branch.*/
const app_conf='./app/app.conf.json';
/*
	Validate the command-line inputs.
*/
var launch_mode=process.argv[2]
if(typeof(launch_mode)!='string') throw new Error('Invalid launch_mode passed to boostrap.js');

console.log( Array(process.stdout.rows).join('\n')+Array(process.stdout.columns).join('=')+
             '\nStarting ['+app.title+':v'+app.version+'] as '+launch_mode+' at '+
             (new Date).toString()+'...\n\n'
);

require('./JSON-active.js')();
/* 
	Load application configuration data
*/
if(require('fs').lstatSync(app_conf).isFile()){
	console.log('LOADING app_conf');
	root.config=JSON.commented.load(app_conf);
	if(typeof(root.config.debug)!='boolean') throw new Error('root.config.debug must be boolean');

	if(root.config.debug){
		console.log('\n-----------------Application Config-----------------');
		console.dir(root.config);
		console.log('----------------------------------------------------\n');
	}
}else{
	throw new Error('app_conf file not found.  Check '+app_conf);
}
/* 
	Load all packages in the manifest.
*/
root.packages={};
root.packages.loader=require(root.config.packageLoader)(root.config.packageManifest,launch_mode);
/*
	Define the application
*/
root.app.main=root.packages.main.init();
root.app.start=root.packages.start.init();
root.app.monitor={};
root.app.monitor.watchdog=root.packages.watchdog.init();
root.app.monitor.stats=root.packages.stats.init();
/*Initialize then launch the application with the specified service (using arg[2])*/
root.app.main(launch_mode);
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
const app_conf_pattern='./app/app.conf.pattern.json';
require('./JSON-commented.js')();
require('./JSON-active.js')();
require('./JSON-config.js')();
/*
	Validate the command-line inputs.
*/
var server_type=process.argv[2];
if(typeof(server_type)!='string') throw new Error('Invalid server_type passed to boostrap.js');

var launch_mode=process.argv[3];
if( (typeof(launch_mode)!='string') && (['master','worker'].indexof(launch_mode)==-1))
	throw new Error('Invalid launch_mode passed to bootstrap.js')

console.log( Array(process.stdout.rows).join('\n')+Array(process.stdout.columns).join('=')+
             '\nStart ['+app.title+':v'+app.version+'] '+
             server_type+':'+launch_mode+'('+process.pid+') '+ (new Date).toString()+'\n\n'
);
/* 
	Load application configuration data
*/
if(require('fs').lstatSync(app_conf).isFile()){
	console.log('LOAD app_conf');
	root.config=JSON.config.loadValidJSON(app_conf,app_conf_pattern);
	root.config.server_type=server_type
	if(typeof(config.debug)!='boolean') throw new Error('root.config.debug must be boolean');

	if(config.debug){
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
root.packages.loader=require(config.packageLoader)(config.packageManifest,server_type);
/*
	Define the application
*/
if(config.debug) console.log("Define the application core (root.app)");
root.app.main=root.packages.main.init();
root.app.start=root.packages.start.init();
root.app.monitor={};
root.app.monitor.watchdog=root.packages.watchdog.init();
root.app.monitor.stats=root.packages.stats.init();
/*Initialize then launch the application with the specified service (using arg[2])*/
root.app.main(server_type,launch_mode);
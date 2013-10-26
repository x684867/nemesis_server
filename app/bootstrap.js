/*
	/srv/nemesis/app/app.bootstrap.js
	Nemesis Web Services Master Process Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	root.app
	
	This is the master process (app.bootstrap.js) for the Nemesis web services.
	
	Each of the four (4) web services (audit,broker,cipher,keys) are launched
	using this app.js script, passing in a path and filename to the specific 
	web service's configuration file.  These config files contain a general 
	description of the environment to be established for the web service(s) 
	and the configuration data for each service's workers.

	This process is the command and control for all processes spawned
	as workers for the given web service.  The mission of this app.js
	script is to launch the required threads and then to monitor them
	in real time and respawn any worker process which may die or become
	unresponsive.
	
	---------------------------------------------------------------------------------
*/
root.app={};
root.app.title="Nemesis"
root.app.version="2013.10.17.12.52"; /*Update when pushing to master branch.*/

var launch_mode=process.argv[2]
if(typeof(launch_mode)!='string') throw new Error('Invalid launch_mode passed to boostrap.js');

console.log('Starting ['+app.title+':v'+app.version+'] as '+launch_mode+'...\n\n');

require('./JSON-active.js')();

/* Load application configuration data*/
const app_conf='./app/app.conf.json';
if(require('fs').lstatSync(app_conf).isFile()){
	console.log('loading app_conf');
	root.config=JSON.commented.load(app_conf);
	console.log('---k-Config----');
	console.dir(root.config);
	console.log('--------------');
}else{
	throw new Error('app_conf file not found.  Check '+app_conf);
}
/* Load all packages in the manifest.*/
console.log('loader:  '+typeof(root.config.packageLoader));
console.log('manifest:'+typeof(root.config.packageManifest));
console.log('CALLING LOADER...');
root.packages.loader=require(root.config.packageLoader)(root.config.packageManifest,launch_mode);
console.log('...RETURNED FROM LOADER.');
/*
	Define the application
*/
root.app.log=root.packages.logger.init(package.filename,process.pid,{"console":true,"syslog":true});
root.app.main=root.packages.main.init();
root.app.start=root.packages.start.init();
root.app.monitor={};
root.app.monitor.watchdog=root.packages.watchdog.init();
root.app.monitor.stats=root.packages.stats.init();
/*Initialize then launch the application with the specified service (using arg[2])*/
root.app.main(launch_mode);
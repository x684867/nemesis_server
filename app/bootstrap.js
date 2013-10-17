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
root.title="Nemesis"
root.version="2013.10.17.12.52"; /*Update when pushing to master branch.*/
root.conf_dir='/srv/nemesis/app/config';
/*
	Load the main configuration file.
*/
console.log("Loading the main configuration file.");
root.config=require(root.conf_dir+'/app.conf.json');
console.log("Loading the localized messages.");
root.messages=require(root.conf_dir+'/messages/messages-'+root.config.language+'.json');
/*
	Load the Modules defined in root.config.modules
*/
console.log("Loading the modules.");
require(root.config.core.modules).load_modules();
/*
	Define the application
*/
root.app={
	log:new root.modules.logger(module.filename,process.pid),
	main:require(root.config.modules.core.main),
	
	startService:require(root.config.modules.core.start),
	monitor:{
		heartbeat:require(root.config.modules.lib.monitor.heartbeat),
		statistics:require(root.config.modules.lib.monitor.statistics),
	}
}
/*
	Launch the application
*/
root.app.main(process.argv[2]);
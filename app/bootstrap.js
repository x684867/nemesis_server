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
root.conf_dir='/srv/nemesis/app/';

/* Initialize the framework object tree*/
root.app={};root.config={};root.error={};root.messages={};root.modules={};root.ipc={};

/* Load application configuration data*/
root.config.app=require(root.conf_dir+'/app.conf.json');

root.modules.init=require(root.config.app.moduleLoader)();

console.log('bootstrap loading types: ');root.modules.preload("types");
console.log('bootstrap loading error: ');root.modules.preload("error");
console.log('bootstrap loading logger: ');root.modules.preload("logger");
console.log('bootstrap loading ipc: ');root.modules.preload("ipc");
console.log('bootstrap loading all modules: ');root.modules.loadall();
/*
	Define the application
*/
root.app.log=root.modules.logger.init(module.filename,process.pid,{"console":true,"syslog":true}),
root.app.main=root.modules.main.init();
root.app.start=root.modules.start.init();
root.app.monitor={};
root.app.monitor.watchdog=root.modules.watchdog.init();
root.app.monitor.stats=root.modules.stats.init();
/*Initialize then launch the application with the specified service (using arg[2])*/
root.app.main(process.argv[2]);
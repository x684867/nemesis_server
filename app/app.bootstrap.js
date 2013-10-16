/*
	/srv/nemesis/app/app.js
	Nemesis Web Services Master Process Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the master process (app.js) for the Nemesis web services.
	Each of the four (4) web services (audit,broker,cipher,keys) are 
	launched using this app.js script, passing in a path and filename
	to the specific web service's configuration file.  These config 
	files contain a general description of the environment to be 
	established for the web service(s) and the configuration data for
	each service's workers.

	This process is the command and control for all processes spawned
	as workers for the given web service.  The mission of this app.js
	script is to launch the required threads and then to monitor them
	in real time and respawn any worker process which may die or become
	unresponsive.
	
	---------------------------------------------------------------------------------
*/
/*
	init.js defines the root tree with configuration data.
*/
require('/srv/nemesis/app/app.init.js');
/*
	Once the init.js script configures the system, this script
	defines the application as part of the root object. 
*/	
root.app={
	process:require(root.config.modules.app.process),
	log:new logger(module.filename,process.pid),
	main:require(root.config.modules.app.main),
	startService:require(root.config.modules.app.start),
	monitor:{
		heartbeat:require(root.config.modules.lib.monitor.heartbeat),
		statistics:require(root.config.modules.lib.monitor.statistics),
	}	
}
/*  -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- -+- */
root.app.main();
/*
	/srv/nemesis/app/app.js
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
*/
const NODE_JS_BINARY='/usr/bin/nodejs';
const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/worker.js';

console.log("app.js starting as master process.");

var config=Object();		/*This is the worker configuration.*/


var file = process.argv[2];

console.log("    ...loading config file: "+file);
var fs = require('fs');
fs.readFile(file, 'utf8', function (err, data) {
 	if (err) {
  		console.log('Error: ' + err);
  		return;
  	}else{
  		config=JSON.parse(data);
  		console.log("    ...configuration loaded.");
  		workerPath=__dirname+"/"+config.serverType+".js"
  		console.log("    ...workerName: "+workerPath)
  		
		config.workers.forEach(function(data,index,array){
		
			console.log("        ...instantiating worker ["+index+"]");
			console.log("           config = "+JSON.stringify(data));
			console.log(" ");
			
			/*instantiate the new worker object with its parameters.*/
			workerClass=require(workerPath);
			worker=new workerClass(index,data);
			
			switch(worker.status){
				case 0: console.log("           created successfully."); break;
				case 1: console.log("           error(1)(recoverable)"); break;
				case 2: console.log("           error(2)(recoverable)"); break;
				case 3: console.log("           error(3)(recoverable)"); break;
				case 10: throw new Error("           error(10)(fatal)"); break;
				default:
						throw new Error("           failed to create and returned an\n"
									   +"           unknown or unhandled error.\n");
						break;
			
			}
			
			/*Now we need to fork a process for this worker.*/
			var process=require('child_process');
			child=process.spawn(NODE_JS_BINARY,[CHILD_PROCESS_WRAPPER]);
			
			
			
			
  		});
 		console.log("    ...All workers have been spawned.");
	}
});

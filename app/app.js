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
*/

const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/worker.js';
var worker=Array();		/*This array tracks the worker processes.*/
var config=Object();	/*This is the worker configuration.*/
var file = process.argv[2];
var fs = require('fs');
var log= require('nemesis-logger.js');
console.log("app.js starting as master process.");


if(!fs.lstatSync(file).isFile()) throw new Error(file+" does not exist");
console.log("    ...verified!  "+file+" exists.");

console.log("    ...loading config file: "+file);
fs.readFile(file, 'utf8', function (err, data) {
 	if (err) {
  		console.log('Error: ' + err);
  		throw new Exception("Error encountered reading file ("+file+").  Error:"+err);
  	}else{
  		config=JSON.parse(data);
  		console.log("    ...configuration loaded.");
  		workerPath=__dirname+"/"+config.serverType+".js"
  		console.log("    ...workerName: "+workerPath);
  		
		config.workers.forEach(function(data,index,array){
		
			console.log("        ...instantiating worker ["+index+"]");
			console.log("           config = "+JSON.stringify(data));
			console.log(" ");
			
			/*instantiate the new worker object with its parameters.*/
			serverFactory=require(workerPath);
			server=new serverFactory(index,data);
			
			/*Now we need to fork a process for this worker.*/
			console.log("        ...forking child process with wrapper.js.");
			var process=require('child_process');
			worker[index]=process.fork(CHILD_PROCESS_WRAPPER);
			console.log("           done.  pid="+worker[index].pid)

			console.log("        ...setup message handler.");
			ipcFactory=require('ipc');
			ipc=new ipcFactory();
			worker[index].on('message',ipc.handle_message(msg));
			worker[index].on('error',ipc.handle_errors(msg));
			
			console.log("        ...sending code:0 object as message to child.");
			worker[index].send({code:0});
			console.log("           done sending message.");
		});
 		console.log("    ...All workers have been spawned.");
	}
});


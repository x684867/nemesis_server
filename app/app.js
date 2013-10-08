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
var fs =require('fs');
var log=require('nemesis-logger.js');
log.drawBanner("app.js starting as master process.",0);

if(!fs.lstatSync(file).isFile()) throw new Error(file+" does not exist");
log.write("...verified!  "+file+" exists.",4);

log.write("...loading config file: "+file,4);
fs.readFile(file, 'utf8', function (err, data) {
 	if (err) {
  		throw new Exception("Error encountered reading file ("+file+").  Error:"+err);
  	}else{
  		config=JSON.parse(data);  
  		log.write("...configuration loaded.",4);
  		workerPath=__dirname+"/"+config.serverType+".js"
  		log.write("...workerName: "+workerPath,4);
  		
		config.workers.forEach(
			function(data,index,array){
		
			log.write("...instantiating worker ["+index+"]",8);
			log.write("config = "+JSON.stringify(data),11);
			log.drawline(60,8);
			
			/*instantiate the new worker object with its parameters.*/
			serverFactory=require(workerPath);
			server=new serverFactory(index,data);
			
			/*Now we need to fork a process for this worker.*/
			log.write("...forking child process with wrapper.js.",8);
			var process=require('child_process');
			worker[index]=process.fork(CHILD_PROCESS_WRAPPER);
			log.write("pid="+worker[index].pid,12);
			log.write("Process has been forked.",8);
			
			log.write("...Setup IPC Message Handling for Parent Process.",8);
			ipcFactory=require('ipc');
			ipc=new ipcFactory();
			worker[index].on('message',ipc.parent(msg));
			worker[index].on('error',ipc.phandle_errors(msg));
			
			console.log("        ...sending code:0 object as message to child.");
			worker[index].send({code:0});
			console.log("           done sending message.");
		});
 		console.log("    ...All workers have been spawned.");
	}
});


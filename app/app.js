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
	log.source="app.js";
	
log.drawBanner("app.js starting as master process.",0);

if(!fs.lstatSync(file).isFile()) throw new Error(file+" does not exist");
log.write("Verified! ["+file+" exists]",4);

log.write("Loading config file: "+file,4);
fs.readFile(file, 'utf8', function (err, data) {
 	if (err) {
  		throw new Exception("Error encountered reading file ("+file+").  Error:"+err);
  	}else{
  		config=JSON.parse(data);  
  		log.write("Configuration loaded.",4);
  		workerPath=__dirname+"/servers/"+config.serverType+".js"

		config.workers.forEach(
			function(data,index,array){
		
			log.write("Instantiating worker ["+index+"]",8);
			log.write("config = "+JSON.stringify(data),11);
  			log.write("workerName: "+workerPath,11);
			log.drawline(60,8);
			
			serverFactory=require(workerPath);
			server=new serverFactory(index,data);
			
			log.write("Forking child process with wrapper.js.",8);
			var process=require('child_process');
			worker[index]=process.fork(CHILD_PROCESS_WRAPPER);
			log.write("pid="+worker[index].pid,12);
			log.write("Process has been forked.",8);
			
			log.write("Setup IPC Message Handling for Parent Process.",8);
			ipcFactory=require('ipc');
			worker[index].on('message',function(msg){
				if(typeof(msg)=='object'){
					switch(msg.code){
						case 1:
							log.write("Child process {code:1} rec'd by parent.");
							worker[index].send({code:2,data:server});
							log.write("{code:2} sent to child.");
						case 3:
							log.write("Child process {code:3} rec'd by parent.");
							
							log.write("Process Monitoring not implemented.");
							/* 
							monitorFactory=require(__dirname+"/monitor/monitor.js");
							monitor[index]=new monitorFactory(index,worker[index].pid());
							monitor[index].interval=10; //Seconds
							monitor[index].start();
							*/
						case 11:
						case 13:
						case 97:
						case 99:
						default:
							throw new Error("Unknown/Invalid msg.code: ["+msg.code+"]");
							break;
					}
				}else{
					throw new Error('Non-object passed as message from child process.');
				}
			
			});
			worker[index].on('error',function(msg){
				if(typeof(msg)=='object'){
				}else{
					throw new Error('Non-object error message passed from child process');
				}
			});
			
			log.write("Sending code:0 object as message to child.",8);
			worker[index].send({code:0});
			log.write("Done sending message to worker["+index+"]",8);
		});
 		log.write("All workers have been spawned.",4);
	}
});


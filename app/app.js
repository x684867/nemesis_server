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
var logger=require('/srv/nemesis/app/logger/logger.js');

(function(){
	log=new logger("app.js(main)");
	
	log.drawBanner("app.js starting as master process.",0);
	
	if(!fs.lstatSync(file).isFile()) throw new Error(file+" does not exist");
	log.write("Config exists:["+file+"]");
	log.write("Loading config file");
	fs.readFile(file, 'utf8', function (err, data) {
	 	if (err) {
	  		throw new Exception("Error encountered reading file ("+file+").  Error:"+err);
	  	}else{
	  		config=JSON.parse(data);  
  			log.write("Configuration loaded.");
  			workerPath=__dirname+"/servers/"+config.serverType+".js"

			config.workers.forEach(
				function(data,index,array){
			
				log.write("Instantiating worker ["+index+"]");
				log.write("config = "+JSON.stringify(data));
	  			log.write("workerName: "+workerPath);
				log.drawLine(60);
				
				serverFactory=require(workerPath);
				server=new serverFactory(index,data);
				
				log.write("Forking child process with wrapper.js.");
				var process=require('child_process');
				worker[index]=process.fork(CHILD_PROCESS_WRAPPER);
				log.write("Process forked [pid="+worker[index].pid+"]");
				log.drawLine();
			
				log.write("Setup IPC Message Handling for Parent Process.",8);
				worker[index].on('message',function(msg){
					if(typeof(msg)=='object'){
						switch(msg.code){
							case 1:
								log.write("Child process {code:1} rec'd by parent.");
								worker[index].send({code:2,data:server});
								log.write("{code:2} sent to child.");
							case 3:
								log.write("Child process {code:3} rec'd by parent.");
								break;
							case 11:
								log.write("{code:11} ping response from worker #"+index);
								delay=(new Date()).getTime()/1000 - msg.data;
								if(delay <= config.heartbeat.maxDelay){
									log.write("{code:11} heartbeat from worker #"+index+": good");
								}else{
									log.write("{code:11} heartbeat from worker #"+index+": slow");
								}
								break;
							case 13:log.write("{code:13} not implemented");break;
							case 97:log.write("{code:97} not implemented");break;
							case 99:log.write("{code:99} not implemented");break;
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
						throw new Error("worker[index].on('error',function(){...}); not implemented.");
						/*
							Todo:Implement error handling.
						 */
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
})
	
/* Heartbeat monitor.  This sends the heartbeat "pings" to the worker processes. */
(function(){
	var log=require('/srv/nemesis/app/logger/logger.js');
		log.source="app.js(heartbeat)";


	setTimeout(
		function(){
			log.write("Heartbeat monitor starting...");
			worker.forEach(function(p,i,a){
				log.write("ping worker #"+i,4);
				/*Note that a heartbeat includes the seconds since the epoch when it was sent*/
				p.send({code:10,data:(new Date()).getTime()/1000});
			});
			log.write("Heartbeat monitor stopping...");
		},
		config.heartbeat.interval
	);
});
/* Statistics monitor*/
(function(){
	var log=require('/srv/nemesis/app/logger/logger.js');
		log.source="app.js(stats)";

})
/*
	Not implemented!
*/
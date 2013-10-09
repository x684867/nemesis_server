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
var monitor=Array();
var config=Object();	/*This is the worker configuration.*/

var file = process.argv[2];

var logger=require('/srv/nemesis/app/logger/logger.js');

(function(){
	log=new logger("app.js(main)");
	log.drawBanner("app.js starting as master process.",0);
	
	var config_file =require('fs');
	if(!config_file.lstatSync(file).isFile()) throw new Error(file+" does not exist");
	
	log.write("Loading config file");
	config_file.readFile(file, 'utf8', function (err, jsonConfigData) {
	 	if (err) {
	  		throw new Exception("Error reading config file.  Error:"+err);
	  	}else{
	  		
	  		config=JSON.parse(jsonConfigData);
	  		
			config.workers.forEach(
				function(workerConfig,id,array){
					/* workerConfig is a json object describing
					   a single worker's configuration.  It is
					   an element of the container (workers) array
					   of the larger config object.
					 */
					log.drawLine(60);
					log.write("Fork new child process:");
					log.write("   worker["+id+"]={\n"
							 +"      'type':"+config.serverType+",\n"
							 +"      'config':"+JSON.stringify(workerConfig))+"   \n}"
					);
					log.drawLine(60);
				
					var process=require('child_process');
					worker[id]=process.fork(CHILD_PROCESS_WRAPPER);
					worker[id].send({code:0});/*sending 1st "are you alive?" message*/
					log.write("Worker ["+id+"] forked as pid["+worker[id].pid+"]");
					log.drawLine();
					worker[id].on('message',function(msg){
						if(!isMsgFormatValid(msg)) throw("Rec'd invalid msg object.");
						switch(msg.code){
							case 1:
								log.write("msg {code:1} rec'd by parent.");
								msgCode2={"code":2,
										  "data":{"id":id,
												  "type":config.serverType,
												  "config":workerConfig}
								}
								log.write("Parent: send("+JSON.stringify(msgCode2)+")");
								worker[id].send(msgCode2);
								log.write("Parent: {code:2} sent to worker#"+id);
								break;
							case 3:
								log.write("Child process {code:3} rec'd by parent.");
								/*This should be recorded to stats*/
								break;
							case 11:
								log.write("{code:11} ping response from worker #"+id);
								delay=(new Date()).getTime()/1000 - msg.data;
								if(delay <= config.heartbeat.maxDelay){
									log.write("{code:11} heartbeat from worker #"+id+": good");
								}else{
									log.write("{code:11} heartbeat from worker #"+id+": slow");
								}
								break;
							case 13:log.write("{code:13} not implemented");break;
							case 97:log.write("{code:97} not implemented");break;
							case 99:log.write("{code:99} not implemented");break;
							default:
								throw new Error("Unknown/Invalid msg.code: ["+msg.code+"]");
								break;
						}
					});/*end of msg handler*/
					worker[id].on('error',function(msg){
						if(!isErrFormatValid(msg)){
							throw new Error("Rec'd invalid msg object on error event.");
						}
						throw new Error("worker[index].on('error'...) not implemented.");
					});
					monitorFactory=require('./monitor/monitorFactory.js');
					monitor[id]=new monitorFactory(worker[id]);
				});
		 		log.write("All workers have been spawned.",);
			}
		}
	);
})

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

var isMsgFormatValid=require('./library/msgValidator.js').isMsgFormatValid;
var isErrFormatValid=require('./library/msgValidator.js').isErrFormatValid;
var isConfigValid=require('./library/cfgValidator.js');
var child=require('child_process');
var logger=require('/srv/nemesis/app/logger/logger.js');


var worker=Array();		/*This array tracks the worker processes.*/
var monitor=Array();
var config=Object();	/*This is the worker configuration.*/

var cfg_fname = process.argv[2];


(function(){
	log=new logger("app.js(main)");
	log.drawBanner("app.js starting as master process.",0);

	log.write("Loading config file");	
	var config_file =require('fs');
	if(!config_file.lstatSync(cfg_fname).isFile()){throw new Error(cfg_fname+" does not exist");}
	config_file.readFile(cfg_fname, 'utf8', function (err, jsonConfigData) {
	 	if (err) throw new Exception("Error reading config file.  Error:"+err);
  		
  		log.write("parsing and validating the configuration file");
  		config=(require('./library/cfgValidator.js'))(JSON.parse(jsonConfigData));
	});
	log.write("configuration file has been loaded and validated.");
	log.drawLine();
	
	log.write("Iterate through worker list and fork worker processes.");
	
	config.workers.forEach(
		function(workerConfig,id,array){
			log.drawLine(60);
			worker[id]=child.fork(CHILD_PROCESS_WRAPPER);
			worker[id].send({code:0});
			log.write(
					  "worker["+id+"]={\n"
					 +" 'type':"+config.serverType+",\n"
					 +" 'config':"+JSON.stringify(workerConfig)+",\n"
					 +" 'pid':"+worker[id].pid+",\n"
					 +"\n}"
			);
			log.drawLine();
			worker[id].on('message',function(msg){
				if(!isMsgFormatValid(msg)) throw("Parent: Rec'd invalid msg object.");
				switch(msg.code){
					case 1:
						log.write("P:{code:1} from C#"+id);
						msgCode2={"code":2,
								  "data":{"id":id,
										  "type":config.serverType,
										  "config":workerConfig}
						}
						worker[id].send(msgCode2);
						log.write("P:{code:2,data:"+JSON.stringify(msgCode2)+"}to C#"+id);
						break;
					case 3:
						log.write("P:{code:3}from C#"+id);
						/*This should be recorded to stats*/
						break;
					case 11:
						delay=(new Date()).getTime()/1000 - msg.data;
						if(delay < config.monitor.heartbeat.threshold){
							log.write("P:{code:11} heartbeat worker#"+id+":good");
							/*Record to stats*/
						}else{
							log.write("P:{code:11} heartbeat worker#"+id+":slow");
							/*Record to stats*/
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
		}
	);
	log.write("All workers have been spawned.");
})

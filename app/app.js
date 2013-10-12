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
	
	Version: 2013.10.10 Caldwell, Sam (mail@samcaldwell.net).  Prototype platform.
		FEATURES:
			*Rapid deployment from bare metal to functioning system in 30 minutes or less.
			*Scalable server cluster configuration with load balancing.
			*Maintainable framework for basic/new features.
			
		TODO:
			*Test ability to scale prototype broker server.
			*Replicate current successes to all server types.
			*Redeploy system to fresh Linux environment using 4-host design.
			*Begin service development.
	---------------------------------------------------------------------------------
*/
console.log("Starting Nemesis ["+(new Date).toISOString()+"]...");
const LOGGER_SOURCE='app.main';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);

const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/library/worker.js';
const PID_WRITER_SCRIPT='/srv/nemesis/app/library/pidWriter.js';
const VALIDATOR_CLASS='./library/msgValidator.js';
const CONFIG_CLASS='./library/config.js';

var config_filename = process.argv[2];/*Capture command-line arguments*/

var validatorClass=require(VALIDATOR_CLASS);
var validator=new validatorClass();
var configFactory=require(CONFIG_CLASS);

var worker=Array();		/*This array tracks the worker processes.*/
var monitor=Array();

/*Start the logger and show a banner*/

var log=new global.logger(LOGGER_SOURCE);	
log.drawBanner("app.js   PID:["+process.pid+"]");

/*Setup Process management*/
/*log.write("Setup Process Management");
process.on('SIGHUP',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGHUP]");});
process.on('SIGKILL',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGKILL]");});
process.on('SIGINT',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGINT]");});
process.on('SIGTERM',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGTERM]");});
log.write("Process Management Setup Complete");
*/

var config=new configFactory(config_filename);

pidFile=new (require(PID_WRITER_SCRIPT))(config.data.pidDirectory);

log.write("config.data.workers.forEach() starting...");
config.data.workers.forEach(
	function(workerConfig,id,array){
		if(workerConfig.enabled){
			log.source="app.loop";
			child=require('child_process').fork(CHILD_PROCESS_WRAPPER);
			child.title=config.data.serverType+id
			child.send({code:0});
			pidFile.createNew(child.pid);
			log.write("w["+id+"]={'type':"+config.data.serverType+",'pid':"+child.pid+"}");
			child.on('message',function(msg){
				if(!validator.isValidMsg(msg)) throw("Parent: Rec'd invalid msg object.");
				switch(msg.code){
					case 1:
						log.write("P:{code:1} from C#"+id);
						msgCode2={"code":2,
								  "data":{"id":id,
										  "type":config.data.serverType,
										  "config":workerConfig,
										  "ssl":{
										  		"key":config.data.ssl.private_key,
										  		"cert":config.data.ssl.public_key,
										  		"ca_cert":config.data.ssl.ca_cert
										  }
								  }
						}
						child.send(msgCode2);
						log.write("P:"+JSON.stringify(msgCode2)+"to C#"+id);
						break;
					case 3:log.write("P:{code:3}from C#"+id);break;
					case 11:
						delay=(new Date()).getTime()/1000 - msg.data;
						if(delay < config.data.monitor.heartbeat.threshold){
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
			});
			child.on('error',function(msg){
				if(!validator.isValidError(msg)){
					throw new Error("Rec'd invalid msg object on error event.");
				}
				throw new Error("worker[index].on('error'...) not implemented.");
			monitorFactory=require('./monitor/monitorFactory.js');
			monitor.push(new monitorFactory(child,config));
		});
	}else{
		log.write("id#"+id+" worker#"+workerConfig.workerId+" disabled (config).");
	}
});
console.log("All workers have been spawned.  Terminating app.js");
//process.exit(0);
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
const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/worker.js';
/*
	Capture command-line arguments
*/
var config_filename = process.argv[2];
/*
	Load dependencies
*/
var logger=require('/srv/nemesis/app/logger/logger.js');
var validatorClass=require('./library/msgValidator.js');
var validator=new validatorClass();
var configFactory=require('./library/config.js');
/*
	Declare globals
*/
var worker=Array();		/*This array tracks the worker processes.*/
var monitor=Array();
/*
	Start the logger and show a banner
*/
log=new logger("app.js(main)");
log.drawBanner("app.js starting as master process pid:["+process.pid+"]");
/*
	Setup Process management
*/
function app_cleanup(signal,p){
	console.log("Received "+signal+" on process "+process.pid);
	/*Perform cleanup operations.*/
}

process.title="nemesisMaster";
process.on('SIGHUP',app_cleanup);
process.on('SIGKILL',app_cleanup);
process.on('SIGINT',app_cleanup);
process.on('SIGTERM',app_cleanup);
/*
	Load the configuration passed in by arg[2]
*/
var config=new configFactory(config_filename);

log.drawBanner("config="+JSON.stringify(config));

config.data.workers.forEach(
	function(workerConfig,id,array){
		log.drawLine(60);
		log.write("fork process with wrapper");
		var processFactory=require('child_process');
		child=processFactory.fork(CHILD_PROCESS_WRAPPER);
		child.title=config.data.serverType+id
		child.send({code:0});
		worker[id]=child.pid;
		log.write(
			  "\n\nworker["+id+"]={\n"
			 +"\t'type':"+config.data.serverType+",\n"
			 +"\t'config':"+JSON.stringify(workerConfig)+",\n"
			 +"\t'pid':"+worker[id]+",\n"
			 +"}\n\n"
		);
		log.drawLine();
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
				case 3:
					log.write("P:{code:3}from C#"+id);
					/*This should be recorded to stats*/
					break;
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
});
log.write("All workers have been spawned.");

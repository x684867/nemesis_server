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
const LOGGER_SOURCE='app.main';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/library/worker.js';
const PID_WRITER_SCRIPT='/srv/nemesis/app/library/pidWriter.js';
const VALIDATOR_CLASS='./library/msgValidator.js';
const CONFIG_CLASS='./library/config.js';

const E_INV_MSG_ON_ERROR_EVENT="Received invalid message object on error event.";
const E_FEATURE_NOT_IMPLEMENTED="This feature is not implemented.";

var app={
	logger:require(LOGGER_CLASS),
	worker:[],
	monitor:[],
	loadconfig:function(config_filename){
		var configFactory=require(CONFIG_CLASS);
		var config=new configFactory(config_filename);
		return config;
	},
	evalIPCmessages:function(msg){
		this.log=new logger("app(eval)");
		var validator=new (require(VALIDATOR_CLASS));
	  	if(!validator.isValidMsg(msg)) throw("Parent: Rec'd invalid msg object.");
		switch(msg.code){
			case 1:			
				log.write("{{P:{code:1},{D:"+JSON.stringify(m)+"},{C:"+id+"}}");
				break;
			case 3:log.write("{{P:{code:3}},{C:"+id+"}}");break;
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
	},
	evalIPCerrors:function(msg){
		if(!validator.isValidError(msg)) throw new Error(E_INV_MSG_ON_ERROR_EVENT);
		throw new Error(E_FEATURE_NOT_IMPLEMENTED+":worker.on()");
	},
	code2:function(c,i,t,f,k,r,a){
		return {"code":c,"data":{"id":i,"type":t,"config":f,"ssl":{"key":k,"cert":r,"ca_cert":a}}};
	},
	start:function(config){
		log=new logger("app(start)");
		log.drawBanner("app.js  PID:["+process.pid+"]");
		pidFile=new (require(PID_WRITER_SCRIPT))(config.data.pidDirectory);
		log.write("config.data.workers.forEach() starting...");
		config.data.workers.forEach(
			function(workerConfig,id,array){
				if(workerConfig.enabled){
					child=require('child_process').fork(CHILD_PROCESS_WRAPPER);
					child.send(
						{
							code:2,
							data:{
									id:id,
									type:config.data.serverType,
									config:workerConfig,
									ssl:{
										key:config.data.ssl.private_key,
										cert:config.data.ssl.public_key,
										ca_cert:config.data.ssl.ca_cert
									}
								}
						}
					);
					pidFile.createNew(child.pid);
					log.write("w["+id+"]={'type':"+config.data.serverType+",'pid':"+child.pid+"}");
					child.on('message',function(msg){this.evalIPCmessages(msg)});
					child.on('error',function(msg){this.evalIPCerrors(msg)});
					/*
					monitorFactory=require('./monitor/monitorFactory.js');
					monitor.push(new monitorFactory(child,config));	
					*/
				}else{
					log.write("id#"+id+" worker#"+workerConfig.workerId+" disabled (config).");
				}
			}
		);
		return config;
	},
	startMonitoring:function(config){
		/*
			Spawn process and run with the monitor app.
			Pass the worker process id list and statistics process
			id to the monitor process.  This creates a mutual support
			between monitor and stats while also connecting to the 
			workers to monitor heartbeat and spawn new workers if 
			any fail.
		 */
		return config;
	},
	startStats:function(config){
		/*
			Spawn process and run with the stats app.
			Pass the worker process id list and monitor process id
			to the stats process.  This creates a mutual support between
			monitor and stats while also connecting to the workers to
			collect statistics.
		*/
		return config;
	}	
}
/*
*/
console.log("Starting Nemesis...");
/*Capture command-line arguments*/
(function(){
	system=app.startStats(app.startMonitoring(app.start(app.loadconfig(process.argv[2]))));
	if(system.status==0){
		console.log("All workers have been spawned.  Terminating app.js");
		process.exit(0);
	}else{
		throw new ("One or more errors occurred during app.start().");
		process.exit(1);
	}
});



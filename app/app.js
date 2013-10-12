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
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/library/worker.js';
const PID_WRITER_SCRIPT='/srv/nemesis/app/library/pidWriter.js';
const VALIDATOR_CLASS='./library/msgValidator.js';
const CONFIG_CLASS='./library/config.js';

const E_INV_MSG_ON_ERROR_EVENT="Received invalid message object on error event.";
const E_FEATURE_NOT_IMPLEMENTED="This feature is not implemented.";
const E_INV_MSG_PARENT="Parent: Rec'd invalid msg object."

function timestamp(){return "["+(new Date).toISOString()+"]";}

var app={
	loadconfig:function(config_filename){
		var configFactory=require(CONFIG_CLASS);
		var config=new configFactory(config_filename);
		return config;
	},
	code2:function(c,i,t,f,k,r,a){
		return {"code":c,"data":
					{"id":i,"type":t,"config":f,"ssl":
						{"key":k,"cert":r,"ca_cert":a}
					}
		};
	},
	start:function(config){
		console.log(Array(80).join("-")+"\n"
					+"["+timestamp()+"]"
					+"[PID:"+process.pid+" <"+module.filename+">]\n"
					+Array(80).join("-")+"\n"
					+"app.start()\n\n"
		);
		pidFile=new (require(PID_WRITER_SCRIPT))(config.data.pidDirectory);
		config.data.workers.forEach(
			function(workerConfig,id,array){
				if(workerConfig.enabled){
					console.log(timestamp()+" spawning worker #"+id);
					var child=require('child_process').fork(CHILD_PROCESS_WRAPPER);
					if(child){
						global.procs.push(child);
						msg={code:2,
							 pid:child.pid,
							 data:{id:id,
							 	   type:config.data.serverType,
								   config:workerConfig,
								   ssl:{key:config.data.ssl.private_key,
									    cert:config.data.ssl.public_key,
									    ca_cert:config.data.ssl.ca_cert
									}
							}
						};
						pidFile.createNew(child.pid);
						console.log(timestamp()
								   +"{child pid ["+child.pid+"]},"
								   +"{count:"+global.procs.length+"},"
								   +"{name:'"+global.procs.title+"'},"
								   +"{JSON:"+JSON.stringify(msg)+"}\n\n"
								   +"setup message listener"
						);
						console.log(timestamp()+"setup message listener");
						child.on('message',function(msg){
							validator=require(VALIDATOR_CLASS);
		  					if(!validator.isValidMsg(msg)) throw(E_INV_MSG_PARENT);
							switch(msg.code){
								case 1:console.log(timestamp()+"{P:1}=>{C:2}");break;
								case 3:console.log(timestamp()+"{P:3}=>{STOP}");break;
								case 4:console.log(timestamp()+"{P:4}=>{FAIL}");break;
								case 11:
									delay=(new Date()).getTime()/1000 - msg.data;
									if(delay < config.data.monitor.heartbeat.threshold){
										console.log(timestamp()+"{P:11} hbeat w#"+id+":good");
										this.pollMonitoring(msg);
									}else{
										console.log(timestamp()+"{P:11} hbeat w#"+id+":slow");
										this.pollStatistics(msg);
									}
									break;
								case 13:console.log(timestamp()+"{P:13} not impl.");break;
								case 97:console.log(timestamp()+"{P:97} not impl.");break;
								case 99:console.log(timestamp()+"{P:99} not impl.");break;
								default:
									throw new Error(timestamp()+":Unk/Inv code:"+msg.code);
									break;
							}
		  				});
		  				console.log(timestamp()+"setup error listener");
						child.on('error',function(msg){
							if(!validator.isValidError(msg)) throw new Error(E_INV_MSG_ON_ERROR_EVENT);
							throw new Error(E_FEATURE_NOT_IMPLEMENTED+":worker.on("+msg+")");
						});
						console.log(timestamp()+"setup exit listener");
						child.on('exit',function(code,signal){
							console.log(timestamp()+"worker exit ("+id+")("+code+","+signal+") count:"+global.procs.length);
						});
						console.log(timestamp()+"setup close listener");
						child.on('close',function(code,signal){
							console.log(timestamp()+"worker close ("+id+")("+code+","+signal+") count:"+global.procs.length);
							global.pidCount--;
						});
						console.log(timestamp()+"setup disconnect listener");
						child.on('disconnect',function(){
							console.log(timestamp()+"worker disconnect ("+id+") count:"+global.procs.length);
							global.pidCount
						});
						console.log(timestamp()+"end of worker initializer. pidCount"+global.procs.length);
					}else{
		  				console.log(timestamp()+"child process failed to spawn.");
		  			}
				}else{
					console.log(timestamp()+"worker #"+id+" disabled.  pidCount"+global.procs.length);
				}
				console.log(timestamp()+" PIDLIST=["+global.procs.join()+"]");
			}
		);
		return (global.procs.length>0)?true:false;
	},
	pollMonitoring:function(msg){
		console.log(timestamp()+" Poll for monitoring invoked.");
	},
	pollStatistics:function(msg){
		console.log(timestamp()+" Poll for statistics invoked.");
	},
	startMonitoring:function(config){
		console.log(timestamp()+" app.startMonitoring()");
		/*
			Spawn process and run with the monitor app.
			Pass the worker process id list and statistics process
			id to the monitor process.  This creates a mutual support
			between monitor and stats while also connecting to the 
			workers to monitor heartbeat and spawn new workers if 
			any fail.
		 */
		return true;
	},
	startStats:function(config){
		console.log(timestamp()+" app.startStats()");
		/*
			Spawn process and run with the stats app.
			Pass the worker process id list and monitor process id
			to the stats process.  This creates a mutual support between
			monitor and stats while also connecting to the workers to
			collect statistics.
		*/
		return true;
	}	
}
/*
*/
console.log(Array(80).join("-")+"\n"
			+timestamp()+"[PID:"+process.pid+" <"+module.filename+">]\n"
			+Array(80).join("-")+"\n"
			+"Starting Nemesis...\n\n"
);
global.procs=Array();
if(config=app.loadconfig(process.argv[2])){/*Capture command-line arguments*/
	if(app.start(config)){
		if((app.startMonitoring(config)) && (app.startStats(config))){
			console.log(timestamp()+"All services are started.");
			/*terminates*/
		}else{
			throw new Error('monitoring/stats failed');
		}
	}else{
		throw new Error('app.start() failed');
	}
}else{
	throw new Error('app.loadconfig() failed to load configuration.');
}




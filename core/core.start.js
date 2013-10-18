/*
	Nemesis Application Start Method
	/srv/nemesis/core/core.start.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=app_start;

function setChildProcessUncaughtExceptionEvent(c){
	c.on('uncaughtException', function(e) {
		root.error.raise(root.error.messages.app.start.uncaughtException,"pid:"+c.pid+",error:"+e);
		c.send(root.ipc.message.childSuicide());
	});
}

function setChildMessageEvent(c){
	c.on('message',function(msg){
		if(!(root.modules.core.messages.isValidMsg(msg))){
			root.error.raise(root.error.messages.app.start.invalidMessageEncountered);
		}
		switch(msg.code){
			case root.ipc.code.workerAlive:
				c.send(
					root.ipc.message.configureWorker(
						c.pid,
						id,
						root.config.service.data.serverType,
						config,
						root.config.service.data.ssl.private_key,
						root.config.service.data.ssl.public_key,
						root.config.service.data.ssl.ca_cert
					)
				);
				/* Update statistics. */
				break;
				
			case root.ipc.code.workerOnline:
				/* Update statistics. */
				break;
				
			case root.ipc.code.workerFailed:
				/* Update statistics. */
				break;
				
			case root.ipc.code.workerPingReply:
				delay=(new Date()).getTime()/1000 - msg.data;
				if(delay < root.config.service.data.monitor.heartbeat.threshold){
					log.write("root.ipc.code.workerPingReply w#"+id+":good");
					this.pollMonitoring(msg);
				}else{
					log.write("root.ipc.code.workerPingReply w#"+id+":slow");
					this.pollStatistics(msg);
				}
				break;
			
			case root.ipc.code.workerStatsReply:
				log.write("root.ipc.code.workerStatsReply not impl.");
				break;
			
			case root.ipc.code.childSuicideRequest:
				c.kill('SIGKILL');
				break;
				
			case root.ipc.code.childKillReply:
				c.kill('SIGKILL');
				break;
		
			default:
				root.error.raise(root.error.messages.invalidMessageEncountered);
				break;
		}
	});
}

function setChildErrorEvent(c){
	c.on('error',function(m){
		if(!validator.isValidError(m)){ throw new Error(E_INV_MSG_ON_ERROR_EVENT);}
		throw new Error(E_FEATURE_NOT_IMPLEMENTED+":worker.on("+m+")");
	});
}
function setChildExitEvent(child){
	console.log(timestamp()+"++setup exit listener");
	child.on('exit',function(code,signal){
						console.log(
							 timestamp()
							+"worker exit ("+id+")("+code+","+signal+") "
							+"count:"+global.procs.length
						);
	});
}
function setChildCloseEvent(child){
	console.log(timestamp()+"++setup close listener");
	child.on('close',function(code,signal){
		console.log(
			 timestamp()
			+"worker close ("+id+")("+code+","+signal+") "
			+"count:"+global.procs.length
		);
		global.pidCount--;
	});
}
function setChildDisconnectEvent(child){
	console.log(timestamp()+"++setup disconnect listener");
	child.on('disconnect',function(){
		console.log(
					 timestamp()+"worker disconnect ("+id+") "
					+"Cnt:"+global.procs.length
		);
		global.pidCount
	});
}

function app_start(){
	root.app.log("app.start() executing.")

	var pidFile=new root.modules.core.pidTracker(config.data.pidDirectory);
	/*
		For each worker in the server configuration file, spawn a worker process
		and configure the server to operate within our expectations.
	*/
	root.config.service.data.workers.forEach(
		function(workerConfig,id,workerList){
			if(root.type.isTrue(workerConfig.enabled)){
				var child=root.process.fork(root.modules.core.worker);
				if(root.types.isObject(child)){
					root.app.process.pool.push(child);
					root.process.logProcess(root.app.log,id,process.pid,child.pid);
					pidFile.createNew(child.pid);
					child.send(root.ipc.message.startWorker());
					setChildProcessUncaughtExceptionEvent(child);
					setChildMessageEvent(child);		
					setChildErrorEvent(child);
					setChildExitEvent(child);
					setChildCloseEvent(child);
					setChildDisconnectEvent(child);

					console.log(
								 timestamp()
								+"end of worker init. Cnt:"+global.procs.length
					);
				}else{
						console.log(timestamp()+"child process failed to spawn.");
		  			}
				}else{
					console.log(
						timestamp()+"worker #"+id+"/"+(workerList.length-1)+" disabled."
					);
				}
			}
		);
		return (root.process.pool.length>0)?true:false;
}

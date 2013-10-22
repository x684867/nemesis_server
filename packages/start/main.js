/*
	Nemesis Application Start Method
	/srv/nemesis/core/core.start.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=app_start;

function app_start(){
	root.app.log("app.start() executing.")

	var pidFile=new root.packages.core.pidTracker(config.data.pidDirectory);
	/*
		For each worker in the server configuration file, spawn a worker process
		and configure the server to operate within our expectations.
	*/
	root.config.service.data.workers.forEach(
		function(workerConfig,id,workerList){
			if(root.type.isTrue(workerConfig.enabled)){
				var child=root.process.fork(root.packages.core.worker);
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

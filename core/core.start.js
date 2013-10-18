/*
	Nemesis Application Start Method
	/srv/nemesis/core/core.start.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=app_start;

function app_start(){
	root.app.log("app.start() executing.")

	var pidFile=new root.modules.core.pidTracker(config.data.pidDirectory);

	root.config.service.data.workers.forEach(
		function(workerConfig,id,workerList){
			if((typeof(workerConfig.enabled)=='boolean')&&(workerConfig.enabled)){
				var child=root.app.process.fork(root.modules.worker);
				if(child){
					root.app.process.pool.push(child);
					root.process.logProcess(root.app.log,id,process.pid,child.pid);
					pidFile.createNew(child.pid);
					child.send({code:0});
					
					root.app.log.write("{code:0} sent Parent => Child ["+child.pid+"]");
					root.app.log.write(timestamp()+"setup message listener");
					child.on('uncaughtException', function(err) {
						root.app.write( "\n\n"
									+Array(74).join("-")
									+"Process PID:"+child.pid+"\n"
									+"An Uncaught Exception has been thrown:\n\n"
									+err+"\n"
									+"sending SIGKILL to child.\n"
									+Array(74).join("-")
						);
						child.send({code:95});/*{code:95} is a child suicide msg.*/
					})
					child.on('message',function(msg){
						var validator=require(VALIDATOR_CLASS);
						if(!(validator.isValidMsg(msg)))throw(E_INV_MSG_PARENT);
						switch(msg.code){
							case 1:
								log.write("Child{code:1}=>Parent.  Send {code:2}");
								child.send(
									{
										code:2,
						 				pid:child.pid,
						 				data:{
						 						id:id,
						 	   					type:root.config.service.data.serverType,
							   					config:config,
							   					ssl:{
							   						key:root.config.service.data.ssl.private_key,
								    				cert:root.config.service.data.ssl.public_key,
								    				ca_cert:root.config.service.data.ssl.ca_cert
												}
									}
									}
								);
								/* Update statistics. */
								break;
								
							case 3:
								log.write("Child {code:3} received. Server: online.");
								/* Update statistics. */
								break;
								
							case 4:
								log.write("Child {code:4} received. Server: failed.");
								/* Update statistics. */
								break;
								
							case 11:
								delay=(new Date()).getTime()/1000 - msg.data;
								if(delay < root.config.service.data.monitor.heartbeat.threshold){
									log.write("{P:11}beat w#"+id+":good");
									this.pollMonitoring(msg);
								}else{
									log.write("{P:11}beat w#"+id+":slow");
									this.pollStatistics(msg);
								}
								break;
							
							case 13:log.write("{P:13}not impl.");break;
							case 97:log.write("{P:97}not impl.");break;
							case 99:log.write("{P:99}not impl.");break;
							default:
								throw new Error(
												timestamp()+":Unk/Inv code:"+msg.code
								);
								break;
						}
		  			});
		  			console.log(timestamp()+"++setup error listener");
					child.on('error',function(m){
						if(!validator.isValidError(m)){ 
							throw new Error(E_INV_MSG_ON_ERROR_EVENT);
						}
						throw new Error(
											E_FEATURE_NOT_IMPLEMENTED
											+":worker.on("+m+")"
						);
					});
					console.log(timestamp()+"++setup exit listener");
					child.on('exit',function(code,signal){
						console.log(
							 timestamp()
							+"worker exit ("+id+")("+code+","+signal+") "
							+"count:"+global.procs.length
						);
					});
					console.log(timestamp()+"++setup close listener");
					child.on('close',function(code,signal){
						console.log(
							 timestamp()
							+"worker close ("+id+")("+code+","+signal+") "
							+"count:"+global.procs.length
						);
						global.pidCount--;
					});
					console.log(timestamp()+"++setup disconnect listener");
					child.on('disconnect',function(){
						console.log(
									 timestamp()+"worker disconnect ("+id+") "
									+"Cnt:"+global.procs.length
						);
						global.pidCount
					});
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
		log.list_pids();
		return (global.procs.length>0)?true:false;
	},
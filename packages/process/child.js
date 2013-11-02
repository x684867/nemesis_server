/*
	Nemesis Process Management Package
	/srv/nemesis/packages/process/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package overloads the process object with additional functionality,
	including standard process control messages used in the application 
	framework to maintain an elastically scalable worker fabric.
		
	USE:
		root.process
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Process
	
*/
package.exports=child_process_init;

function child_process_init(){
	root.process.child={};
	root.process.child.eventinit={
		uncaughtExceptionEvent:function(c){
			c.on('uncaughtException', function(e) {
				root.error.raise(root.error.messages.app.start.uncaughtException,"pid:"+c.pid+",error:"+e);
				c.send(root.ipc.message.childSuicide());
			});
		},
		messageEvent:function(c){c.on('message',processChildMessagesRecd);},
		errorEvent:function(c){c.on('error',function(m){root.error.raise(root.error.messages.childProcess.invalidMessageOnError,m);});},
		exitEvent:function(c){c.on('exit',function(code,signal){process.deleteChildFromPool(id)});},
	}
}



function processChildMessagesRecd(msg){
	if(!(root.packages.core.messages.isValidMsg(msg))){
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
}
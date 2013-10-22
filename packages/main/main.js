/*
	Nemesis Application Main Method
	/srv/nemesis/core/core.main.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=init;

function init(operatingMode){
	/*
		Load the appropriate service configuration file.
	*/
	switch(operatingMode){
		case "audit": 	root.config.service=require(root.config.svc_cfg.audit);break;
		case "broker":	root.config.service=require(root.config.svc_cfg.broker);break;
		case "cipher":	root.config.service=require(root.config.svc_cfg.cipher);break;
		case "key":		root.config.service=require(root.config.svc_cfg.key);break;
		default: 
			root.error.throw(root.error.messages.bootstrap.invalidArgument);
			break;
	}
	/*
		Show the application banner	
	*/
	root.app.log.screenBanner(root.message.app.starting);
	/*
		Initialize the process manager
	*/
	root.process=require(root.config.packages.app.process);
	root.process.init();
	/*
		Launch the application
	*/	
	if(root.app.start()){
		if(root.app.monitor.heartbeat.start()){
			if(root.app.monitor.statistics.start()){
				root.app.log.error(root.error.app.main.success);
			}else{
				root.app.log.error(root.error.app.main.monitorStatisticsFailed);
			}
		}else{
			root.app.log.error(root.error.app.main.monitorHeartbeatFailed);
		}
	}else{
		root.app.log.error(root.error.app.main.servicesFailed);
	}
}
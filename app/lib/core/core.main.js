module.exports=function(){
	/*
		Define the language specific messages
	*/
	root.messages:require(CONF_DIR+'messages/messages-'+root.config.language+'.conf');
	root.messages.error:require(CONF_DIR+'errors/errors-'+root.config.language+'.conf');
	/*
		Load the application modules (based on app.config.json)
	*/
	root.modules:{
		child_process:require('child_process'),
		logger:require(root.config.modules.lib.logger),
		pidTracker:require(root.config.modules.lib.pidTracker),
		msgValidator:require(root.config.modules.lib.msgValidator),
		uuidVerifiy:require(root.config.modules.lib.uuidVerify),
		monitor:{
			heartbeat:require(root.config.modules.lib.monitor.heartbeat),
			statistics:require(root.config.modules.lib.monitor.statistics)
		},
		store:{
			client:require(root.config.modules.lib.store.client),
			server:require(root.config.modules.lib.store.server),
			marco:require(root.config.modules.lib.store.marco),/*replication sender*/
			polo:require(root.config.modules.lib.store.polo) /*replication receiver*/
		},
		web:{
			client:require(root.config.modules.lib.web.client),
			server:require(root.config.modules.lib.web.server)
		}
	}
	/*
		Show the application banner	
	*/
	root.app.log.screenBanner(root.message.app.starting);
	/*
		Initialize the process manager
	*/
	root.process=require(root.config.modules.app.process);
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
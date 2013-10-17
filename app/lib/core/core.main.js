module.exports=function(){

	root.error:require(CONF_DIR+'errors/errors-'+root.config.language+'.conf');
	root.message:require(CONF_DIR+'messages/messages-'+root.config.language+'.conf');
	
	root.app.log.screenBanner(root.message.app.starting);
	root.app.process.init();
	/*Launch the application*/	
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
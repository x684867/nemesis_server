/*
	Nemesis Application Main Method
	/srv/nemesis/app/app.main.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */

module.exports=function(){/*do nothing*/};

root.app.main={
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


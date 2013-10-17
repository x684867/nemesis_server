/*
	Application Framework Initialization
	/srv/nemesis/app/app.init.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.export=function(){/* do nothing*/};

root.error=require(CONF_DIR+'errors/errors-'+root.config.language+'.conf');
root.message=require(CONF_DIR+'messages/messages-'+root.config.language+'.conf');

root.modules={
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

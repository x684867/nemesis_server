/*
	Logger Config File Reader
	/srv/nemesis/app/logger/loggerConfig.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
modules.export=loggerConfig;
function loggerConfig(filename){
	const E_SYSLOG_CONFIG_FAILED_TO_LOAD="Configuration file failed to load.";
	try{
		return JSON.parse((require('fs')).readFileSync(filename));
	}catch(e){
		throw(E_SYSLOG_CONFIG_FAILED_TO_LOAD+" ["+filename+"]");
	}
}
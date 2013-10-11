/*
	/srv/nemesis/app/audit.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the audit web service.
	
*/
module.exports=Audit;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const LOGGER_SOURCE='audit.js(main)';
const LOGGER_PRIORITY='informational';
const LOGGER_FACILITY='local0';
var logger=require(LOGGER_CLASS);

function Audit(id,config){
	var log=(new (require(LOGGER_CLASS)))(LOGGER_SOURCE,LOGGER_PRIORITY,LOGGER_FACILITY);

}
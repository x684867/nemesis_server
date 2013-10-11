/*
	/srv/nemesis/app/keys.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the keys web service.
	
*/
module.exports=Keys;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const LOGGER_SOURCE='keys.js(main)';
const LOGGER_PRIORITY='informational';
const LOGGER_FACILITY='local0';
var logger=require(LOGGER_CLASS);

function Keys(id,config){
	var log=(new (require(LOGGER_CLASS)))(LOGGER_SOURCE,LOGGER_PRIORITY,LOGGER_FACILITY);

}
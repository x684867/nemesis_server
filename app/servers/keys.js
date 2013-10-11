/*
	/srv/nemesis/app/keys.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the keys web service.
	
*/
module.exports=Keys;

const LOGGER_SOURCE='server.keys';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);


function Keys(id,config){
	var log=new global.logger(LOGGER_SOURCE);	

}
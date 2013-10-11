/*
	/srv/nemesis/app/audit.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the audit web service.
	
*/
module.exports=Audit;

const LOGGER_SOURCE='server.audit';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);



function Audit(id,config){
	var log=new global.logger(LOGGER_SOURCE);	

}
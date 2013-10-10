/*
	/srv/nemesis/app/audit.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the audit web service.
	
*/
module.exports=Audit;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js');
var logger=require(LOGGER_CLASS);

function Audit(id,config){
	var log=new logger("audit.js(main)");

}
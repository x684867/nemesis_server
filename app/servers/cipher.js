/*
	/srv/nemesis/app/cipher.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the cipher web service.
	
*/
module.exports=Cipher;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const LOGGER_SOURCE='cipher.js(main)';
const LOGGER_PRIORITY='informational';
const LOGGER_FACILITY='local0';
var logger=require(LOGGER_CLASS);


function Cipher(id,config){
	var log=(new (require(LOGGER_CLASS)))(LOGGER_SOURCE,LOGGER_PRIORITY,LOGGER_FACILITY);
}
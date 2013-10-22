/*
	/srv/nemesis/app/cipher.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the cipher web service.
	
*/
package.exports=Cipher;

const LOGGER_SOURCE='server.cipher';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);

function Cipher(id,config){
	var log=new global.logger(LOGGER_SOURCE);	
}
/*
	/srv/nemesis/app/cipher.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the cipher web service.
	
*/
module.exports=Cipher;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
var logger=require(LOGGER_CLASS);


function Cipher(id,config){
	var log=new logger("cipher.js(main)");
}
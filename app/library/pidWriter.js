/*
	PID FILE WRITER CLASS
	/srv/nemesis/app/library/pidWriter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.exports=pidWriter;

const LOGGER_SOURCE='lib.pidWriter';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);


function pidWriter(pidDir){
	var log=new global.logger(LOGGER_SOURCE);	
	
	var pidFileBase=pidDir+'/nemesisWorker';
	
	this.createNew=function(pid){
		(require('fs')).writeFile(pidFileBase+pid+'.pid',pid,function(err){
			if(err) throw err;
			log.write("pidWriter wrote nemesisWorker.pid for pid"+pid);
		});
	}
}
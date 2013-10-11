/*
	PID FILE WRITER CLASS
	/srv/nemesis/app/library/pidWriter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.exports=pidWriter;

const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';

function pidWriter(pidDir){
	log=new (require(LOGGER_CLASS));
	
	var pidFileBase=pidDir+'/nemesisWorker';
	
	this.createNew=function(pid){
		(require('fs')).writeFile(pidFileBase+pid+'.pid',pid,function(err){
			if(err) throw err;
			log.write("pidWriter wrote nemesisWorker.pid for pid"+pid);
		});
	}
}
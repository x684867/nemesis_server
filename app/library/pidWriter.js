/*
	PID FILE WRITER CLASS
	/srv/nemesis/app/library/pidWriter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.exports=pidWriter;

const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const LOGGER_SOURCE='pidWriter.js(main)';
const LOGGER_PRIORITY='informational';
const LOGGER_FACILITY='local0';

function pidWriter(pidDir){
	var log=(new (require(LOGGER_CLASS)))(LOGGER_SOURCE,LOGGER_PRIORITY,LOGGER_FACILITY);
	
	var pidFileBase=pidDir+'/nemesisWorker';
	
	this.createNew=function(pid){
		(require('fs')).writeFile(pidFileBase+pid+'.pid',pid,function(err){
			if(err) throw err;
			log.write("pidWriter wrote nemesisWorker.pid for pid"+pid);
		});
	}
}
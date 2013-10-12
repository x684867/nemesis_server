/*
	PID FILE WRITER CLASS
	/srv/nemesis/app/library/pidWriter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.exports=pidWriter;

function pidWriter(pidDir){
			console.log(Array(64).join("-")+"\n"
					+"["+(new Date).toISOString()+"]"
					+"[PID:"+process.pid+" <"+module.filename+">]\n"
					+Array(64).join("-")+"\n"
					+"pidWriter::constructor()\n\n"
		);
	
	var pidFileBase=pidDir+'/nemesisWorker';
	
	this.createNew=function(pid){
		console.log(Array(64).join("-")+"\n"
					+"["+(new Date).toISOString()+"]"
					+"[PID:"+process.pid+" <"+module.filename+">]\n"
					+Array(64).join("-")+"\n"
					+"pidWriter::createNew()\n\n"
		);
		(require('fs')).writeFile(pidFileBase+pid+'.pid',pid,function(err){
			if(err) throw err;
			log.write("wrote nemesisWorker.pid for pid:"+pid);
		});
	}
}
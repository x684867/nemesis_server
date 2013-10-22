/*
	PID FILE WRITER CLASS
	/srv/nemesis/app/library/pidWriter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
package.exports=pidWriter;

function pidWriter(pidDir){
			console.log(Array(80).join("-")+"\n"
					+"["+(new Date).toISOString()+"]"
					+"[PID:"+process.pid+" <"+package.filename+">]\n"
					+"pidWriter::constructor()\n"
					+Array(80).join("-")+"\n"
		);
	
	var pidFileBase=pidDir+'/nemesisWorker';
	
	this.createNew=function(pid){
		console.log("["+(new Date).toISOString()+"]"
					+"[PID:"+process.pid+" <"+package.filename+">]pidWriter::createNew()"
		);
		(require('fs')).writeFile(pidFileBase+pid+'.pid',pid,function(err){
			if(err) throw err;
			console.log(
				"["+(new Date).toISOString()+"]:wrote nemesisWorker.pid for pid:"+pid
			);
		});
	}
}
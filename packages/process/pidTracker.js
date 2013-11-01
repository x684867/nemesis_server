/*
	Nemesis Process Management Package
	/srv/nemesis/packages/process/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package overloads the process object with additional functionality,
	including standard process control messages used in the application 
	framework to maintain an elastically scalable worker fabric.
		
	USE:
		root.process
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Process
	
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
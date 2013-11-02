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
module.exports=function(){

	Object.keys(error).forEach(function(e){console.log(e);});
	/*
	process.on('uncaughtException',function(err){
		console.log(
			"\n\terror:{\n"+
				"\t\tcode: "+ typeof(err) + ",\n" +
				"\t\tmesssage: \""+err.toString()+"\"\n" +
			"\t}"
		);
		error.raise(error.process.uncaughtException,err.toString());
	});
	*/
	syslog=console.create('process',config.process.syslog);
	
	syslog.log("Process has a syslogger");
		
	root.process.pool=Array();
	
	root.process.pidlist=function(){
		var p='';
		for(i=0;i<root.app.process.pool.length;i++) p=p+root.app.process.pool[i].pid+',';
		return "["+p.substring(0,p.length-1)+"]";
	},

	root.process.count=function(){return root.app.process.pool.length;},

	root.process.fork=function(wrapper){
		var child=void(0);
		try{child=root.packages.child_process.fork(wrapper);}catch(e){throw e;}
		root.app.process.showStatus(parent.pid,child.pid,root.app.process.count());
		return child;
	},

	root.process.showStatus=function(p,c,n){
		root.log.write("{parent:"+p+",child:"+c+",count:"+n+"}");
	},
	
	root.process.logProcess=function(localLog,id,parent,child){
		log.write(
			'{'
				+'"id":'+id+','
			 	+'"parentPID":'+parent+','
			 	+'"childPID":'+child+','
			 	+'"count":'+root.process.pool.length
		   +'}'
		);
	}
	
}/*end of root.app.process.*/
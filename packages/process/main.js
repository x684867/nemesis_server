/*
	Nemesis Application Process Manager
	/srv/nemesis/packages/process/main.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
package.exports=process_manager;

function process_manager(){

	process.on(
		'uncaughtException',
		function(err){root.app.log.error(root.error.unknown,err);}
	);

	var log=new root.packages.core.logger(package.id);
	
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
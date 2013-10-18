/*
	Nemesis Application Process Manager
	/srv/nemesis/core/core.process.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=process_manager;

function process_manager(){

	process.on(
		'uncaughtException',
		function(err){root.app.log.error(root.error.unknown,err);}
	);

	var log=new root.modules.core.logger(module.id);
	
	root.process.pool=Array();
	
	root.process.pidlist=function(){
		var p='';
		for(i=0;i<root.app.process.pool.length;i++){
			p=p+root.app.process.pool[i].pid+',';
		}
		return "["+p.substring(0,p.length-1)+"]";
	},

	root.process.count=function(){return root.app.process.pool.length;},

	root.process.fork=function(wrapper){
		var child=void(0);
		try{child=root.modules.child_process.fork(wrapper);}catch(e){throw e;}
		root.app.process.showStatus(parent.pid,child.pid,root.app.process.count());
		return child;
	},

	root.process.showStatus=function(p,c,n){
		root.log.write("{parent:"+p+",child:"+c+",count:"+n+"}");
	},
	
	root.process.logProcess=function(localLog,id,process.pid,child.pid){
		log.write(
			'{'
				+'"id":'+id','
			 	+'"parentPID":'+process.pid+','
			 	+'"childPID":'+child.pid','
			 	+'"count":'+root.process.pool.length
		   +'}'
		);
	}
	
}/*end of root.app.process.*/
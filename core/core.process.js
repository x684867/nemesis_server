/*
	Nemesis Application Process Manager
	/srv/nemesis/app/app.process.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
 */
module.exports=process_manager

function process_manager(){/*do nothing*/};

root.process={
	pool:Array(),

	list:function(){
		var p='';
		for(i=0;i<root.app.process.pool.length;i++){
			p=p+root.app.process.pool[i].pid+',';
		}
		return "["+p.substring(0,p.length-1)+"]";
	},

	count:function(){return root.app.process.pool.length;},

	init:function(){
		process.on(
			'uncaughtException',
			function(err){root.app.log.error(root.error.unknown,err);}
		);
	},

	fork:function(wrapper){
		var child=void(0);
		try{child=root.modules.child_process.fork(wrapper);}catch(e){throw e;}
		root.app.process.showStatus(parent.pid,child.pid,root.app.process.count());
		return child;
	},

	showStatus:function(p,c,n){root.log.write("{parent:"+p+",child:"+c+",count:"+n+"}");}
	
}/*end of root.app.process.*/
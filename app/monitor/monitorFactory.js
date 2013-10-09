/*
	Nemesis Worker Monitor Factory
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a class for monitoring the Nemesis worker processes.
*/
module.exports=monitorFactory;

function monitorFactory(process,config){
		
	this.startHeartbeat=function(process,interval){
		/* 
			Heartbeat monitor.  This sends the heartbeat "pings" 
			to the worker processes. This heartbeat starts with
			a "ping" from parent (with timestamp in seconds since
			the epoch).  The child returns this timestamp which is
			then used by the IPC event listener to calculate the
			time required for the child to respond to the ping.
		*/
		var log=require('/srv/nemesis/app/logger/logger.js');
			log.source="app.js(heartbeat)";
		
		setTimeout(
			function(){
				log.write("Heartbeat!  PID:"+process.pid);
				process.send({code:10,data:(new Date()).getTime()/1000});
			},
			interval
		);
	}
	
	this.startStatistics=function(process,interval){
		var log=require('/srv/nemesis/app/logger/logger.js');
			log.source="app.js(stats)";
		setTimeout(
			function(){
				log.write("StatsRequest! PID:"+process.pid);
				process.send({code:12});
			},
			interval
		);
	}
	
	if(this.isConfigValid(c)){
		startHeartbeat(process,c.monitor.heartbeat);
		startStatistics(process,c.monitor.statistics);
	}

	this.isConfigValid=function(c){
		return ((c==undefined)
			   	&&(c.monitor!=undefined)
			    &&(c.monitor.heartbeat!=undefined)
			   	&&(c.monitor.statistics!=undefined)
			   	&&(typeof(config)=='object')
			   	&&(typeof(config.monitor)=='object')
			   	&&(typeof(config.monitor.heartbeat)=='number')
			   	&&(typeof(config.monitor.statistics)=='number')
			   )?true:false;
	}
	


}
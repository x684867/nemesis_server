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
		var log=new global.logger('monitor.heartbeat');	
		
		setTimeout(
			function(){
				log.write("Heartbeat!  PID:"+process.pid);
				process.send({code:10,data:(new Date()).getTime()/1000});
			},
			interval
		);
	}
	
	this.startStatistics=function(process,interval){
		var log=new global.logger('monitor.stats');	
		setTimeout(
			function(){
				log.write("StatsRequest! PID:"+process.pid);
				process.send({code:12});
			},
			interval
		);
	}
	this.startHeartbeat(process,config.monitor.heartbeat);
	this.startStatistics(process,config.monitor.statistics);
}
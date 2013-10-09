/*
	Configuration JSON Validator
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file defines a function which will validate the JSON object
	defined in server configuration files found in /srv/nemesis/etc/nemesis/app/
	
	VALID JSON FORMAT
	-----------------
	{
		"serverType":"broker",
		"monitor":{
				"heartbeat":{
								"interval":3600,
								"threshold":100
				},
				"statistics":{
								"interval":3600
				}
		},
		"workers":[
				{
					"workerId":21,
					"ipAddress":"127.0.2.1",
					"ipPort":8080
				}
		]
	}
	
*/

module.exports=isValid;

function isValid(c){

	this.isstring=function(s){return (typeof(s)=='string')?true:false;}
	this.isnumber=function(n){return (typeof(n)=='number')?true:false;}
	this.isobject=function(o){return (typeof(o)=='object')?true:false;}
	this.isarray=function(a){return (typeof(o)=='object')&&(typeof(o.every)=='function')?true:false;}	
	this.evalWorkerArray(w){
		return w.every(function(e,i,a){
			return  this.isnumber(e.workerId) &&
				    this.isstring(e.ipAddress) &&
				    this.isnumber(e.ipPort)	   
		});
	}
	
	
	return 	this.isobject(c) &&
			this.isstring(c.serverType) &&
			this.isobject(c.monitor) &&
			this.isobject(c.monitor.heartbeat) &&
			this.isnumber(c.monitor.heartbeat.interval) && 
			this.isnumber(c.monitor.heartbeat.threshold) &&
			this.isobject(c.monitor.statistics) &&
			this.isnumber(c.monitor.statistics.interval) &&
			this.isarray(c.workers) &&
			this.evalWorkerArray(c.workers);
}
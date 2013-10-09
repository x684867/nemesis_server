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

	this.s=function(x){return (typeof(x)=='string')?true:false;}
	this.n=function(n){return (typeof(x)=='number')?true:false;}
	this.o=function(x){return (typeof(x)=='object')?true:false;}
	this.a=function(x){return (typeof(x)=='object')&&(typeof(x.every)=='function')?true:false;}	
	this.e(x){return x.every(function(e,i,a){return this.n(e.workerId)&&this.s(e.ipAddress)&&this.n(e.ipPort)});}

	return 	this.o(c) &&
			this.s(c.serverType) &&
			this.o(c.monitor) &&
			this.o(c.monitor.heartbeat) &&
			this.n(c.monitor.heartbeat.interval) && 
			this.n(c.monitor.heartbeat.threshold) &&
			this.o(c.monitor.statistics) &&
			this.n(c.monitor.statistics.interval) &&
			this.a(c.workers) &&
			this.e(c.workers);
}
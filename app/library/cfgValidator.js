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

module.exports=v;

function s(x){return (typeof(x)=='string')?true:false;}
function n(n){return (typeof(x)=='number')?true:false;}
function o(x){return (typeof(x)=='object')?true:false;}
function a(x){return (typeof(x.every)=='function')?true:false;}	
function i(x,j,k){return this.n(x.workerId)&&this.s(x.ipAddress)&&this.n(x.ipPort);}
function e(x){return x.every(i);}

function v(c){
	if(o(c)&&s(c.serverType)&&o(c.monitor)&&o(c.monitor.heartbeat)&&
	   n(c.monitor.heartbeat.interval)&& n(c.monitor.heartbeat.threshold)&&
	   o(c.monitor.statistics)&&n(c.monitor.statistics.interval)&&a(c.workers)&&
	   e(c.workers)) return c;
	throw new Error('Invalid or malformed JSON configuration.');
}
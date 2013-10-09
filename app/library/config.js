/*
	./library/config.js
	Read, Parse and Validate the Configuration file.
	(c) 2013 Sam Caldwell.  All Rights Reserved.

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
module.exports=config;

var logger=require('/srv/nemesis/app/logger/logger.js');

function config(filename){
	var log=new logger("config.js(main)");	
	
	const T_OBJ='object';
	const T_STR='string';
	const T_NUM='number';
	const T_FUNC='function';

	log.drawBanner("starting config constructor");
	
	var E_CODES=[
		'Invalid configuration object',
		'Invalid monitor configuration object',
		'Invalid heartbeat monitor configuration object',
		'Invalid stats monitor configuration object',
		'Invalid workers configuration object',
		'Invalid serverType in configuration object',
		'Invalid heartbeat interval in configuration object',
		'Invalid heartbeat interval in configuration object',
		'Invalid stats interval in configuration object',
		'Invalid worker collection object (array)',
		'Invalid workerId in worker configuration object',
		'Invalid IP address string in worker configuration object',
		'Invalid network port (number) in worker configuration object',
		'Invalid worker collection object (not an array)'
	];
	this.data={};
	
	var file =require('fs');
	if(!file.lstatSync(filename).isFile()){throw new Error(filename+" doesn't exist");}
	
	log.write("file:"+filename);
	
	file.readFile(filename, 'utf8', function (err, jsonConfigData) {
 		if (err) throw new Exception("Error reading config file.  Error:"+err);
 		
 		log.drawBanner("rawJSON="+jsonConfigData);
 		
		log.write("parsing configuration file");
		try{
			this.data=JSON.parse(jsonConfigData);
		}catch(e){
			throw("JSON.parse() failed to parse the configuration file ["+filename+"]")
		}
		log.write("validating configuration file");
		if(typeof(this.data)!=T_OBJ) throw new Error(E_CODES[0]);
		if(typeof(this.data.serverType)!=T_STR) throw new Error(E_CODES[5]);
		if(typeof(this.data.monitor)!=T_OBJ) throw new Error(E_CODES[1]);
		if(typeof(this.data.monitor.heartbeat)!=T_OBJ) throw new Error(E_CODES[2]);
		if(typeof(this.data.monitor.heartbeat.interval)!=T_NUM) throw new Error(E_CODES[6]);
		if(typeof(this.data.monitor.heartbeat.threshold)!=T_NUM) throw new Error(E_CODES[7]);
		if(typeof(this.data.monitor.statistics)!=T_OBJ) throw new Error(E_CODES[3]);
		if(typeof(this.data.monitor.statistics.interval)!=T_NUM) throw new Error(E_CODES[8]);
		if(typeof(this.data.workers)!=T_OBJ) throw new Error(E_CODES[4]);
		if(typeof(this.data.workers.forEach)!=T_FUNC) throw new Error(E_CODES[13]);
		this.data.workers.forEach(function(w,i,a){
			if(typeof(w)!=T_OBJ) throw new Error(E_CODES[9]);
			if(typeof(w.workerId)!=T_NUM) throw new Error(E_CODES[10]);
			if(typeof(w.ipAddress)!=T_STR) throw new Error(E_CODES[11]);
			if(typeof(w.ipPort)!=T_NUM) throw new Error(E_CODES[12]);
		});
		log.write("configuration JSON object is valid");
	});
	
	log.write("exit constructor.");
	log=void(0);
	
}

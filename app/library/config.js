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
	log=new logger("config.js(main)");
	
function config(filename){
	
	const T_OBJ='object';
	const T_STR='string';
	const T_NUM='number';
	const T_FUNC='function';
	
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

		
	log=new logger("config.js(main)");
	log.drawBanner("starting constructor");
	var config_file =require('fs');
	if(!config_file.lstatSync(filename).isFile()){throw new Error(filename+" does not exist");}

	config_file.readFile(cfg_fname, 'utf8', function (err, jsonConfigData) {
 		if (err) throw new Exception("Error reading config file.  Error:"+err);
 		
		log.write("parsing configuration file");
		try{
			var c=JSON.parse(jsonConfigData);
		}catch(e){
			throw("JSON.parse() failed to parse the configuration file ["+filename+"]")
		}
		log.write("validating configuration file");
		if(typeof(c)!=T_OBJ) throw new Error(E_CODES[0]);
		if(typeof(c.serverType)!=T_STR) throw new Error(E_CODES[5]);
		if(typeof(c.monitor)!=T_OBJ) throw new Error(E_CODES[1]);
		if(typeof(c.monitor.heartbeat)!=T_OBJ) throw new Error(E_CODES[2]);
		if(typeof(c.monitor.heartbeat.interval)!=T_NUM) throw new Error(E_CODES[6]);
		if(typeof(c.monitor.heartbeat.threshold)!=T_NUM) throw new Error(E_CODES[7]);
		if(typeof(c.monitor.statistics)!=T_OBJ) throw new Error(E_CODES[3]);
		if(typeof(c.monitor.statistics.interval)!=T_NUM) throw new Error(E_CODES[8]);
		if(typeof(c.workers)!=T_OBJ) throw new Error(E_CODES[4]);
		if(typeof(c.workers.forEach)!=T_FUNC) throw new Error(E_CODES[13]);
		c.workers.forEach(function(w,i,a){
			if(typeof(w)!=T_OBJ) throw new Error(E_CODES[9]);
			if(typeof(w.workerId)!=T_NUM) throw new Error(E_CODES[10]);
			if(typeof(w.ipAddress)!=T_STR) throw new Error(E_CODES[11]);
			if(typeof(w.ipPort)!=T_NUM) throw new Error(E_CODES[12]);
		});
		log.write("configuration JSON object is valid");
		this.data=c;/*storing the JSON object in the public property for the config class.*/
	});
}

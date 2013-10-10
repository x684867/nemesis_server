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

function config(filename){
	var fs =require('fs');
	var logger=require('/srv/nemesis/app/logger/logger.js');
	var log=new logger("config.js(main)");	
	
	const TOBJ='object';
	const TSTR='string';
	const TNUM='number';
	const TFUNC='function';
	const TBOOL='boolean';

	log.drawBanner("starting config constructor");

	this.data={status:undefined};
	
	var E_CODES=[
		/*00*/'Invalid configuration object',
		/*01*/'Invalid monitor configuration object',
		/*02*/'Invalid heartbeat monitor configuration object',
		/*03*/'Invalid stats monitor configuration object',
		/*04*/'Invalid workers configuration object',
		/*05*/'Invalid serverType in configuration object',
		/*06*/'Invalid heartbeat interval in configuration object',
		/*07*/'Invalid heartbeat interval in configuration object',
		/*08*/'Invalid stats interval in configuration object',
		/*09*/'Invalid worker collection object (array)',
		/*10*/'Invalid workerId in worker configuration object',
		/*11*/'Invalid IP address string in worker configuration object',
		/*12*/'Invalid network port (number) in worker configuration object',
		/*13*/'Invalid worker collection object (not an array)',
		/*14*/'Invalid worker ssl parameter (expect boolean)',
		/*15*/'Invalid ssl object',
		/*16*/'Invalid ssl private_key (expect string)',
		/*17*/'Invalid ssl public_key (expect string)',
		/*18*/'Invalid ssl ca_cert (expect string)',
		/*19*/'Missing file (private_key)',
		/*20*/'Missing file (public_key)',
		/*21*/'Missing file (ca_cert)'
	];
	
	if(fs.lstatSync(filename).isFile()){
		try{
			this.data=JSON.parse(fs.readFileSync(filename));
		}catch(e){
			throw("JSON.parse() failed to read/parse the config file ["+filename+"]")
		}
	}else{
		throw new Error(filename+" doesn't exist");
	}
	log.write("validating configuration file");
	
	if(typeof(this.data)!=TOBJ) throw new Error(E_CODES[0]);
	/*Create a run-time value in the configuration for ssl verification later.*/
	this.data.requireSSL=false;
	
	/*Verify root properties.*/
	if(typeof(this.data.serverType)!=TSTR) throw new Error(E_CODES[5]);
	
	/*Verify the monitor configuration.*/
	if(typeof(this.data.monitor)!=TOBJ) throw new Error(E_CODES[1]);
	if(typeof(this.data.monitor.heartbeat)!=TOBJ) throw new Error(E_CODES[2]);
	if(typeof(this.data.monitor.heartbeat.interval)!=TNUM) throw new Error(E_CODES[6]);
	if(typeof(this.data.monitor.heartbeat.threshold)!=TNUM) throw new Error(E_CODES[7]);
	if(typeof(this.data.monitor.statistics)!=TOBJ) throw new Error(E_CODES[3]);
	if(typeof(this.data.monitor.statistics.interval)!=TNUM) throw new Error(E_CODES[8]);

	/*Worker Verification*/
	if(typeof(this.data.workers)!=TOBJ) throw new Error(E_CODES[4]);
	if(typeof(this.data.workers.forEach)!=TFUNC) throw new Error(E_CODES[13]);
	this.data.workers.forEach(function(w,i,a){
		if(typeof(w)!=TOBJ) throw new Error(E_CODES[9]);
		if(typeof(w.workerId)!=TNUM) throw new Error(E_CODES[10]);
		if(typeof(w.ipAddress)!=TSTR) throw new Error(E_CODES[11]);
		if(typeof(w.ipPort)!=TNUM) throw new Error(E_CODES[12]);
		if(typeof(w.ssl)!=TBOOL) throw new Error(E_CODES[14]);
		if(w.ssl){
			w.ipPort=443
			log.write("NOTICE: ssl=true.  Override ipPort to 443");
			this.data.requireSSL=true;
		}
	});
	if(this.data.requireSSL){
		/*SSL Verification must come AFTER the worker verification*/
		log.write("SSL Verification required.");
		if(typeof(this.data.ssl)!=TOBJ) throw new Error(E_CODES[15]);
		if(typeof(this.data.ssl.private_key)!=TSTR) throw new Error(E_CODES[16]);
		if(typeof(this.data.ssl.public_key)!=TSTR) throw new Error(E_CODES[17]);
		if(typeof(this.data.ssl.ca_cert)!=TSTR) throw new Error(E_CODES[18]);	

		log.write("Verifying that SSL Certificate/Key files exist.");
		[	this.data.ssl.private_key,
			this.data.ssl.public_key,
			this.data.ssl.ca_cert
		].forEach(function(f,i,a){
			if(!fs.lstatSync(f).isFile()) throw new Error(E_CODES[i+19]);
			log.write("  EXISTS!  ["+i+"]:["+f+"]");
		});
	}else{
		log.write("SSL Verification not required.");
	}	
	log.write("configuration JSON object is valid");
	log.write("exit constructor.");
}
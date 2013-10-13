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

const TOBJ='object';
const TSTR='string';
const TNUM='number';
const TFUNC='function';
const TBOOL='boolean';

const E_CFG_FILE_NOT_FOUND='Configuration file not found';
const E_BAD_OBJ='Invalid configuration object';
const E_BAD_MONITOR_OBJ='Invalid monitor configuration object';
const E_BAD_HB_OBJ='Invalid heartbeat monitor configuration object';
const E_BAD_STAT_OBJ='Invalid stats monitor configuration object';
const E_BAD_WRKR_COLL_OBJ='Invalid workers configuration object';
const E_BAD_SRVR_TYPE='Invalid serverType (expect string)';
const E_BAD_HB_INTERVAL='Invalid heartbeat interval (expect number)';
const E_BAD_HB_THRESHOLD='Invalid heartbeat interval in configuration object';
const E_BAD_STAT_INTERVAL='Invalid stats interval in configuration object';
const E_BAD_WRKR_OBJ='Invalid worker collection object (array)';
const E_BAD_WRKR_ID='Invalid workerId in worker configuration object';
const E_BAD_WRKR_IP='Invalid IP address string in worker configuration object';
const E_BAD_WRKR_PORT='Invalid network port (number) in worker configuration object';
const E_BAD_WRKR_ARR='Invalid worker collection object (not an array)';
const E_BAD_WRKR_SSL='Invalid worker ssl parameter (expect boolean)';
const E_BAD_WRKR_EN='Invalid worker enabled flag (expect boolean)';
const E_BAD_SSL_OBJ='Invalid ssl object';
const E_BAD_SSL_KEY='Invalid ssl private_key (expect string)';
const E_BAD_SSL_CRT='Invalid ssl public_key (expect string)';
const E_BAD_SSL_CA='Invalid ssl ca_cert (expect string)';
const E_MISSING_SSL_KEY='Missing file (private_key)';
const E_MISSING_SSL_CRT='Missing file (public_key)';
const E_MISSING_SSL_CA='Missing file (ca_cert)';
const E_BAD_PID_DIR='Missing PID Directory (pidDirectory) in configuration file.';
const E_MISSING_PID_DIR='Missing PID Directory specified in the configuration file.';
const E_UNK_SRVR_TYPE='Unknown server type (expected audit, broker, cipher or keys).';

function timestamp(){return "["+(new Date).toISOString()+"]";}
	
function config(filename){
	var fs =require('fs');

	console.log(Array(74).join('-')+"\n"
			   +timestamp()+" <"+module.filename+">\n"
			   +"config file: "+filename+"\n"
			   +"Starting config constructor...\n"
			   +Array(74).join("-")
	);

	this.data={status:undefined};
	
	try{
		if(fs.statSync(filename).isFile()){
			try{
				this.data=JSON.parse(fs.readFileSync(filename));
			} catch(e) {
				throw("JSON.parse() failed to read/parse the config file ["+filename+"]");
			}
		}else{
			throw new Error(E_CFG_FILE_NOT_FOUND+":"+filename);
		}
	} catch(e) {
		if(e){
			throw e
		}else{
			throw new Error(E_CFG_FILE_NOT_FOUND+":"+filename);
		}
	}
	console.log(timestamp()+"validating configuration file");
	
	var requireSSL=false;
	
	if(typeof(this.data)!=TOBJ) throw new Error(E_BAD_OBJ);
	/*Verify root properties.*/
	if(typeof(this.data.serverType)!=TSTR) throw new Error(E_BAD_SRVR_TYPE);
	if(['audit','broker','cipher','keys'].indexOf(this.data.serverType)==-1){
		throw new Error(E_UNK_SRVR_TYPE);
	}
	if(typeof(this.data.pidDirectory)!=TSTR) throw new Error(E_BAD_PID_DIR);
	
	/*Verify that pidDirectory exists in file system.*/
	if(fs.lstatSync(this.data.pidDirectory).isDirectory()){
		console.log(timestamp()+"PID Directory ["+this.data.pidDirectory+"]: verified.");
	}else{
		throw new Error(E_MISSING_PID_DIR);
	}
		
	/*Verify the monitor configuration.*/
	if(typeof(this.data.monitor)!=TOBJ) throw new Error(E_BAD_MONITOR_OBJ);
	if(typeof(this.data.monitor.heartbeat)!=TOBJ) throw new Error(E_BAD_HB_OBJ);
	if(typeof(this.data.monitor.heartbeat.interval)!=TNUM) throw new Error(E_BAD_HB_INTERVAL);
	if(typeof(this.data.monitor.heartbeat.threshold)!=TNUM) throw new Error(E_BAD_HB_THRESHOLD);
	if(typeof(this.data.monitor.statistics)!=TOBJ) throw new Error(E_BAD_STAT_OBJ);
	if(typeof(this.data.monitor.statistics.interval)!=TNUM) throw new Error(E_BAD_STAT_INTERVAL);

	/*Worker Verification*/
	if(typeof(this.data.workers)!=TOBJ) throw new Error(E_BAD_WRKR_COLL_OBJ);
	if(typeof(this.data.workers.forEach)!=TFUNC) throw new Error(E_BAD_WRKR_ARR);
	this.data.workers.forEach(function(w,i,a){
		if(typeof(w)!=TOBJ) throw new Error(E_BAD_WRKR_OBJ);
		if(typeof(w.enabled)=='undefined') w.enabled='false'; /*default to false*/
		if(typeof(w.enabled)!=TBOOL) throw new Error(E_BAD_WRKR_EN);
		if(typeof(w.workerId)!=TNUM) throw new Error(E_BAD_WRKR_ID);
		if(typeof(w.ipAddress)!=TSTR) throw new Error(E_BAD_WRKR_IP);
		if(typeof(w.ipPort)!=TNUM) throw new Error(E_BAD_WRKR_PORT);
		if(typeof(w.ssl)!=TBOOL) throw new Error(E_BAD_WRKR_SSL);
		if(w.ssl){
			w.ipPort=443
			console.log(timestamp()+"NOTICE: ssl=true.  Override ipPort to 443");
			requireSSL=true;
		}
	});
	if(this.data.requireSSL){
		/*SSL Verification must come AFTER the worker verification*/
		console.log(timestamp()+"SSL Verification required.");
		if(typeof(this.data.ssl)!=TOBJ) throw new Error(E_BAD_SSL_OBJ);
		if(typeof(this.data.ssl.private_key)!=TSTR) throw new Error(E_BAD_SSL_KEY);
		if(typeof(this.data.ssl.public_key)!=TSTR) throw new Error(E_BAD_SSL_CRT);
		if(typeof(this.data.ssl.ca_cert)!=TSTR) throw new Error(E_BAD_SSL_CA);	

		console.log(timestamp()+"Verifying that SSL Certificate/Key files exist.");
		[	{"file":this.data.ssl.private_key,"error":E_MISSING_SSL_KEY},
			{"file":this.data.ssl.public_key,"error":E_MISSING_SSL_CERT},
			{"file":this.data.ssl.ca_cert,"error":E_MISSING_SSL_CA}
		].forEach(function(o,i){
			if(!fs.lstatSync(o.file).isFile()) throw new Error(o.error);
			console.log(timestamp()+"  EXISTS!  ["+i+"]:["+o.file+"]");
		});
	}else{
		console.log(timestamp()+"SSL Verification not required.");
	}
	console.log(timestamp()+"exit config constructor.  JSON config is valid.");
}
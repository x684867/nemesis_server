/*
	Nemesis Broker Server
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file defines the broker web service.
	
	Dependencies: webServerClass
	
	Usage:
		1. Instantiate the BrokerServer class and pass in the
		   id, config, ssl_config parameters.
		   
		2. Invoke BrokerServer.start() to start the broker web service.
		
		3. The service will continue indefinitely until its process receives a 
		   SIGKILL or SIGHUP.	
*/
module.exports=BrokerServer;

/*Return codes for server.start()*/
const SERVER_OK=0
const SERVER_FAIL=1

const BROKER_MSGROUTER='/srv/nemesis/app/servers/broker/msgRouter.js';
const BROKER_MSGPROCESSOR='/srv/nemesis/app/servers/broker/msgProc.js';

const E_CFG_NOT_OBJ='BrokerServer(): config is not an object.';
const E_ID_NOT_NUMBER='BrokerServer(): id parameter must be a number';
const E_PORT_NOT_NUMBER='BrokerServer(): config.ipPort not a number.';
const E_PORT_INV_NUMBER='BrokerServer(): config.ipPort not valid (0-65536)';
const E_IP_NOT_STRING='BrokerServer(): config.ipAddress not string';
const E_SSL_NOT_BOOL='BrokerServer(): config.ssl not boolean';
const E_SSL_CONF_NOT_DEFINED='BrokerServer(): ssl_config not an object';
const E_SSL_CONF_KEY_NOT_STRING='BrokerServer(): ssl_config.key not a string.';
const E_SSL_CONF_CRT_NOT_STRING='BrokerServer(): ssl_config.cert not a string.';
const E_SSL_CONF_CA_NOT_STRING='BrokerServer(): ssl_config.ca not a string.';
/*

 */
function timestamp(){return "["+(new Date).toISOString()+"]";}
log={
	banner:function(m,w){log.line(w);log.write(m);log.line(w);console.log(" ");},
	line:function(w){console.log(Array(w).join('-'));},
	write:function(m){console.log(timestamp()+m)},
	list_pids:function(){
		for(i=0,p='';i<global.procs.length;i++){p=p+global.procs[i].pid+',';}
		log.write("   PID_List:["+p.substring(0,p.length-1)+"]");
	}
}

function BrokerServer(id,config,ssl_config){
	/*
		Validate input parameters and build a single JSON config object for webServer.
	*/
	if(typeof(config)!='object') throw new Error(E_CFG_NOT_OBJ+' type:'+typeof(config));
	if(typeof(id)!='number') throw new Error(E_ID_NOT_NUMBER);
	if(typeof(config.workerId)!='number') throw new Error(E_ID_NOT_NUMBER);
	if(typeof(config.ipPort)!='number') throw new Error(E_PORT_NOT_NUMBER);
	if((config.ipPort <0) || (config.ipPort>65535)) throw new Error(E_PORT_INV_NUMBER);
	if(typeof(config.ipAddress)!='string') throw new Error(E_IP_NOT_STRING);
	if(typeof(config.ssl)!='boolean') throw new Error(E_SSL_NOT_BOOL);
	this.config={
		"id"	:config.workerId,
		"msgRouter":BROKER_MSGROUTER,
		"msgProc":BROKER_MSGPROCESSOR,
		"net"	:{
			"port"	:config.ipPort,
			"ip"	:config.ipAddress
		}
	}
	if(config.ssl){
		if(typeof(ssl_config)!='object') throw new Error(E_SSL_CONF_NOT_DEFINED);
		if(typeof(ssl_config.key)!='string') throw new Error(E_SSL_KEY_NOT_STRING);
		if(typeof(ssl_config.cert)!='string') throw new Error(E_SSL_CRT_NOT_STRING);
		if(typeof(ssl_config.ca)!='string') throw new Error(E_SSL_CA_NOT_STRING);
		this.config.ssl={
				"key"	: ssl_config.key,
				"cert"	:ssl_config.cert,
				"ca"	:ssl_config.ca_cert
		}
	};
	log.write("BrokerServer():{ipAddress:'"+config.ipAddress+"',"
	         				   +"ipPort:"+config.ipPort+","
	         				   +"ssl:"+config.ssl+"}");
	}
	/*
		Define the start() method
	*/
	this.start=function(){
		/*
			Load the webServer Class
		*/
		log.write("BrokerServer::start() has been invoked.
		var wsc=require('/srv/nemesis/app/server/web/webServer.js');
		var webServer=new wsc(this.config);
		log.write("BrokerServer::start() has instantiated the webServerClass");
		if(webServer.launch()){
			log.write("BrokerServer::start() has launched the webServer and it is online.");
			return SERVER_OK;
		}else{
			log.write("BrokerServer::start() failed to launch webServer.");
			return SERVER_FAIL;
		}
		log.write("BrokerServer::start() is terminating.");
	}
}

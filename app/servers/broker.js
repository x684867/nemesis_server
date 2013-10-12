/*
	Nemesis Broker Server
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file defines the broker web service.
	
*/
module.exports=BrokerServer;

const LOGGER_SOURCE='server.broker';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);

/*Return codes for server.start()*/
const SERVER_OK=3
const SERVER_FAIL=4

const E_CFG_NOT_DEFINED='BrokerServer(): config is not defined.';
const E_ID_NOT_DEFINED='BrokerServer(): id parameter not defined.';
const E_CFG_NOT_OBJ='BrokerServer(): config is not an object.';
const E_ID_NOT_NUMBER='BrokerServer(): id parameter must be a number';


function BrokerServer(id,config,ssl_config){	

	var log=new global.logger(LOGGER_SOURCE);	

	if(typeof(config)=='undefined') throw new Error(E_CFG_NOT_DEFINED);
	if(typeof(id)=='undefined') throw new Error(E_ID_NOT_DEFINED);
	if(typeof(config)!='object') throw new Error(E_CFG_NOT_OBJ+' type:'+typeof(config));
	if(typeof(id)!='number') throw new Error(E_ID_NOT_NUMBER);

	log.write("BrokerServer():{ipAddress:'"+config.ipAddress+"',"
	         				   +"ipPort:"+config.ipPort+","
	         				   +"ssl:"+config.ssl+"}");
	this.status=0;/*successful spawn.  Return non-zero for error codes.*/

	log.write('Server instances is created. Call server.start() to launch.');
	log.drawLine();

	this.start=function(){
		log.write('Attempting to start the server...');
		try {
			if(config.ssl){
				log.write('  starting with https');
				var web=require('https');
				web.createServer(
					ssl_config,
					function(req,res){
						res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end('Hello World.  I am broker#'+config.workerId+'\n');
					}
				).listen(config.ipPort, config.ipAddress);
			}else{
			    log.write('  starting with http');
				var web=require('http');
				web.createServer(
					function(req,res){
						res.writeHead(200,{'Content-Type':'text/plain'});
						res.end('Hello World.  I am broker#'+config.workerId+'\n');
					}
				).listen(config.ipPort,config.ipAddress);
			}
		}catch(e){
			log.write("Broker failed to listen on "+config.ipAddress+":"+config.ipPort)
			return SERVER_FAIL;
		}
		log.write('Server started!');
		return SERVER_OK;/*Successful start*/
	}/*server.start();*/
}

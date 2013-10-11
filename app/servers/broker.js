/*
	Nemesis Broker Server
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file defines the broker web service.
	
*/
module.exports=BrokerServer;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const LOGGER_SOURCE='broker.js(main)';
const LOGGER_PRIORITY='informational';
const LOGGER_FACILITY='local0';
/*Return codes for server.start()*/
const SERVER_OK=3
const SERVER_FAIL=4

function BrokerServer(id,config,ssl_config){	

	var log=(new (require(LOGGER_CLASS)))(LOGGER_SOURCE,LOGGER_PRIORITY,LOGGER_FACILITY);

	if(config==undefined) throw new Error('config is not defined.');
	if(id==undefined) throw new Error('index is not defined.');
	if(typeof(config)!='object') throw new Error('config is not an object.  type:'+typeof(config));
	if(typeof(id)!='number') throw new Error('id must be a number.');

	log.write("running Broker.main().");
	log.write("ipAddress:  "+config.ipAddress);
	log.write("ipPort:     "+config.ipPort);
	log.write("ssl enabled:"+config.ssl);
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

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
	this.start=function(){
		var server=(config.ssl)
			?require('https').createServer(ssl_config,function(req,res){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Hello World.  I am broker#'+config.workerId+'\n');
			})
			:require('http').createServer(function(req,res){
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('Hello World.  I am broker#'+config.workerId+'\n');
			});
		server.on('request',function(req,res){
			console.log('BrokerServer('+req+','+res+');');
		});
		server.on('connection',function(socket){
			console.log('connection established')
		});
		server.on('close',function(){
			console.log('connection closed')
		});
		server.on('connect',function(request,socket,head){
			console.log('connect('+request+','+socket+','+head+')');
		});
		server.on('clientError',function(exception,socket){
			console.log('clientError('+exception+','+socket+')');
		});
		server.on('EADDRINUSE',function(err){
			throw("BrokerServer():"+err.message);
		});
		try{			
			server.listen(config.ipPort,config.ipAddress);
			log.write('Server started!');
			return SERVER_OK;
		}catch(e){
			log.write("Broker failed to listen on "+config.ipAddress+":"+config.ipPort)
			return SERVER_FAIL;
		}
	}/*server.start();*/
}

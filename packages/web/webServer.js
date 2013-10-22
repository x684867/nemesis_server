/*
	Nemesis Web Server Class
	/srv/nemesis/app/servers/web/webServer.js
	(c) Sam Caldwell.  All Rights Reserved.
	
	This file creates a generic web server process for use by the Nemesis web services.
	When instantiated, this Class will require a configuration (JSON) object depicted
	below, a message processor class (msgProc) filename and a message router (msgRouter)
	class filename.  The msgProc and msgRouter classes must comply with--
	
		1. "Nemesis Message Processor Class Specification"  
		2. "Nemesis Message Router Class Specification."
		
	============================================================	
	JSON "config" parameter:
	============================================================
		{
			id:<workerId>,
			msgRouter:<file/path to message router>
			msgProc:<file/path to  message processor>
			net:{
					port:<tcp port number>,
					ip:<ipv4 address>
			},
			ssl:{
					key:<key path/fname>,
					cert:<certificate path/fname>,
					ca:<ca certificate path/fname>
			}
		}
	============================================================	
*/
package.exports=webServerClass;

const WEBSTATSCLASS='/srv/nemesis/app/server/web/webStats.js'

const DATA_BUFFER_LIMIT=4194304; /* Approx. 4MB (4*2^20) */
const E_CFG_NOT_OBJECT='webServerClass(): config parameter is not an object.';
const E_MSGPROCFNAME_NOT_STRING='webServerClass(): msgProcFname is not a string';
const E_MSGROUTERFNAME_NOT_STRING='webServerClass(): msgRouterFname is not a string';
const E_INVALID_HTTP_METHOD="Fraudulent method (expect POST,GET,PUT,DELETE)";

function webServerClass(config){
		
	var http = require('http');
	var util = require('util');
	var url = require('url');
	var querystring = require('querystring');
	this.webStats=undefined; /*webStats will be initialized by the listen event*/

	this.sendResponse(res,code){
		res.writeHead(code,{
			'content-length':http.STATUS_CODES[code].length,
			'content-type':'text/plain',
			'connection':'close'
		});
		res.end(http.STATUS_CODES[code]);
	}
	
	this.server=http.createServer(
		function(req,res){
			var buffer = "";
		   	switch(req.method){
		   		case "GET":/*Do nothing*/
		   			log.write("HTTP/GET not supported by webServerClass.");
		   			this.sendResponse(res,404);
		   			break;
		   		case "DELETE":/*Do nothing*/
		   			log.write("HTTP/DELETE not supported by webServerClass.");
		   			this.sendResponse(res,404);
		   			break;
    			case "PUT":/*fall through*/
    				log.write("HTTP/PUT received...passing through to POST");
    				this.sendResponse(res,404);
    				break;	
    			case "POST":
    				/*
    					Create POST read event on 'data' events.  This event will fire 
    					each time data is sent via HTTP/POST to the server (in chunks) 
    					and the event handler (below) will aggregate the chunks into a
    					single buffer string.
    				*/
  					req.on("data", function(data){ 
  						/*
  							This event will read the data from the POST header in chunks.
  							This data will be placed into a buffer until and unless the
  							size of the buffer would pass the DATA_BUFFER_LIMIT.
  						 */
  						if((buffer.length + data.length) < DATA_BUFFER_LIMIT){
	  						buffer += data;
	  						this.webStats.logDataRead(data.length,buffer.length);
	  					}else{
	  						/*
	  							We need to throw an exception here to avoid a buffer
	  							overflow vulnerability.  This will be caught by the
	  							Uncaught Exception handler for this process and the 
	  							connection will be reset.  
	  						 */
	  						this.sendResponse(res,413);
	  						throw new Error(DATA_BUFFER_OVERFLOW);
	  					}
  					});
  					/* */
  					req.on("end", function(){ 
  						/*
  							Once all data in the POST buffer has been read the "end" 
  							event will fire and this event handler will pass the POST 
  							buffer to the message router for parsing, validation and 
  							routing to the appropriate message processor.
  						*/
  						this.webStats.logDataReadClosed(data.length,buffer.length);
  						/**/
  						var msgRouterClass=require(config.msgRouter);
						var router=new msgRouterClass(config);
							router.route(req,res,buffer);
  					});
  					break;
				default:
					throw new Exception(E_INVALID_HTTP_METHOD);
					break;
			}
		}
	);
	
	this.server.on('connection',function(){this.webStats.logConnection();});
	
	this.server.on('request',	function(req,res){this.webStats.logRequest(req,res);});
	
	this.server.on('listening',	function(){this.webStats.logServerListening(config);});

	this.launch=function(){
		try{
			server.listen(config.net.port, config.net.ip, function(){
				/*
					We have started listening to the specified IP address and tcp port.
					Accordingly we will now start collecting web statistics by creating
					a new webStats instance.
				*/
				this.webStats=(new require(WEBSTATSCLASS));
			}
		catch (e){
			log.write("\n"+Array(50).join('-')
						+"{\n"
						+"  id:"+config.workerId+",\n"
						+"  msgRouter:"+config.msgRouter+",\n"
						+"  msgProc:"+config.msgProc+",\n"
						+"  net:{\n"
						+"         ip:"+config.net.ip+",\n"
						+"         port:"+config.net.port+",\n"
						+"  },\n"
						+"  ssl:{\n"
						+"         key:"+config.ssl.key+",\n"
						+"         cert:"+config.ssl.cert+",\n"
						+"         ca:"+config.ssl.ca+",\n"
						+"  }\n"
						+"}\n\n"
						+Array(50).join('-')+"\n"
			);
			throw new Error('webServerClass::launch() failed.  Error:'+e.message);
		}		
	}
}/*end of webServerClass*/
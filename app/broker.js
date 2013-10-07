/*
	broker worker
*/
module.exports=Broker;

function Broker(id,config){
	
		
	if(config==undefined) throw new Error('config is not defined.');
	if(id==undefined) throw new Error('index is not defined.');
	if(typeof(config)!='object') throw new Error('config is not an object.  type:'+typeof(config));
	if(typeof(id)!='number') throw new Error('id must be a number.');
	
	console.log("           running Broker.main().");
	console.log("                ipAddress:"+config.ipAddress);
	console.log("                ipPort:   "+config.ipPort);
	console.log(" ");
	this.status=0;/*successful spawn.  Return non-zero for error codes.*/
	console.log('the server is instantiated.  But start() must be called to start it.');

}
Broker.start=function(){
	console.log('Attempting to start the server...');
	try {
	
		var http = require('http');
		http.createServer(function (req, res) {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end('Hello World.  I am broker#'+config.workerId+'\n');
		}).listen(config.ipPort, config.ipAddress);
	
	}catch(e){
	
		console.log('           Broker failed to open http listener');
		return 10;/*Fatal Error*/
		
	}
	console.log('Server started!');
	return 0;/*Successful start*/
}
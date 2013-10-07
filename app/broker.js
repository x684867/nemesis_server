/*
	broker worker
*/
module.exports=Broker;

function Broker(id,config){
	
	this.status=10;/*Fatal Error (status was not set by the constructor.*/
		
	if(config==undefined) throw new Error('config is not defined.');
	if(id==undefined) throw new Error('index is not defined.');
	if(typeof(config)!='object') throw new Error('config is not an object.  type:'+typeof(config));
	if(typeof(id)!='number') throw new Error('id must be a number.');
	
	console.log("           running Broker.main().");
	console.log("                ipAddress:"+this.config.ipAddress);
	console.log("                ipPort:   "+this.config.ipPort);
	console.log(" ");
		
	try {
	
		var http = require('http');
		http.createServer(function (req, res) {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end('Hello World.  I am '+this.config.workerId+'\n');
		}).listen(this.config.ipPort, this.config.ipAddress);
		
	}catch(e){
	
		console.log('           Broker failed to open http listener');
		this.status=11;/*Fatal error.*/
		
	}
	this.status=0;/*successful spawn.  Return non-zero for error codes.*/
}

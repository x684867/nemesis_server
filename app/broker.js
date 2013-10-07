/*
	broker worker
*/
module.exports=Broker;

function Broker(index,data){
	var id=index;
	var config=data;
	
	if(data==undefined) throw new Error('config is not defined.');
	if(index==undefined) throw new Error('index is not defined.');
	if(typeof(data)!='object') throw new Error('config is not an object.  type:'+typeof(data));
	if(typeof(index)!='number') throw new Error('id must be a number.');

}

Broker.prototype.main=function(){
	console.log("           running Broker.main().");
	
	try {
		var http = require('http');
		http.createServer(function (req, res) {
		  res.writeHead(200, {'Content-Type': 'text/plain'});
		  res.end('Hello World\n');
		}).listen(1337, '127.0.0.1');
	}catch(e){
		console.log('           Broker failed to open http listener');
		return 10;/*Fatal error.*/
	}
	
	console.log('           Broker listening (http://127.0.0.1:1337/)');
	return 0;/*successful spawn.  Return non-zero for error codes.*/
	
}

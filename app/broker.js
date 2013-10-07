/*
	broker worker
*/
module.exports=brokerClass;

function brokerClass(index,data){
	var id=index;
	var config=data;
	
	if(data==undefined) throw new Error('config is not defined.');
	if(index==undefined) throw new Error('index is not defined.');
	if(typeof(data)!='object') throw new Error('config is not an object.  type:'+typeof(data));
	if(typeof(index)!='number') throw new Error('id must be a number.');

}

brokerClass.prototype.main=function(){
	console.log("running main.");
	
	var http = require('http');
	http.createServer(function (req, res) {
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('Hello World\n');
	}).listen(1337, '127.0.0.1');
	console.log('Server running at http://127.0.0.1:1337/');
	
	
	return 0;/*successful spawn.  Return non-zero for error codes.*/
	
}

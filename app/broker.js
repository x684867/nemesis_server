/*
	/srv/nemesis/app/broker.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the broker web service.  The broker acts as the
	front-end web service for Nemesis API and NemesisFS Agent
	access by user application servers.  On the back-end, the 
	broker acts as the point where--
	
		*policy is stored/enforced
		*objects are encrypted and decrypted.
*/

/*
	Arguments are passed in when the script is executed.
	This includes:
	
			ipAddress
			ipPort
*/
config={
	ipAddress:'127.0.0.1',
	ipPort:1337,
	proto:'http'
};

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(config.ipPort, config.ipAddress);

console.log('Server running at '+config.proto+'://'+config.ipAddress+':'+config.ipPort+'/');
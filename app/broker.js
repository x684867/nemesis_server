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
var fs = require('fs');
var file = '/srv/nemesis/etc/nemesis/app/broker.config.json';
var config=Object();
fs.readFile(file, 'utf8', function (err, data) {
	  	if (err) {
	  		console.log('Error: ' + err);
	  		return;
	  	}else{
	  		console.log('parsing configuration data');
	  		
	  		config=JSON.parse(data);
	  	}
	}
);

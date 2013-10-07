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
config_file=process.argv[2];
console.log("Starting /srv/nemesis/app/broker.js...");
console.log(" ");
console.log("    config_file: "+config_file);

config_data=require(config_file);
config=JSON.parse(config_data);

console.log(config_data);


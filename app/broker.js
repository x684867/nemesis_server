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
console.log("Starting /srv/nemesis/app/broker.js...");
config_file=process.argv[2];
console.log("  config_file: "+config_file);
/*
if(process.argv[1]==undefined){
	console.log("Missing argument: configuration_path");
	throw new Exception();
}else{
	config_file=process.argv[2];
}

*/

var fs=require('fs');
fs.readFile(config_file,function(err,data){
	if(err){
		console.log("Error reading configuration file.");
		console.log("  config_file:"+config_file);
		console.log("        error:"+err);
		throw new Exception();
	}else{
		/*Read the configuration file.*/
		config=JSON.parse(data);	
		/*Iterate through the configuration and spawn enough workers.*/
		if(config.workers==undefined){
			console.log("No workers defined in config_file");
			console.log("check config_file ("+config_file+")");
			console.log(" ")
			throw new Exception();
		}else{
			config.workers.forEach(function(worker_data,index,array){
				
				/*Spawn the web worker.*/
				console.log("worker_data:");
				console.log("   "+worker);
				
			});
		}
	}
});

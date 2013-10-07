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
console.log(" ");
process.argv.forEach(function(data,index,array){
	console.log("    arg["+index+"]: "+data)
});
console.log(" ");
config_file=process.argv[2];
console.log("    config_file: "+config_file);

var fs=require('fs');
fs.readFile(config_file,'utf8',function(err,data){
	if(err){
		console.log("Error reading configuration file.");
		throw new Exception();
	}else{
		config=JSON.parse(data);
		if(config==undefined){
			console.log("config is undefined or invalid JSON");
		}else{	
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
	}
});
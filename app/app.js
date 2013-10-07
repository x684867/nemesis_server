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
console.log("app.js starting as master process.");
var fs = require('fs');
var file = process.argv[2];
var config=Object();
console.log("    ...loading config file: "+file);
fs.readFile(file, 'utf8', function (err, data) {
	  	if (err) {
	  		console.log('Error: ' + err);
	  		return;
	  	}else{
	  		config=JSON.parse(data);
	  		console.log("    ...configuration loaded.");
	  		workerPath=__dirname+"/"+config.serverType+".js"
	  		console.log("    ...workerName: "+workerPath)
	  		worker=require(workerPath);
			config.workers.forEach(function(data,index,array){
				console.log("        ...spawning worker ["+index+"]");
				/*instantiate the new worker object with its parameters.*/
				w_instance=new worker(index,data);
				/*launch the new worker with the main() method*/
				w_instance.main();
				/*Move on to the next worker*/
	  		});
	  		console.log("    ...All workers have been spawned.");
	  	}
	}
);

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

var config=Object();		/*This is the worker configuration.*/
var worker=Array();				/*This array will store the workers.*/

var file = process.argv[2];

console.log("    ...loading config file: "+file);
var fs = require('fs');
fs.readFile(file, 'utf8', function (err, data) {
 	if (err) {
  		console.log('Error: ' + err);
  		return;
  	}else{
  		config=JSON.parse(data);
  		console.log("    ...configuration loaded.");
  		workerPath=__dirname+"/"+config.serverType+".js"
  		console.log("    ...workerName: "+workerPath)
  		
		config.workers.forEach(function(data,index,array){
			console.log("        ...spawning worker ["+index+"]");
			console.log("           config = "+JSON.stringify(data));
			console.log(" ");
			/*instantiate the new worker object with its parameters.*/
			workerClass=require(workerPath);
			worker[index]=new workerClass(index,data);
			
			/*launch the new worker with the main() method*/
			worker_response=worker[index].main();
			switch(worker_response){
				case 0: console.log("           spawned successfully."); break;
				case 1: console.log("           error(1)");
				case 2: console.log("           error(2)");
				case 3: console.log("           error(3)");
				default:
						throw new Error("           failed to spawn and returned an\n"
									   +"           unknown or unhandled error.\n");
						break;
			
			}
  		});
 		console.log("    ...All workers have been spawned.");
	}
});

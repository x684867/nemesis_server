/*
	/srv/nemesis/app/app.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the master process (app.js) for the Nemesis web services.
	Each of the four (4) web services (audit,broker,cipher,keys) are 
	launched using this app.js script, passing in a path and filename
	to the specific web service's configuration file.  These config 
	files contain a general description of the environment to be 
	established for the web service(s) and the configuration data for
	each service's workers.

	This process is the command and control for all processes spawned
	as workers for the given web service.  The mission of this app.js
	script is to launch the required threads and then to monitor them
	in real time and respawn any worker process which may die or become
	unresponsive.	
*/
const CHILD_PROCESS_WRAPPER='/srv/nemesis/app/worker.js';

var worker=Array();

console.log("app.js starting as master process.");

var config=Object();		/*This is the worker configuration.*/


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
		
			console.log("        ...instantiating worker ["+index+"]");
			console.log("           config = "+JSON.stringify(data));
			console.log(" ");
			
			/*instantiate the new worker object with its parameters.*/
			serverFactory=require(workerPath);
			server=new serverFactory(index,data);
			
			switch(server.status){
				case 0: console.log("           created successfully."); break;
				case 1: console.log("           error(1)(recoverable)"); break;
				case 2: console.log("           error(2)(recoverable)"); break;
				case 3: console.log("           error(3)(recoverable)"); break;
				case 10: throw new Error("           error(10)(fatal)"); break;
				default:
						throw new Error("           failed to create and returned an\n"
									   +"           unknown or unhandled error.\n");
						break;
			
			}
			
			/*Now we need to fork a process for this worker.*/
			console.log("        ...forking child process with wrapper.js.");
			var process=require('child_process');
			worker[index]=process.fork(CHILD_PROCESS_WRAPPER);
			console.log("           done.  pid="+worker[index].pid)

			console.log("        ...setup message handler.");
			worker[index].on('message',function(msg){
				switch(msg.code){
					case 0: /*Child is alive.  This is the first message send by child.*/
						console.log("           child has checked in and is alive.");
						console.log("           sending server object to the child.");
						worker[index].send(server);
						console.log("           done.  child has server object");
						break;
					case 1:
					
					/*General Application Messages 10-19*/
					case 10: /*Heartbeat Message*/
						console.log("             worker["+index+"] heartbeat:"+msg.code);
						/*
						  Record the heartbeat to the statistics.  If not we may assume
						  The process is hung or dead, which would lead us to respawn the
						  process unnecessarily.
						 */
						break;
					case 11: /*Object Created Message*/
						console.log("             worker["+index+"] create object:"+msg.code);
						
						/*Process the object into the store.*/
						
						/*Handle the statistics*/
						
						break;
					
					
						
					/*Process management Messages 90-99*/
					case 90: /*Suicide message: Kill me softly.*/
						console.log("             worker["+index+"] wants to die:"+msg.code);
						
						/*Kill the child process here.*/
						
						break;
					default:
						throw new Error("unhandled message recieved from worker process.");
				}
			}

			
			console.log("        ...sending code:0 object as message to child.");
			worker[index].send({code:0});
			console.log("           done sending message.");
			
			
			
  		});
 		console.log("    ...All workers have been spawned.");
	}
});

/*
	/srv/nemesis/app/worker.js
	Child-Process Wrapper Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This script is used by app.js to fork a new process where the Nemesis
	web services (audit, broker, cipher, keys) will run.  This wrapper script
	is intended to manage the web services and interact with the parent (master)
	process operated by app.js.
*/
console.log('worker.js is starting...');

process.on('message', function(msg){
	console.log('worker.js has received a message from parent.');
	if(typeof(msg)=='object'){
		console.log('parent message is an object.  We are happy!');
		server=msg;
		server_status=server.start();
		switch(server_status){
			case 0: process.send({code:1}); break;
			case 10: process.send({code:2}); break;
			default:
				throw new Error("           failed to create and returned an\n"
							   +"           unknown or unhandled error.\n");
				break;	
		}
	}else{
		console.log('parent message is not an object.  WTF?!');
		process.send({code:2});
	}

}

/*Process has started.  
  Send message to parent to check-in and fetch the server.
  The message {code:0} tells the parent process that the process
  started and it is healthy.
  
  The parent process will receive {code:0} and respond with a 
  server object.  This object must then be spawned.
 */
process.send({code:0});
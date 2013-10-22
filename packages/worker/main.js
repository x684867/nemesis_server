/*
	Worker Process Wrapper Script
	/srv/nemesis/packages/worker.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This script is used by app.js to fork a new process where the Nemesis
	web services (audit, broker, cipher, keys) will run.  This wrapper script
	is intended to manage the web services and interact with the parent (master)
	process operated by app.js.
*/
module.exports=init

const SERVER_SCRIPT_PATH='/srv/nemesis/app/servers/';
const LOGGER_SOURCE='lib.worker';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
const VALIDATOR_CLASS='/srv/nemesis/app/library/msgValidator.js';

const TOBJ='object';
const TSTR='string';
const TNUM='number';

const LOG_CODE0_RECD='Worker received {code:0}.  Replying with {code:1}';
const LOG_CODE2_RECD='Worker received {code:2}.';
const LOG_CODE10_RECD='Worker received {code:10}.';
const LOG_CODE2_VALIDATED='Validated {code:2} msg content';
const LOG_MSG_RECD='worker.js has received a message from parent.';
const E_INV_MSG_CHILD="Child rec'd invalid message object from parent.";

function init(){
	log.banner(" <"+package.filename+">\nStarting workerClass()...\n",74);
	log.write("workerClass():setup IPC message listener");
	process.on('exit',function(code){log.write("worker exit");});
	process.on('close',function(code){log.write("worker close");});
	process.on('message', function(msg){
		log.write(LOG_MSG_RECD);
		var validator=require(VALIDATOR_CLASS);
		if(!(validator.isValidMsg(msg)))throw(E_INV_MSG_CHILD);
		switch(msg.code){
				
			case 0:
					log.write("Child rec'd {code:0}.  Sending {code:1}");
					process.send({code:1});
					break;
						
			case 2:	
					var serverFactory=require(SERVER_SCRIPT_PATH+msg.data.type+'.js');		   	
				   	var server=new serverFactory(
				   									msg.data.id,
				   									msg.data.config,
				   									msg.data.ssl
				   	);
					switch(c=server.start()){
						case 0: 
								log.write("Child:{code:2} rec'd.  Sending {code:3}");
								process.send({code:3});
								break;
						case 1: 
								log.write("Child:{code:2} rec'd.  Sending {code:4}");
								process.send({code:4});
								break;
						default:
							log.write("Child:{code:2} rec'd. Fatal error. code:"+c);
							throw new Error ("Unknown result rec'd from server.start()");
							break;
					}
				   	break;
				   	
			case 10:
					log.write("Child:{code:10} rec'd.  Sending {code:11} echo.");
					log.write("      sending:{code:11,data:"+msg.data+"}");
					process.send({'code':11,'data':msg.data});
					break;
					
			case 12:break;
			case 96:break;
			case 98:break;
			default:
				if(msg.code==undefined){
					throw new Error(E_UNDEFINED_CHILD_PROCESS);
				}else{
					throw new Error(E_INV_CHILD_RECEIVED+":"+msg.code);
				}
				break;
		}
	});
	console.log(timestamp()+"workerClass() terminating");
}
workerClass();
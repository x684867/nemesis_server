/*
	/srv/nemesis/app/worker.js
	Child-Process Wrapper Script
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This script is used by app.js to fork a new process where the Nemesis
	web services (audit, broker, cipher, keys) will run.  This wrapper script
	is intended to manage the web services and interact with the parent (master)
	process operated by app.js.
*/
module.exports=workerClass

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
const E_BAD_MSG_RECD="Parent: Rec'd invalid msg object.";

function timestamp(){return "["+(new Date).toISOString()+"]";}

function workerClass(){
	console.log(Array(74).join('-')+"\n"
			   +timestamp()+" <"+module.filename+">\n"
			   +"Starting workerClass()...\n"
			   +Array(74).join("-")
	);
	console.log(timestamp()+"workerClass():setup IPC message listener")
	process.on('exit',function(code){console.log(timestamp()+"worker exit");});
	process.on('close',function(code){console.log(timestamp()+"worker close");});
	process.on('message', function(msg){
		console.log(timestamp()+LOG_MSG_RECD);
		/* */
		var validator=new require(VALIDATOR_CLASS);
		if(validator.isValidMsg(msg)){
			switch(msg.code){
				case 0:console.log(timestamp()+LOG_CODE0_RECD);process.send({code:1});break;
				case 2:console.log(timestamp()+LOG_CODE2_RECD);
					   console.log(timestamp()+LOG_CODE2_VALIDATED+':'+JSON.stringify(msg));
					   serverFactory=require(SERVER_SCRIPT_PATH+msg.data.type+'.js');
					   server=new serverFactory(msg.data.id,msg.data.config,msg.data.ssl);
					   process.send({code:server.start()});
					   break;
				case 10:process.send({'code':11,'data':msg.data});break;
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
		}else{
			 throw(E_BAD_MSG_RECD);
		}
	});
	console.log(timestamp()+"workerClass() terminating");
}
workerClass();
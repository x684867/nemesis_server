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
const E_INV_MSG_CHILD="Child rec'd invalid message object from parent.";

function timestamp(){return "["+(new Date).toISOString()+"]";}
log={
	banner:function(m,w){log.line(w);log.write(m);log.line(w);console.log(" ");},
	line:function(w){console.log(Array(w).join('-'));},
	write:function(m){console.log(timestamp()+m)},
	list_pids:function(){
		for(i=0,p='';i<global.procs.length;i++){p=p+global.procs[i].pid+',';}
		log.write("   PID_List:["+p.substring(0,p.length-1)+"]");
	}
}

function workerClass(){
	log.banner(" <"+module.filename+">\nStarting workerClass()...\n",74);
	log.write("workerClass():setup IPC message listener");
	process.on('exit',function(code){log.write("worker exit");});
	process.on('close',function(code){log.write("worker close");});
	process.on('message', function(msg){
		log.write(LOG_MSG_RECD);
		validator=require(VALIDATOR_CLASS);
		
		switch(typeof(validator)){
			case 'object': console("---DEBUG: validator is an object");break;
			case 'undefined': console("---DEBUG: validator is undefined");break;
			default: console("---DEBUG: validator is of type: "+typeof(validator));break;
		}
		
		if(!(validator.isValidMsg(msg)))throw(E_INV_MSG_CHILD);
		switch(msg.code){
				
			case 0:/*Parent (code:0) => Child (code:1) => Parent*/
			
					log.write(LOG_CODE0_RECD);
					process.send({code:1});
					break;
						
			case 2:/*Parent (code:1) => Child (code:2) => Parent (code:[3,4]) */
			
					log.write(LOG_CODE2_RECD);
				   	log.write(LOG_CODE2_VALIDATED+':'+JSON.stringify(msg));
				   	serverFactory=require(SERVER_SCRIPT_PATH+msg.data.type+'.js');
				   	server=new serverFactory(msg.data.id,msg.data.config,msg.data.ssl);
				   	process.send({code:server.start()});
				   	break;
				   	
			case 10:
				
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
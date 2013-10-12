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
global.logger=require(LOGGER_CLASS);

const TOBJ='object';
const TSTR='string';
const TNUM='number';

const E_BAD_IPC_MSG='Worker received an IPC message which is not an object';
const E_BAD_IPC_MSG_CODE='Worker received an invalid message (code not number';
const E_BAD_CODE2_MSG_DATA='Invalid {code:2} (msg.data not an object)';
const E_BAD_CODE2_MSG_DATA_TYPE='Invalid {code:2} (msg.data.type not a string)';
const E_BAD_CODE2_MSG_DATA_ID='Invalid {code:2} (msg.data.id not a number)';
const E_BAD_CODE2_MSG_DATA_CFG='Invalid {code:2} (msg.data.config not an object)';
const E_IPC_CODE_NOT_IMPLEMENTED="msg.code is not implemented";
const E_UNDEFINED_CHILD_PROCESS="msg.code is undefined when child processed message.";
const E_INV_CHILD_RECEIVED="Unrecognized/Invalid msg sent to child";

const LOG_CODE0_RECD='Worker received {code:0}.  Replying with {code:1}';
const LOG_CODE2_RECD='Worker received {code:2}.';
const LOG_CODE10_RECD='Worker received {code:10}.';
const LOG_CODE2_VALIDATED='Validated {code:2} msg content';

function workerClass(){

	var log=new global.logger(LOGGER_SOURCE);	
		log.drawBanner('worker.js is starting...');

process.on('message', function(msg){
	log.write('worker.js has received a message from parent.');
	if(typeof(msg)!=TOBJ) throw new Error(E_BAD_IPC_MSG);
	if(typeof(msg.code)!=TNUM) throw new Error(E_BAD_IPC_MSG_CODE);
	switch(msg.code){
		case 0:	log.write(LOG_CODE0_RECD);process.send({code:1});break;
		case 2: log.write(LOG_CODE2_RECD);
				if(typeof(msg.data)!=TOBJ) throw new Error(E_BAD_CODE2_MSG_DATA);
				if(typeof(msg.data.type)!=TSTR) throw new Error(E_BAD_CODE2_MSG_DATA_TYPE);
				if(typeof(msg.data.id)!=TNUM) throw new Error(E_BAD_CODE2_MSG_DATA_ID);
				if(typeof(msg.data.config)!=TOBJ) throw new Error(E_BAD_CODE2_MSG_DATA_CFG);
				log.write(LOG_CODE2_VALIDATED+':'+JSON.stringify(msg));
				serverFactory=require(SERVER_SCRIPT_PATH+msg.data.type+'.js');
				server=new serverFactory(msg.data.id,msg.data.config,msg.data.ssl);
				process.send({code:server.start()});
				break;
		case 10:log.write(LOG_CODE10_RECD);process.send({'code':11,'data':msg.data});break;
		case 12:log.write(E_IPC_CODE_NOT_IMPLEMENTED+":{code:"+msg.code+"}"); break;
		case 96:log.write(E_IPC_CODE_NOT_IMPLEMENTED+":{code:"+msg.code+"}"); break;
		case 98:log.write(E_IPC_CODE_NOT_IMPLEMENTED+":{code:"+msg.code+"}"); break;
		default:
			throw new Error(
							(msg.code==undefined)
							?E_UNDEFINED_CHILD_PROCESS
							:(E_INV_CHILD_RECEIVED+":"+msg.code
			);
			break;
	}
});

process.on('SIGHUP',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGHUP]");});
process.on('SIGKILL',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGKILL]");});
process.on('SIGINT',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGINT]");});
process.on('SIGTERM',function(){console.log("[pid:"+process.pid+"]"+process.title+": signal[SIGTERM]");});

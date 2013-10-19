/*
	Nemesis Interprocess Message Helper
	/srv/nemesis/core/core.messages.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
	
	
 */
module.exports=message_handler;
/* */

/* */
function typeCheck(d,t,e){if(typeof(d)!=t) throw new Error(e);}
/* */

function message_handler(){ }
	/*
		IPC Code values.
	*/
	root.ipc={
		code:{
			startWorker:0,
			workerAlive:1,
			configureWorker:2,
			workerOnline:3,
			workerFailed:4,
			
			watchdogPingRequest:10,
			workerPingReply:11,
			statsRequest:12,
			workerStatsReply:13,
			
			childSuicideRequest:95,
			parentKillNotice:98,
			childKillReply:99		
		},
		message:{
	
			startWorker:function(){
				return {
							"code":root.ipc.code.startWorker
					};
			},
			
			workerAlive:function(){
				return {
							"code":root.ipc.code.workerAlive1
					};
			},
			
			configureWorker:function(	child_pid,data_id,data_type,data_config,ssl_key,
										ssl_cert,ssl_ca
			){
				return {
						"code":root.ipc.code.configureWorker,
						"pid":child_pid,
						"data":{
							"id":data_id,
							"type":data_type,
							"config":data_config,
							"ssl":{
								"key":ssl_key,
								"cert":ssl_cert,
								"ca_cert":ssl_ca
							}
						}
					}
			},
			
			workerOnline:function(){
				return {
							"code":root.ipc.code.workerOnline
					};
			},
			
			workerFailed:function(){
				return {
						"code":root.ipc.code.workerFailed
					};
			},
			
			watchdogPingRequest:function(){
				return {
						"code":root.ipc.code.watchdogPingRequest,
						"data":(new Data).getTime()
					};
			},
			
			childSuicide:function(){
				return {
						"code":95
					};
			}
		},
		/*
			Nemesis IPC Message Validators
		*/
		
		isValidError:function(message){
			return root.type.isObject(message)?true:false;
		},
		
		isValidMsg:function(message){
			if(!root.type.isObject(message)){
				root.error.raise(
					root.error.messages.modules.core.ipc.notSet,
					typeof(message)
				);
			}
			if(!root.type.isNumber(message.code)){
				root.error.raise(
					root.error.messages.modules.core.ipc.codeNotNum,
					typeof(message.code)
				);
			}
			switch(message.code){
		
				case root.ipc.code.startWorker:
					return true;
					break;
				
				case root.ipc.code.workerAlive:
					return true;
					break;
				
				case root.ipc.code.configureWorker:
					switch(true){
						case ( !root.type.isObject(message.data) ):
							root.error.raise(
								root.error.messages.ipc.configureWorker.nonObjectData,
								typeof(message.data)
							);
						case ( !root.type.isNumber(message.data.id) ):
							root.error.raise(
								root.error.messages.ipc.configureWorker.nonNumberId,
								typeof(message.data.id)
							);
						case ( !root.type.isString(message.data.type) ):
							root.error.raise(
								root.error.messages.ipc.configureWorker.nonStringType,
								typeof(message.data.type)
							);
						case ( !root.type.isString(message.data.config) ):
							root.error.raise(
								root.error.messages.ipc.configureWorker.nonObjectConfig,
								typeof(message.data.config)
							);
						case (!root.type.isNumber(message.data.config.workerId)):
							root.error.raise(
								root.error.messages.ipc.configureWorker.nonNumberWorkerId,
								typeof(message.data.config.workerId)
							);
						case (!root.type.isIPaddress(message.data.config.ipAddress)):
							root.error.raise(
								root.error.messages.ipc.configureWorker.invalidIPaddress,
								typeof(message.data.config.ipAddress)
								+" ["+message.data.config.ipAddress+"]")
							);
						case (!root.type.isNetworkPort(message.data.config.ipPort)):
							root.error.raise(
								root.error.messages.ipc.configureWorker.invalidIPport,
								typeof(message.data.config.ipPort)
							);
							return false;
							break;
						default:
							return true;
							break;
								

				log.write(MSG_CD2_D_CORRECT);
				return true;
				break;
						
			case 3:return true;break;/*{code:3}*/
			case 4:return true;break;/*{code:4}*/
			
			case 5:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 6:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 7:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 8:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 9:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
	
			/* {code:[10-11]} heartbeat.  p(10)->c(11)->p */
			case 10:return true;break;/*{code:10}*/
			case 11:/*code:11,data:<timestamp>*/
				isUndefined(m.data,E_M_CD11_D_UNDEF);
				typeCheck(m.data,TNUM,E_M_CD11_D_NAN);
				return true;
				break;				
	
			case 12:return true;break;
			case 13:
				isUndefined(m.data,E_M_CD13_D_UNDEF);
				typeCheck(m.data,TOBJ,E_M_CD13_D_NOT_OBJ);
				return true;
				break;
			case 95:return true;break;
			case 96:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 97:throw new Error(E_M_NOT_IMPLEMENTED+":msg="+m);return false;break;
			case 98:return true;break;
			case 99:return true;break;
			default:
				throw new Error(E_M_UNKNOWN_CODE);
				return false;
				break;
		}/*end of switch()*/
	}	
}
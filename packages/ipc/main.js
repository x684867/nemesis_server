/*
	Nemesis Interprocess Message Helper
	/srv/nemesis/packages/ipc/main.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
	
	
 */
package.exports=init;
/* */

/* */
function typeCheck(d,t,e){if(typeof(d)!=t) throw new Error(e);}
/* */

function init(){ }
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
					root.error.messages.packages.core.ipc.notSet,
					typeof(message)
				);
			}
			if(!root.type.isNumber(message.code)){
				root.error.raise(
					root.error.messages.packages.core.ipc.codeNotNum,
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
								+" ["+message.data.config.ipAddress+"]"
							);
						case (!root.type.isNetworkPort(message.data.config.ipPort)):
							root.error.raise(
								root.error.messages.ipc.configureWorker.invalidIPport,
								typeof(message.data.config.ipPort)
							);
							return false;
							break;
							/*
								Add the SSL information.
							*/
						default:
							return true;
							break;
					}
					break;			
						
			case workerOnline:
				return true;
				break;
				
			case workerFailed:
				return true;
				break;

			case watchdogPingRequest:
				return true;
				break;
				
			case workerPingReply:
				isUndefined(m.data,E_M_CD11_D_UNDEF);
				typeCheck(m.data,TNUM,E_M_CD11_D_NAN);
				return true;
				break;				
	
			case statsRequest:
				return true;
				break;
				
			case workerStatsReply:
				isUndefined(m.data,E_M_CD13_D_UNDEF);
				typeCheck(m.data,TOBJ,E_M_CD13_D_NOT_OBJ);
				return true;
				break;
				
			case childSuicideRequest:
				return true;
				break;			
			
			case parentKillNotice:
				return true;
				break;
				
			case childKillReply:
				return true;
				break;
				
			default:
				throw new Error(E_M_UNKNOWN_CODE);
				return false;
				break;
		}
	}	
}
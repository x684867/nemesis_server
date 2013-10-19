/*
	Nemesis Interprocess Message Helper
	/srv/nemesis/core/core.messages.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
	
	
 */
module.exports=message_handler;
/* */

/* */
function typeCheck(d,t,e){if(typeof(d)!=t) throw new Error(e);}
function isUndefined(d,e){if(typeof(d)=='undefined') throw new Error(e);}
/* */

function message_handler(){ }
	/*
		IPC Code values.
	*/
	root.ipc.code={
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
	}
	/*
		Nemesis IPC Message Generators
	*/
	root.ipc.message={
	
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
		
		configureWorker:function(child_pid,data_id,data_type,data_config,ssl_key,ssl_cert,ssl_ca){
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
	}

	
	
	/*Nemesis IPC Message Validators*/
	
	validator.isValidError=function(m){return (typeof(m)==TOBJ)?true:false;},
	validator.isValidMsg=function(m){
		typeCheck(m,TOBJ,E_M_NOT_OBJ);
		isUndefined(m.code,E_M_CD_NOT_SET);
		typeCheck(m.code,TNUM,E_M_CD_NOT_NUM);
		switch(m.code){
		
		/*Server Instantiation handshake {Code:[0-4]}*/
		case 0:return true;break;/*{code:0}*/
		case 1:return true;break;/*{code:1}*/
		case 2:
			typeCheck(m.data,TOBJ,E_M_CD2_NON_OBJ);
			typeCheck(m.data,TOBJ,E_M_CD2_NON_OBJ);
			isUndefined(m.data.id,E_M_CD2_D_ID_UNDEF);
			isUndefined(m.data.type,E_M_CD2_D_TYPE_UNDEF);
			isUndefined(m.data.config,E_M_CD2_D_CFG_UNDEF);
			typeCheck(m.data.id,TNUM,E_M_CD2_D_ID_NAN);
			typeCheck(m.data.type,TSTR,E_M_CD2_D_TYPE_NSTR);
			typeCheck(m.data.config,TOBJ,E_M_CD2_CFG_NAO);
			isUndefined(m.data.config.workerId,E_M_CD2_CFG_WID_UNDEF);
			isUndefined(m.data.config.ipAddress,E_M_CD2_CFG_IP_UNDEF);
			isUndefined(m.data.config.ipPort,E_M_CD2_CFG_PORT_UNDEF);
			typeCheck(m.data.config.workerId,TNUM,E_M_CD2_CFG_ID_NAN);
			typeCheck(m.data.config.ipAddress,TSTR,E_M_CD2_CFG_IP_NSTR);
			typeCheck(m.data.config.ipPort,TNUM,E_M_CD2_CFG_PORT_NAN);
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
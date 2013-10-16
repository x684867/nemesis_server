/*
 	Message Router API Calls
 	/srv/nemesis/app/servers/broker/msgRouterAPI.js
 	(c) 2013 Sam Caldwell.  All Rights Reserved.
 	
 	This file exports the functions needed by msgRouter.js
 
 */
 
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

module.exports=webSend;
function webSend(res,response){
	if(typeof(response)=='object'){
		res.writeHead(	response.code,
						{	'content-type':'application/json',
							'content-length':response.message.length,
							'connection':'close'
						}
		);
		res.end(response.message);
	}else{
		throw new Error(E_INV_WEBSEND_RESPONSE);
	}
}

module.exports=sendErrorMsg;
function sendErrorMsg(res,c){
	webSend(res,c,{"code":c,"message":require('http').STATUS_CODE[c];});
}

module.exports=api_create_account;
function api_create_account(c){
	if( require(OBJECT_VERIFY_CLASS).isDataValid('account',c.message) ){
		webSend( c.res , require(c.msgProcFile).createNewAccountObject(c.message) );
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_create_object;
function api_create_object(c){
	if( require(UUID_VERIFY_CLASS).isValidUUID('account',c.message) ){
		if( require(OBJECT_VERIFY_CLASS).isDataValid('object',c.message) ){
			webSend( c.res , require(c.msgProcFile).createNewDataObject(c.message) );
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTDATA);
		}					
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_create_policy;
function api_create_policy(c){	
	var uv=require(UUID_VERIFY_CLASS);	
	if(uv.isValidUUID('account',c.message)){
		if(uv.isValidUUID('object',c.message)){
			if(require(OBJECT_VERIFY_CLASS).isDataValid('policy',c.message)){
				webSend( c.res,require(c.msgProcFile).createNewPolicyObject(c.message) );
			}else{
				sendErrorMsg(c.res,E_INV_POLICYDATA);
			}
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_create_policy;
function api_create_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('object',c.message)){
		if(require(OBJECT_VERIFY_CLASS).isDataValid('event',c.message)){
			webSend( c.res , require(c.msgProcFile).createNewAuditEvent(c.message) );
		}else{
			sendErrorMsg(c.res,E_INV_EVENT_DATA);					
		}
	}else{
		sendErrorMsg(c.res,E_INV_OBJECTID);	
	}		
}

module.exports=api_read_account;
function api_read_account(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('account',c.message)){
		webSend(c.res,require(c.msgProcFile).readAccountData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_read_object;
function api_read_object(c){
	var uv=require(UUID_VERIFY_CLASS);
	if(uv.isValidUUID('account',c.message)){
		if(uv.isValidUUID('object',c.message)){
			webSend( c.res , require(c.msgProcFile).readObjectData(c.message) );
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(c.res,E_INV_OBJECTID);
	}
}

module.exports=api_read_policy;
function api_read_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('policy',c.message)){
		webSend(c.res,require(c.msgProcFile).readPolicyData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_POLICYID);
	}
}

module.exports=api_read_audit_events;
function api_read_audit_event(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('audit',message)){
		webSend(c.res,require(c.msgProcFile).readEventData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_AUDITID);
	}
}

module.exports=api_read_policy_list;
function api_read_policy_list(c){
	var uv=require(UUID_VERIFY_CLASS);
	if(uv.isValidUUID('account',c.message)){
		if(uv.isValidUUID('object',c.message){
			webSend(c.res,require(c.msgProcFile).readPolicyList(c.message));
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_update_account
function api_update_account(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('account',c.message)){
		if(require(OBJECT_VERIFY_CLASS).isDataValid('account',c.message)){
			webSend(c.res,require(c.msgProcFile).updateAccount(c.message));
		}else{
			sendErrorMsg(c.res,E_INV_ACCOUNTDATA);
		}
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_update_object
function api_update_object(c){
	var uv=require(UUID_VERIFY_CLASS);
	if(uv.isValidUUID('account',c.message)){
		if(uv.isValidUUID('object',c.message)){
			ifrequire(OBJECT_VERIFY_CLASS).isDataValid('object',c.message)){
				webSend(c.res,require(c.msgProcFile).updateDataObject(c.message));
			}else{
				sendErrorMsg(c.res,E_INV_OBJECTDATA);
			}
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_update_policy
function api_update_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('policy',c.message)){
		if(require(OBJECT_VERIFY_CLASS).isDataValid('policy',c.message)){
			webSend(c.res,require(c.msgProcFile).updatePolicyObject(c.message));
		}else{
			sendErrorMsg(c.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_delete_object
function api_delete_object(c){
	var uv=require(UUID_VERIFY_CLASS);
	if(uv.isValidUUID('account',c.message)){

		webSend(c.res,require(c.msgProcFile).deleteDataObject(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

module.exports=api_delete_policy
function api_delete_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('policy',c.message)){
		webSend(c.res,require(c.msgProcFile).deletePolicyObject(c.message));
	}else{
		sendErrorMsg(config.res,E_INV_POLICYID);
	}
}
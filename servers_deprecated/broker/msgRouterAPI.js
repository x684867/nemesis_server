/*
 	Message Router API Calls
 	/srv/nemesis/app/servers/broker/msgRouterAPI.js
 	(c) 2013 Sam Caldwell.  All Rights Reserved.
 	
 	This file exports the functions needed by msgRouter.js
 
 */

const WEBSTATSCLASS='/srv/nemesis/app/server/web/webStats.js';
const OBJECT_VERIFY_CLASS='/srv/nemesis/app/library/objectVerify.js';
const UUID_VERIFY_CLASS='/srv/nemesis/app/library/uuidVerify.js';

const TOBJ='object';
const TSTR='string';
const TNUM='number';
const TBOOL='boolean';
const TFUNC='function';

const E_INV_ACCOUNTID=400;
const E_INV_OBJECTID=400;
const E_INV_POLICYID=400;
const E_INV_AUDIT_ID=400;

const E_INV_ACCTDATA=400;
const E_INV_OBJECTDATA=400;
const E_INV_POLICYDATA=400;
const E_INV_EVENTDATA=400;

const E_INV_POLICYDATA='Error: Invalid PolicyData object';
const E_INV_EVENT_DATA='Error: Invalid Event Data Object.';

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
function sendErrorMsg(res,c){
	webSend(res,c,{"code":c,"message":require('http').STATUS_CODE[c];});
}

package.exports=unknownRoute;
function unknownRoute(c){sendErrorMsg(c.res,400);}

package.exports=create_account;
function create_account(c){
	if( require(OBJECT_VERIFY_CLASS).isDataValid('account',c.message) ){
		webSend( c.res , require(c.msgProcFile).createNewAccountObject(c.message) );
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

package.exports=create_object;
function create_object(c){
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

package.exports=create_policy;
function create_policy(c){	
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

package.exports=create_policy;
function create_policy(c){
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

package.exports=read_account;
function read_account(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('account',c.message)){
		webSend(c.res,require(c.msgProcFile).readAccountData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

package.exports=read_object;
function read_object(c){
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

package.exports=read_policy;
function read_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('policy',c.message)){
		webSend(c.res,require(c.msgProcFile).readPolicyData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_POLICYID);
	}
}

package.exports=read_audit_events;
function read_audit_event(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('audit',message)){
		webSend(c.res,require(c.msgProcFile).readEventData(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_AUDITID);
	}
}

package.exports=read_policy_list;
function read_policy_list(c){
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

package.exports=update_account
function update_account(c){
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

package.exports=update_object
function update_object(c){
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

package.exports=update_policy
function update_policy(c){
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

package.exports=delete_object
function delete_object(c){
	var uv=require(UUID_VERIFY_CLASS);
	if(uv.isValidUUID('account',c.message)){

		webSend(c.res,require(c.msgProcFile).deleteDataObject(c.message));
	}else{
		sendErrorMsg(c.res,E_INV_ACCOUNTID);
	}
}

package.exports=delete_policy
function delete_policy(c){
	if(require(UUID_VERIFY_CLASS).isValidUUID('policy',c.message)){
		webSend(c.res,require(c.msgProcFile).deletePolicyObject(c.message));
	}else{
		sendErrorMsg(config.res,E_INV_POLICYID);
	}
}
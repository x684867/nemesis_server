/*

	Message Router Class (Broker)
	/srv/nemesis/app/servers/broker/msgRouter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.

	This is the HTTP message router which parses, verifies and routes HTTP inputs.
	The results are then processed by a context-specific message processor.
	
	See "Nemesis Message Router Class Specification"
		
	============================================================	
	JSON "config" parameter:
	============================================================
		{
			id:<workerId>,
			msgRouter:<file/path to message router>
			msgProc:<file/path to  message processor>
			net:{
					port:<tcp port number>,
					ip:<ipv4 address>
			},
			ssl:{
					key:<key path/fname>,
					cert:<certificate path/fname>,
					ca:<ca certificate path/fname>
			}
		}
	============================================================
	JSON "message" parameter:
	============================================================
		{
			code:<number>,
			<context-based objects>
		}
*/
module.exports=msgRouterClass;

const WEBSTATSCLASS='/srv/nemesis/app/server/web/webStats.js';
const OBJECT_VERIFY_CLASS='/srv/nemesis/app/server/broker/objectVerify.js';

const TOBJ='object';
const TSTR='string';
const TNUM='number';
const TBOOL='boolean';
const TFUNC='function';

/*API CREATE OPERATIONS*/
const API_CREATE_ACCOUNT=0;
const API_CREATE_OBJECT=1;
const API_CREATE_POLICY=2;
const API_CREATE_AUDIT_EVENT=3;

/*API READ OPERATIONS*/
const API_READ_ACCOUNT=10;
const API_READ_OBJECT=11;
const API_READ_POLICY=12;
const API_READ_AUDIT_EVENT=13;
const API_READ_POLICY_LIST=14;

/*API UPDATE OPERATIONS*/
const API_UPDATE_ACCOUNT=20;
const API_UPDATE_OBJECT=21;
const API_UPDATE_POLICY=22;

/*API DELETE OPERATIONS*/
const API_DELETE_OBJECT=30;
const API_DELETE_POLICY=31;

const E_MSG_UNKNOWN_CODE='Error: Message contains an unknown operation code.';
const E_MSG_NOT_OBJECT='Error: message is not an object.';
const E_MSG_NOT_NUMBER='Error: message.code is not a number.';
const E_INV_WEBSEND_RESPONSE='Fatal Error: router.websend() expected response object.';

const E_INV_ACCOUNTID={"code":400,"message":"Bad Request Invalid accountId"};
const E_INV_OBJECTID={"code":400,"message":"Bad Request Invalid ObjectId"};
const E_INV_POLICYID={"code":400,"message":"Bad Request Invalid PolicyId"};
const E_INV_AUDIT_ID={"code":400,"message":"Bad Request Invalid AuditId"};

const E_INV_ACCTDATA={"code":400,"message":"Bad Request Invalid accountData"};
const E_INV_OBJECTDATA={"code":400,"message":"Bad Request Invalid objectData"};
const E_INV_POLICYDATA={"code":400,"message":"Bad Request Invalid policyData"};
const E_INV_EVENTDATA={"code":400,"message":"Bad Request Invalid eventData"};

const E_INV_POLICYDATA='Error: Invalid PolicyData object';
const E_INV_EVENT_DATA='Error: Invalid Event Data Object.';
/*
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
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
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
/*	
	webSend requires a JSON object input (response):
	
		{"code":<number>,"message":<object>}
 */
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
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function sendErrorMsg(res,c){
	webSend(res,c,{"code":c,"message":require('http').STATUS_CODE[c];});
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_create_account(config){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidData('accountData',config.message.accountData)){
		webSend( config.res , msgProc.createNewAccountObject(config.message) );
	}else{
		sendErrorMsg(config.res,E_INV_ACCOUNTID);
	}
}
/* 
--- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
*/
function api_create_object(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('accountId',config.message.accountId)){
		if(ov.isValidObject('objectData',config.message.objectData)){
			webSend(config.res,msgProc.createNewDataObject(config.message));
		}else{
			sendErrorMsg(config.res,E_INV_OBJECTDATA);
		}					
	}else{
		sendErrorMsg(config.res,E_INV_ACCOUNTID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_create_policy(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('accountId',config.message.accountId)){
		if(ov.isValidUUID('objectId',config.message.objectId)){
			if(ov.isValidObject('policyData',config.message.policyData)){
				webSend(config.res,msgProc.createNewPolicyObject(config.message));
			}else{
				sendErrorMsg(config.res,E_INV_POLICYDATA);
			}
		}else{
			sendErrorMsg(config.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(config.res,E_INV_ACCOUNTID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_create_policy(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('objectId',config.message.objectId)){
		if(ov.isValidObject('eventData',config.message.eventData)){
			webSend(config.res,msgProc.createNewAuditEvent(config.message));
		}else{
			sendErrorMsg(config.res,E_INV_EVENT_DATA);					
		}
	}else{
		sendErrorMsg(config.res,E_INV_OBJECTID);			
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_read_account(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('accountId',config.message.accountId)){
		webSend(config.res,msgProc.readAccountData(config.message));
	}else{
		sendErrorMsg(config.res,E_INV_ACCOUNTID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_read_object(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('accountId',config.message.accountId)){
		if(ov.isValidUUID('objectId',config.message.objectId)){
			webSend(config.res,msgProc.readObjectData(config.message));
		}else{
			sendErrorMsg(config.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(config.res,E_INV_OBJECTID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_read_policy(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('policyId',config.message.policyId)){
		webSend(config.res,msgProc.readPolicyData(config.message));
	}else{
		sendErrorMsg(config.res,E_INV_POLICYID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_read_audit_event(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('auditId',message.auditId){
		webSend(config.res,msgProc.readEventData(config.message));
	}else{
		sendErrorMsg(config.res,E_INV_AUDITID);
	}
}
/* 
 --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
 */
function api_read_policy_list(message){
	
	var objectVerify=require(OBJECT_VERIFY_CLASS);
	var ov=new objectVerify();
	
	var msgProcClass=require(config.msgProcFile);
	var msgProc=new msgProcClass();
	
	if(ov.isValidUUID('accountId',config.message.accountId){
		if(ov.isValidUUID('objectId',config.message.objectId){
			webSend(config.res,msgProc.readPolicyList(config.message));
		}else{
			sendErrorMsg(config.res,E_INV_OBJECTID);
		}
	}else{
		sendErrorMsg(config.res,E_INV_ACCOUNTID);
	}
}
/* --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- */
/* 	msgRouterClass()															   */
/* --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- */
function msgRouterClass(config){
	var msgProcessorClass=require(config.msgProc);
	this.route=function(req,res,message){
		/*
			Route a given HTTP request to a context-specific message processor.
		 */
		if(typeof(message)==TOBJ) throw new Error(E_MSG_NOT_OBJECT);
		if(typeof(message.code)==TNUM) throw new Error(E_MSG_NOT_NUMBER);
		
		config.req=req;
		config.res=res;
		config.message=message;
		
		switch(message.code){
			/* ------------------------------------------------------------------
				CREATE OPERATIONS
			   ------------------------------------------------------------------ */
			case API_CREATE_ACCOUNT: 		api_create_account(config);break;
			case API_CREATE_OBJECT: 		api_create_object(config); break;
			case API_CREATE_POLICY: 		api_create_policy(config); break;
			case API_CREATE_AUDIT_EVENT: 	api_create_policy(config); break;
			/* ------------------------------------------------------------------
				READ OPERATIONS
			   ------------------------------------------------------------------ */
			case API_READ_ACCOUNT: 		api_read_account(config); break;
			case API_READ_OBJECT: 		api_read_object(config); break;
			case API_READ_POLICY: 		api_read_policy(config); break;
			case API_READ_AUDIT_EVENT: 	api_read_audit_event(config); break;
			case API_READ_POLICY_LIST: 	api_read_policy_list(config); break;
			/* ------------------------------------------------------------------
				UPDATE OPERATIONS
			   ------------------------------------------------------------------ */
			case API_UPDATE_ACCOUNT: 	api_update_account(config); break;
			case API_UPDATE_OBJECT: 	api_update_object(config); break;
			case API_UPDATE_POLICY: 	api_update_policy(config); break;
			/* ------------------------------------------------------------------
				DELETE OPERATIONS
			   ------------------------------------------------------------------ */ 
			case API_DELETE_OBJECT: 	api_delete_object(config); break;
			case API_DELETE_POLICY: 	api_delete_policy(config); break;
			/* ------------------------------------------------------------------ */
			default: this.sendErrorMsg(E_MSG_UNKNOWN_CODE); break;
			/* ------------------------------------------------------------------ */
		}
	}
}
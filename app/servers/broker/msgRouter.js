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

const E_MSG_NOT_OBJECT='Error: message is not an object.';
const E_MSG_NOT_NUMBER='Error: message.code is not a number.';
const E_INV_WEBSEND_RESPONSE='Fatal Error: router.websend() expected response object.';

const E_INV_ACCTID={"code":400,"message":"Bad Request Invalid accountId"};
const E_INV_OBJECTID={"code":400,"message":"Bad Request Invalid ObjectId"};
const E_INV_POLICYID={"code":400,"message":"Bad Request Invalid PolicyId"};
const E_INV_AUDIT_ID={"code":400,"message":"Bad Request Invalid AuditId"};

const E_INV_ACCTDATA={"code":400,"message":"Bad Request Invalid accountData"};
const E_INV_OBJECTDATA={"code":400,"message":"Bad Request Invalid objectData"};
const E_INV_POLICYDATA={"code":400,"message":"Bad Request Invalid policyData"};
const E_INV_EVENTDATA={"code":400,"message":"Bad Request Invalid eventData"};

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
/*

*/
function msgRouterClass(config){

	var msgProcessorClass=require(config.msgProc);
	
	this.msgProc=new msgProcessorClass(config);
	
	this.webSend=function(res,response){
		if(typeof(response)!='object') throw new Error(E_INV_WEBSEND_RESPONSE);
		res.writeHead(	response.code,
						{	'content-type':'application/json',
							'content-length':response.message.length,
							'connection':'close'
						}
		);
		res.end(response.message);
	}
	/* */
	this.sendErrorMsg(res,c){
		this.webSend(res,c,{"code":c,"message":require('http').STATUS_CODE[c];});
	}
	/* */
	this.route=function(req,res,message){
		/*
			Route a given HTTP request to a context-specific message
			processor.
		 */
		if(typeof(message)==TOBJ) throw new Error(E_MSG_NOT_OBJECT);
		/* */
		if(typeof(message.code)==TNUM) throw new Error(E_MSG_NOT_NUMBER);
		/* */
		switch(message.code){
			/* */	
			/* ------------------------------------------------------------------
				CREATE OPERATIONS
			   ------------------------------------------------------------------ */
			case API_CREATE_ACCOUNT:
				/* */
				if(this.isValidAccountData(message.accountData)){
					this.webSend(res,this.msgProc.createNewAccountObject(message));}
				}else{
					this.sendErrorMsg(res,E_INV_ACCTDATA);
				}
				break;
				/* */
			case API_CREATE_OBJECT:
				/* */
				if(this.isValidUUID('accountId',message.accountId)){
					if(this.isValidObject('objectData',message.objectData)){
						this.webSend(res,this.msgProc.createNewDataObject(message));
					}else{
						this.sendErrorMsg(res,E_INV_OBJECTDATA);
					}					
				}else{
					this.sendErrorMsg(res,E_INV_ACCTID);
				}
				break;
				/* */
			case API_CREATE_POLICY:
				/* */
				if(this.isValidUUID('accountId',message.accountId)){
					if(this.isValidUUID('objectId',message.objectId)){
						if(this.isValidObject('policyData',message.policyData)){
							this.webSend(res,this.msgProc.createNewPolicyObject(message));
						}else{
							this.sendErrorMsg(res,E_INV_POLICYDATA);
						}
					}else{
						this.sendErrorMsg(res,E_INV_OBJECTID);
					}
				}else{
					this.sendErrorMsg(res,E_INV_ACCTID);
				}
				break;
				/* */			
			case API_CREATE_AUDIT_EVENT:
				/* */
				if(this.isValidUUID('objectId',message.objectId)){
					if(this.isValidEventData('eventData',message.eventData)){
						this.webSend(res,this.msgProc.createNewAuditEvent(message));
					}else{
						this.sendErrorMsg(res,E_INV_EVENT_DATA);					
					}
				}else{
					this.sendErrorMsg(res,E_INV_OBJECTID);			
				}
				break;
				/* ------------------------------------------------------------------
					READ OPERATIONS
				   ------------------------------------------------------------------ */
			case API_READ_ACCOUNT:
				/* */
				if(this.isValidUUID('accountId',message.accountId)){
					this.webSend(res,this.msgProc.readAccountData(message));
				}else{
					this.sendErrorMsg(res,E_INV_ACCTID);
				}
				break;
				/* */
			case API_READ_OBJECT:
				/* */
				if(this.isValidUUID('accountId',message.accountId)){
					if(this.isValidUUID('objectId',message.objectId)){
						this.webSend(res,this.msgProc.readObjectData(message));
					}else{
						this.sendErrorMsg(res,E_INV_OBJECTID);
					}
				}else{
					this.sendErrorMsg(res,E_INV_OBJECTID);
				}
				break;
				/* */				
			case API_READ_POLICY:
				/* */
				if(this.isValidUUID('policyId',message.policyId)){
					this.webSend(res,this.msgProc.readPolicyData(message));
				}else{
					this.sendErrorMsg(res,E_INV_POLICYID);
				}
				break;
				/* */
			case API_READ_AUDIT_EVENT:
				/* */
				if(this.isValidUUID('auditId',message.auditId){
					this.webSend(res,this.msgProc.readEventData(message));
				}else{
					this.sendErrorMsg(res,E_INV
				}
				/* */
			case API_READ_POLICY_LIST:
				/* */
				/* ------------------------------------------------------------------
					UPDATE OPERATIONS
				   ------------------------------------------------------------------ */
			case API_UPDATE_ACCOUNT:
				/* */
				
				/* */
			case API_UPDATE_OBJECT:
				/* */
				
				/* */
			case API_UPDATE_POLICY:
				/* */
				/* ------------------------------------------------------------------
					DELETE OPERATIONS
				   ------------------------------------------------------------------ */
			case API_DELETE_OBJECT:
				/* */
				
				/* */
			case API_DELETE_POLICY:
				/* */
				
				/* */
			default:
				this.sendErrorMsg(404);
		}
	}
	this.isValidUUID=function(uuidType,uuid){
		/*
				This method must first determine if a uuid is a valid-formatted 
				UUID string then it must look up that string in the UUID index
				found at /srv/nemesis/store/index and verify that the UUID is 
				of the same type as the input uuidType passed to the method.
		 */
		return true;
	}
	this.isValidAccountData=function(accountData){return true;}
	this.isValidObjectData=function(objectData){return true;}
	
}
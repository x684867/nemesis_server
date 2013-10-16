/*
	Message Router Class (Broker)
	/srv/nemesis/app/servers/broker/msgRouter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
*/
module.exports=msgRouterClass;

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


const E_MSG_NOT_OBJECT='Error: message is not an object.';
const E_MSG_NOT_NUMBER='Error: message.code is not a number.';
const E_INV_WEBSEND_RESPONSE='Fatal Error: router.websend() expected response object.';

const ROUTER_API_LIBRARY='/srv/nemesis/app/servers/broker/msgRouterAPI.js';

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

function msgRouterClass(config){

	var msgProcessorClass=require(config.msgProc);
	
	this.route=function(req,res,message){
		if(typeof(message)==TOBJ) throw new Error(E_MSG_NOT_OBJECT);
		if(typeof(message.code)==TNUM) throw new Error(E_MSG_NOT_NUMBER);
		
		config.req=req;				/*Add req, res and message objects to config.*/
		config.res=res;
		config.message=message;
		
		var api=require(ROUTER_API_LIBRARY);
		
		switch(message.code){
			/* ------------------------------------------------------------------
				CREATE OPERATIONS
			   ------------------------------------------------------------------ */
			case API_CREATE_ACCOUNT: 		api.create_account(config);break;
			case API_CREATE_OBJECT: 		api.create_object(config); break;
			case API_CREATE_POLICY: 		api.create_policy(config); break;
			case API_CREATE_AUDIT_EVENT: 	api.create_policy(config); break;
			/* ------------------------------------------------------------------
				READ OPERATIONS
			   ------------------------------------------------------------------ */
			case API_READ_ACCOUNT: 		api.read_account(config); break;
			case API_READ_OBJECT: 		api.read_object(config); break;
			case API_READ_POLICY: 		api.read_policy(config); break;
			case API_READ_AUDIT_EVENT: 	api.read_audit_event(config); break;
			case API_READ_POLICY_LIST: 	api.read_policy_list(config); break;
			/* ------------------------------------------------------------------
				UPDATE OPERATIONS
			   ------------------------------------------------------------------ */
			case API_UPDATE_ACCOUNT: 	api.update_account(config); break;
			case API_UPDATE_OBJECT: 	api.update_object(config); break;
			case API_UPDATE_POLICY: 	api.update_policy(config); break;
			/* ------------------------------------------------------------------
				DELETE OPERATIONS
			   ------------------------------------------------------------------ */ 
			case API_DELETE_OBJECT: 	api.delete_object(config); break;
			case API_DELETE_POLICY: 	api.delete_policy(config); break;
			/* ------------------------------------------------------------------ */
			default: api.unknownRoute(config); break;
			/* ------------------------------------------------------------------ */
		}
	}
}
/*
	General Message Validator 
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
 */
module.exports=validatorClass;

const LOGGER_SOURCE='lib.msgValidator';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';

const TOBJ='object';
const TSTR='string';
const TNUM='number';

const E_M_CD_NOT_SET='Message code is undefined {msg.code}';
const E_M_CD_NOT_NUM='Message code is not a number {msg.code}';
const E_M_CD2_NON_OBJ='{code:2,data:<non-object>}';
const E_M_CD2_D_ID_UNDEF='{code:2,data:{id:<undefined>}}';
const E_M_CD2_D_TYPE_UNDEF='{code:2,data:{type:<undefined>}}';
const E_M_CD2_D_CFG_UNDEF='{code:2,data:{config:<undefined>}}';
const E_M_CD2_D_ID_NAN='{code:2,data:{id:<non-number>}}';
const E_M_CD2_D_TYPE_NSTR='{code:2,data:{type:<non-string>}}';
const E_M_CD2_CFG_NAO='{code:2,data:{type:<non-object>}}';
const E_M_CD2_CFG_WID_UNDEF='{code:2,data:{config.workerId:<undefined>}}';
const E_M_CD2_CFG_IP_UNDEF='{code:2,data:{config.ipAddress:<non-string>}}';
const E_M_CD2_CFG_PORT_UNDEF='{code:2,data:{config.ipPort:<non-number>}}';
const E_M_CD2_CFG_ID_NAN='{code:2,data:{config.workerId:<not number>}}';
const E_M_CD2_CFG_IP_NSTR='{code:2,data:{config.ipAddress:<not string>}}';
const E_M_CD2_CFG_PORT_NAN='{code:2,data:{config.ipPort:<not number>}}';
const E_M_CD11_D_NON_OBJ='{code:11,data:<not number>}';
const E_M_CD11_D_UNDEF='{code:11,data:<undefined>}';
const E_M_CD13_D_NOT_OBJ="Msg {code:13} data property is non-array.";
const E_M_CD13_D_UNDEF="Msg {code:13} lacks data property.";
const E_M_UNKNOWN_CODE="Unknown msg code encountered.";
const E_M_NOT_OBJ='Message is not an object';
/*
 */
const MSG_CD2_D_CORRECT='{code:2,data:<object>} is correctly formatted.';

function validatorClass(){
	logger=require(LOGGER_CLASS);;
	this.log=new logger(LOGGER_SOURCE);	
	this.isValidError=function(msg) return (typeof(msg)=='object')?true:false;
	this.typeCheck=function(d,t,e){if(typeof(d)!=t) throw new Error(e);}
	this.isUndefined=function(d,e){if(typeof(d)=='undefined') throw new Error(e);}
	this.isValidMsg=function(m){
		if(typeof(m)==TOBJ){
			log.write("msg is object.\n  Dumping:"+JSON.stringify(m));
			if(m.code==undefined) throw new Error(E_MSG_CD_NOT_SET);
			if(typeof(m.code)!=TNUM) throw new Error(E_MSG_CD_NOT_NUM);
			log.write("eval msg.code value {code:"+m.code+"}");
			switch(m.code){
				case 0:return true;break;
				case 1:return true;break;
				case 2:
					this.typeCheck(m.data,TOBJ,E_M_CD2_NON_OBJ);
					this.typeCheck(m.data,TOBJ,E_M_CD2_NON_OBJ);
					this.isUndefined(m.data.id,E_M_CD2_D_ID_UNDEF);
					this.isUndefined(m.data.type,E_M_CD2_D_TYPE_UNDEF);
					this.isUndefined(m.data.config,E_M_CD2_D_CFG_UNDEF);
					this.typeCheck(m.data.id,TNUM,E_M_CD2_D_ID_NAN);
					this.typeCheck(m.data.type,TSTR,E_M_CD2_D_TYPE_NSTR);
					this.typeCheck(m.data.config,TOBJ,E_M_CD2_CFG_NAO);
					this.isUndefined(m.data.config.workerId,E_M_CD2_CFG_WID_UNDEF);
					this.isUndefined(m.data.config.ipAddress,E_M_CD2_CFG_IP_UNDEF);
					this.isUndefined(m.data.config.ipPort,E_M_CD2_CFG_PORT_UNDEF)
					this.typeCheck(m.data.config.workerId,TNUM,E_M_CD2_CFG_ID_NAN);
					this.typeCheck(m.data.config.ipAddress,TSTR,E_M_CD2_CFG_IP_NSTR);
					this.typeCheck(m.data.config.ipPort,TNUM,E_M_CD2_CFG_PORT_NAN);
					log.write(MSG_CD2_D_CORRECT);
					return true;
					break;				
				case 3:return true;break;
				case 4:return true;break;
				case 10:return true;break;
				case 11:
					this.isUndefined(m.data,E_M_CD11_D_UNDEF);
					this.typeCheck(m.data,TNUM,E_M_CD11_D_NON_OBJ);
					return true;
					break;					
				case 12:return true;break;
				case 13:
					this.isUndefined(m.data,E_M_CD13_D_UNDEF);
					this.typeCheck(m.data,TOBJ,E_M_CD13_D_NOT_OBJ);
					return true;
					break;
				default:
					throw new Error(E_M_UNKNOWN_CODE);
					return false;
					break;
			}/*end of switch()*/
		}
		throw new Error(E_M_NOT_OBJ);
	}
}
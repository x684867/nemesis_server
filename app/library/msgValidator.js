/*
	General Message Validator 
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
 */
module.exports=validatorClass;

const LOGGER_SOURCE='lib.msgValidator';
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js';
global.logger=require(LOGGER_CLASS);


function validatorClass(){
	this.isValidError=function(msg){
		return (typeof(msg)=='object')?true:false;
		/*
			Todo: Define error message formats and inspection code.
		 */
	}
	this.typeCheck=function(d,t,e){if(typeof(d)!=t) throw new Error(e);}
	this.isUndefined=function(d,e){if(typeof(d)=='undefined') throw new Error(e);}
	this.isValidMsg=function(msg){
		const TOBJ='object';
		const TSTR='string';
		const TNUM='number';

		var log=new global.logger(LOGGER_SOURCE);	
	
		/*End of method definition*/
		if(typeof(msg)==TOBJ){
			log.write("msg is object.\n  Dumping:"+JSON.stringify(msg));
			if(msg.code==undefined) throw new Error("Msg is missing expected code property.");
			if(typeof(msg.code)!=TNUM) throw new Error('Message code is not a number');
			log.write("eval msg.code value {code:"+msg.code+"}");
			switch(msg.code){
				case 0:return true;break;/*No data property.*/
				case 1:return true;break;/*No data property.*/
				case 2:
					/*------------------------------------------------------------------ 
						{code:2,data:{id:<number>,type:<string>,
						   config:{workerId:<number>,ipAddress:<string>,ipPort:<number>}}}
					--------------------------------------------------------------------*/
					this.typeCheck(m.data,TOBJ,'{code:2,data:<non-object>}');
					this.typeCheck(m.data,TOBJ,'{code:2,data:<non-object>}');
					this.isUndefined(m.data.id,'data.id undefined');
					this.isUndefined(m.data.type,'data.type undefined');
					this.isUndefined(m.data.config,'data.config undefined');
					this.typeCheck(m.data.id,TNUM,'data.id not a number');
					this.typeCheck(m.data.type,TSTR,'data.type not a string');
					this.typeCheck(m.data.config,TOBJ,'data.config not object');
					this.isUndefined(m.data.config.workerId,'data.config.workerId undefined');
					this.isUndefined(m.data.config.ipAddress,'data.config.ipAddress');
					this.isUndefined(m.data.config.ipPort,'data.config.ipPort')
					this.typeCheck(m.data.config.workerId,TNUM,'data.config.workerId not number');
					this.typeCheck(m.data.config.ipAddress,TSTR,'data.config.ipAddress not string');
					this.typeCheck(m.data.config.ipPort,TNUM,'data.config.ipPort not number');
					log.write("{code:2,data:<object>} is correctly formatted.");
					return true;
					break;				
				case 3:return true;break;/*No data property.*/
				case 4:return true;break;/*No data property.*/
				/*
					Process-Monitoring Messages
				*/
				case 10:return true;break;/*No data property.*/
				case 11:
					/*------------------------------------------------ 
						{code:11,data:<number>}
					------------------------------------------------*/
					if(this.hasDataProperty(msg)){
						if(typeof(msg.data)=='number') return true;
						throw new Error("Msg {code:11} data property is not a number.");					
					}
					throw("Msg {code:11} lacks data property.");
					break;					
				case 12:return true;break;/*No data property.*/
				case 13:
					/*------------------------------------------------ 
						{code:13,data:[<array of statistic objects>]}
					------------------------------------------------*/
					if(this.hasDataProperty(msg)){
						if(typeof(msg.data)=='array') return true;
						throw new Error("Msg {code:13} data property is non-array.");
					}
					throw new Error("Msg {code:13} lacks data property.");
					break;
				default:
					throw new Error("Unknown msg code encountered.");
					break;
			}/*end of switch()*/
		}
		throw new Error('Message is not an object');
	}
}
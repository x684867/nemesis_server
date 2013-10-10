/*
	General Message Validator 
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
 */
module.exports=validatorClass;
const LOGGER_CLASS='/srv/nemesis/app/logger/logger.js');
function validatorClass(){
	this.isValidError=function(msg){
		return (typeof(msg)=='object')?true:false;
		/*
			Todo: Define error message formats and inspection code.
		 */
	}
	this.isValidMsg=function(msg){
		const TOBJ='object';
		const TSTR='string';
		const TNUM='number';

		var logger=require(LOGGER_CLASS);
		var log=new logger('msgValidator');
	
		/*End of method definition*/
		if(typeof(msg)==TOBJ){
			log.write("msg is object.\n  Dumping:"+JSON.stringify(msg));
			if(msg.code==undefined) throw new Error("Msg is missing expected code property.");
			if(typeof(msg.code)!=TNUM) throw new Error('Message code is not a number');
			log.write("eval msg.code value {code:"+msg.code+"}");
			switch(msg.code){
				/*
					Process-Initialization Messages
				*/
				case 0:return true;break;/*No data property.*/
				case 1:return true;break;/*No data property.*/
				case 2:
					/*------------------------------------------------ 
						{
							code:2,
							data:{
								id:<number>,
						 	   	type:<string>,
						 	   	config:{
						 	   			workerId:<number>,
						 			   	ipAddress:<string>,
						 			   	ipPort:<number>
						       }
						    }
						}
					------------------------------------------------*/
					if(typeof(m.data)!=TOBJ) throw new Error('{code:2,data:<non-object>}');
					if(typeof(m.data.id)==undefined) throw new Error('data.id undefined');
					if(typeof(m.data.type)==undefined) throw new Error('data.type undefined');
					if(typeof(m.data.config)==undefined)throw new Error('data.config undefined');
					if(typeof(m.data.id)!=TNUM) throw new Error('data.id not a number');
					if(typeof(m.data.type)!=TSTR) throw new Error('data.type not a string');
					if(typeof(m.data.config)!=TOBJ) throw new Error('data.config not object');
					if(typeof(m.data.config.workerId)==undefined) throw new Error('data.config.workerId undefined');
					if(typeof(m.data.config.ipAddress)==undefined) throw new Error('data.config.ipAddress');
					if(typeof(m.data.config.ipPort)==undefined) throw new Error('data.config.ipPort')
					if(typeof(m.data.config.workerId)!=TNUM) throw new Error('data.config.workerId not number');
					if(typeof(m.data.config.ipAddress)!=TSTR) throw new Error('data.config.ipAddress not string');
					if(typeof(m.data.config.ipPort)!=TNUM) throw new Error('data.config.ipPort not number');
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
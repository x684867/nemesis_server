/*
	General Function Library for Message Handling by Parent and Child Processes.
	(c) 2013 Sam Caldwell.  All Rights Reserved.  
 */
module.exports=isMsgFormatValid;
module.exports=isErrFormatValid;

function isMsgFormatValid(msg){
	/*Internal methods*/
	this.hasDataProperty=function(msg){return (msg.data==undefined)?false:true;}
	this.isValidCode2Data=function(m){
		return ((typeof(m.data)=='object')
				&&(m.data.id!=undefined)
			    &&(m.data.type!=undefined)
			   	&&(m.data.config!=undefined)
			   	&&(typeof(m.data.id)=='number')
			   	&&(typeof(m.data.type)=='string')
			   	&&(typeof(m.data.config)=='object')
			   	&&(m.data.config.workerId!=undefined)
			   	&&(m.data.config.ipAddress!=undefined)
			   	&&(m.data.config.ipPort!=undefined)
			   	&&(typeof(m.data.config.workerId)=='number')
			   	&&(typeof(m.data.config.ipAddress)=='string')
			   	&&(typeof(m.data.config.ipPort)=='string')
			   )?true:false;
	}

	/*End of method definition*/

	if(typeof(msg)=='object'){
		if(msg.code==undefined) throw new Error("Msg is missing expected code property.");
		if(typeof(msg.code)!='number') throw new Error('Message code is not a number');
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
				if(this.hasDataProperty(msg){
					if(this.isValidCode2Data(msg))return true;
					throw new Error('Msg {code:2} data is not properly formed.');
				}
				throw new Error('Msg {code:2} lacks data property');
				break;/*we should never get to the break.  it's here for form.*/
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
					if(typeof(msg.data)=='array'){
						return true;
					}else{
						throw new Error("Msg {code:13} data property is non-array.");
				}else{
					throw new Error("Msg {code:13} lacks data property.");
				}
				break;
		}/*end of switch()*/
	}
	throw new Error('Message is not an object');
}/*end of isMsgFormatValid*/

function isErrFormatValid(msg){
	return (typeof(msg)=='object')?true:false;
	/*
		Todo: Define error message formats and inspection code.
	 */
}
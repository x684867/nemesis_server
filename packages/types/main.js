/*
	Nemesis Global Types Management Package
	/srv/nemesis/packages/types/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package creates a centralized type-management package for the Nemesis application.
	Type-checking and generic type-tokenization functionality are provided within this 
	package for the entire system.
	
	USE:
		root.types
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Types
	
*/
module.exports=function(){
	
	if((typeof(root.config.types.debug)=='boolean')&&(root.config.types.debug)){
		console.log("starting types constructor.");
		console.log("----------------------------");
		console.log("    TYPES CONFIG:");	
		console.log("----------------------------");
		console.dir(root.config.types);	
		console.log("----------------------------");
	}
		
	if(typeof(root.error)=='undefined') root.error={};
	
	root.error={
		type:{
			success:"success",
			failure:"fatal"
		}
	};
		
	root.types={
	
		syslog:{
			priority:{},
			facility:{},
		},

		"success":"success",
		"warning":"warning",
		"failure":"fatal",
		"notfound":-1,
		
		isArray:function(o){	return root.type.isObject(o) && root.type.isFunction(0);},
		isBoolean:function(o){	return (typeof(o)=='boolean')?true:false;				},
		isFunction:function(o){	return (typeof(o)=='function')?true:false;				},
		isNumber:function(o){	return (typeof(o)=='number')?true:false;				},
		isObject:function(o){	return (typeof(o)=='object')?true:false;				},
		isString:function(o){	return (typeof(o)=='string')?true:false;				},
		isTrue:function(o){		return (root.type.isBoolean(o) && (o==true))?true:false;},
		isFalse:function(o){	return !root.type.isTrue(o);							},
		isUndefined:function(o){return (typeof(o)=='undefined')?true:false;				},
		isIPaddress:function(o){return false; /*NEEDS WORK*/							},
		isNetPort:function(o){return (isNumber(o) && ((o>0) && (o<65536)))?true:false;	},
		isUUID:function(o){
			return test(new RegExp(/\X[0-9a-f]{3}\-[0-9a-f]{4}\-[0-9a-f]{4}/));
			/*Needs work to check and see if the UUID exists in the index.*/
		},
		isSyslogPriority:function(o){
			return (root.config.types.syslog.priorities.indexOf(o)==root.type.notfound)?false:true;
		},
		isSyslogFacility:function(o){
			return (root.config.types.syslog.facilities.indexOf(o)==root.type.notfound)?false:true;
	}
	};
	root.config.types.syslog.priorities.forEach(function(p,i,a){root.types.syslog.priority[p]=i;});
	root.config.types.syslog.facilities.forEach(function(p,i,a){root.types.syslog.facility[p]=i;});
	
	if((typeof(root.config.types.debug)=='boolean')&&(root.config.types.debug)){
		console.log("----------------------------");
		console.log("root.types anatomy...");
		console.log("----------------------------");
		console.dir(root.types);
		console.log("----------------------------");
	}
}
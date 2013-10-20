/* 
	Nemesis Core Data Type Utility Object
	/srv/nemesis/core/core.types.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file provides type-checking and type-management functionality.
*/
module.exports=init;

function init(){
	root.error.type.success="success",
	root.error.type.failure="fatal",
	
	
	
	root.type={
	
		success:"success",
		warning:"warning",
		failure:"fatal",
	
		tobj:'object',
		tstr:'string',
		tnum:'number',
		tbool:'boolean',
		tfunc:'function',
	
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
	
	}
	
}
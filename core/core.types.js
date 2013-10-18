/* 
	Nemesis Core Data Type Utility Object
	/srv/nemesis/core/core.types.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file provides type-checking and type-management functionality.
*/
module.exports=core_types;

function core_types(){
	
	root.type={
	
		tobj:'object';
		tstr:'string';
		tnum:'number';
		tbool:'boolean';
		tfunc:'function';
	
		isArray:function(o){	return root.type.isObject(o) && root.type.isFunction(0);}
		isBoolean:function(o){	return (typeof(o)=='boolean')?true:false;				}
		isFunction:function(o){	return (typeof(o)=='function')?true:false;				}
		isNumber:function(o){	return (typeof(o)=='number')?true:false;				}
		isObject:function(o){	return (typeof(o)=='object')?true:false;				}
		isString:function(o){	return (typeof(o)=='string')?true:false;				}
	
	}
	
}
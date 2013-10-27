/*
	JSON Config (JSON Configuration Management Tools)
	(c) 2013 Sam Caldwell.  Public Domain
	
	JSON-config.js extends the JSON object to provide tools for validating, managing and interacting
	with JSON-based configuration files.  This utility may be loaded as follows--
	
	require('JSON-config.js')();
	
	If the above line appears more than once, no harm will occur.  A simple notice will appear in 
	console.log if the showWarning property is set.
	
	
 */
module.exports=function(){

 	JSON.showWarnings=false;
 	if(typeof(root.JSON.config)=='undefined'){
	 	JSON.config={
	 		var arrPattern=Array();
			Object.defineProperty(JSON.config,'pattern',{
				get:function(){return arrPattern;}
				set:function(objPattern){
					if(typeof(objPattern)=='object')
						arrPattern=decayPattern(objPattern);
					else
						throw new Error('JSON.config.pattern must be a object.');
				}
			});
			isValid:function(json){ 
				return arrayCompare(decayPattern(json),arrPattern); 
			}
		}
	}else{
		if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings){
			console.log('     JSON.config was already defined.  Not reloading.');
		}
	}
}

function decayPattern(objPattern){
	switch(objPattern){
		case 'object':return recursive_object_decay(objPattern,null,0); break;
		case 'array':return recursive_array_decay(objPattern,null,0); break;
		default:throw new Error('decay_pattern() expects an object or array input.'); break;
	}
}

function arrayCompare(lhsPattern,rhsPattern){
	var result=true;
	lhsPattern.forEach(function(e,i){
		if(
			(e.id	!= e.id) && 
			(e.name != rhsPattern[i].name) &&
			(e.type != rhsPattern[i].type)
		) result=false;
	});
	return result
}

function push_to_pattern(arrPattern,id,name,type){
	arrPattern.push({"id":nestLevel+i,"name":strParentName+":"+elementName,"type":typeof(objCurrent[elementName])});
}
/*
	recursive_object_delay():
		objCurrent (object)		:	current json object being decayed.
		strParentName  (string)	:	name of the parent object.
		nestLevel  (number)		:	depth of nested objects within the original json object.
		
		This function recursively calls itself to examine the contents of the current
		element if that element is an object or array.
*/
function recursive_object_decay(objCurrent,strParentName,nestLevel){
	var arrPattern=Array();
	Object.keys.forEach(function(elementName,elementIndex){
		var id=nestLevel+i;
		push_to_pattern(
							arrPattern , 
							id , 
							strParentName+":"+elementName , 
							typeof(objCurrent[elementName]) 
		);
		switch(typeof(objCurrent[elementName])){
			case 'array': recursive_array_decay(objCurrent[elementName],elementName,10*(id+1)); break;
			case 'object': recursive_object_decay(objCurrent[elementName],elementName,10*(id+1)); break;
		}
	});
}
/*	
	recursive_array_decay():
		arrCurrent (array)		:	current json array being decayed.
		strParentName  (string)	:	name of the parent object.
		nestLevel  (number)		:	depth of nested objects within the original json object.
		
		This function recursively calls itself to examine the contents of the current
		element if that element is an object or array.
*/
function recursive_array_decay(arrCurrent,strParentName,id){
	/*
		Note arrays do not count elements since that is part of the value.  
		So the id we are given will be assigned to all elements of the array.
	*/
	var arrPattern=Array();
	arrCurrent.forEach(function(elementName,elementIndex){
		push_to_pattern(
							arrPattern , 
							id , 
							strParentName+":"+elementName , 
							typeof(arrCurrent[elementIndex]) 
		);
		switch(typeof(arrCurrent[elementIndex])){
			case 'array': recursive_array_decay(arrCurrent[elementIndex],elementName,10*(id+1)); break;
			case 'object': recursive_object_decay(arrCurrent[elementIndex],elementName,10*(id+1)); break;
		}
	});
	return arrPattern;
}
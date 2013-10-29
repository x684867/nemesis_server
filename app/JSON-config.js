/*
	JSON Config (JSON Configuration Management Tools)
	(c) 2013 Sam Caldwell.  Public Domain
	
	JSON-config.js extends the JSON object to provide tools for validating, managing and interacting
	with JSON-based configuration files.  This utility may be loaded as follows--
	
	require('JSON-config.js')();
	
	If the above line appears more than once, no harm will occur.  A simple notice will appear in 
	console.log if the showWarning property is set.	
 */
const templatePattern=0;
const samplePattern=1;

module.exports=function(){
	require('./JSON-commented.js')();
 	JSON.showWarnings=true;
 	if(typeof(JSON.showWarnings)!='boolean') throw new Error('JSON.showWarnings must be a boolean value');
 	if(typeof(root.JSON.config)=='undefined'){
	 	JSON.config={};
	 	JSON.config.loadValidJSON=function(fname,pname){
			p=JSON.commented.load(pname);
			o=JSON.commented.load(fname);
			if(JSON.showWarnings) console.log("preparing to test config syntax");
			if((typeof(p)=='object') && (typeof(o)=='object')){
				if(JSON.showWarnings) 
					console.log('both objects passed to JSON.config.loadValidJSON() are objects.');
				if(arrayCompare(decay(0,p),decay(1,o))){
					if(JSON.showWarnings){
						console.log('arrayCompare() returned true.');
						return o;
					}
				}else{
					if(JSON.showWarnings)
						console.log(Array(70).join('-')+'\n'
									+"ERROR!\n"
									+"Configuration file does not match pattern.\n"
									+"FILE:    "+fname+"\n"
									+"PATTERN: "+pname+"\n"
									+Array(70).join('-')+'\n'
						);
					throw new Error('configuration file does not match pattern');
				}
			}else
				throw new Error(
					(typeof(p)=='object')
						?"loadValidJSON(): json file not valid object."
						:"loadValidJSON(): pattern file not valid object."
				);
		}
	}else if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings)
		console.log('     JSON.config was already defined.  Not reloading.');
}
/*
	arrayCompare(lhs,rhs):
		lhs (array)	:	left-hand array in comparison.
		rhs (array)	:	right-hand array in comparison.
		
		This function will stringify the two arrays using the .sort() and .join() methods to 
		produce compatible signature strings.  These can then be compared to determine if they 
		are identical.  For purposes of JSON.config, this works because the lhs and rhs arrays 
		are both generated using the decayPattern() function which normalizes all values as
		data types for samplePatterns and the templatePattern defines an identical structure.
 */
function arrayCompare(a,b){
	
	return(a.sort().join('|')==b.sort().join('|'))?true:false;
}
/*
	decayPattern(patternType,objPattern):
		patternType (number)	: {0:templatePattern, 1:samplePattern} Determines how a pattern is decayed.
		objPattern				: JSON object to be decayed.
		
		This function will decay a pattern using recursive calls to either an object or array handling
		function and the result is returned as an array. 
 */
function decay(p,o){
	if([0,1].indexOf(p)==-1) throw new Error('invalid patternType passed to decayPattern()');
	switch(typeof(o)){
		case 'object':return oDecay(p,o,null,0); break;
		case 'array':return aDecay(p,o,null,0); break;
		default:throw new Error('decay_pattern() expects an object or array input.');break;
	}
}
/*
	oDecay(): Recursive Object Decay
		pt 	(number):determines how types must be evaluated.
		c 	(object):current json object being decayed.
		pn 	(string):name of the parent object.
		
		This function recursively calls itself to examine the contents of the current
		element if that element is an object or array.
		
		If the function is called with patternType==templatePattern, then the function will
		accept the current element's value as a type.  But otherwise the function will store
		the result of typeof() for the current element.
*/
function oDecay(pt,c,pn){
	var r=Array();
	Object.keys(c).forEach(function(n){
		switch(typeof(c[n])){
			default:r.push(JSON.stringify({"n":pn+"."+n,"t":(pt==0)?c[n]:typeof(c[n])}));break;
			case 'object':r=r.concat(oDecay(pt,c[n],n)); break;
			case 'array' :r=r.concat(aDecay(pt,c[n],n)); break;
		}
	});
	return r;
}
/*	
	aDecay(): Recursive Array Decay
		pt	(number):determines how types must be evaluated.
		c	(array)	:current json array being decayed.
		pn  (string):name of the parent object.
		
		This function recursively calls itself to examine the contents of the current
		element if that element is an object or array.
		
		If the function is called with patternType==templatePattern, then the function will
		accept the current element's value as a type.  But otherwise the function will store
		the result of typeof() for the current element.
*/

function aDecay(pt,c,pn){
	var r=Array();
	c.forEach(function(n){
		switch(typeof(c[n])){
			default:r.push(JSON.stringify({"n":pn+"."+n,"t":(pt==0)?c[n]:typeof(c[n])}));break;
			case 'object':r=r.concat(oDecay(pt,c[n],n)); break;
			case 'array' :r=r.concat(aDecay(pt,c[n],n)); break;
		}
	});
	return r;
}
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
 	JSON.showWarnings=false;
 	if(typeof(JSON.showWarnings)!='boolean') throw new Error('JSON.showWarnings must be a boolean value');
 	/*
 		If root.JSON.config is undefined then either the JSON.config has not
 		been loaded, or it was loaded and somehow was destroyed.  In either 
 		case, we will reload the utility.
 	*/
 	if(typeof(root.JSON.config)=='undefined')
	 	JSON.config={
			isValid:function(lhs,rhs){
				return (arrayCompare(decay(samplePattern,lhs),decay(templatePattern,rhs)))?true:false;
			},
			loadValidJSON:function(fname){
				lhs=JSON.commented.load(fname);
				rhs=JSON.commented.load(fname+'.pattern');
				if(arrayCompare(decay(samplePattern,lhs),decay(templatePattern,rhs)))
					return lhs;
				else
					throw new Error('app.conf.json does not match app.conf.pattern.json');
			}
		}
	else
		if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings)
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
function arrayCompare(lhs,rhs){return(lhs.sort().join('|')==rhs.sort().join('|'))?true:false;}
/*
	decayPattern(patternType,objPattern):
		patternType (number)	: {0:templatePattern, 1:samplePattern} Determines how a pattern is decayed.
		objPattern				: JSON object to be decayed.
		
		This function will decay a pattern using recursive calls to either an object or array handling
		function and the result is returned as an array. 
 */
function decay(patternType,objPattern){
	if([samplePattern,templatePattern].indexOf(patternType)==-1)
		throw new Error('invalid patternType passed to decayPattern()');
	else
		switch(objPattern){
			case 'object':return oDecay(patternType,objPattern,null,0); break;
			case 'array':return aDecay(patternType,objPattern,null,0); break;
			default:throw new Error('decay_pattern() expects an object or array input.'); break;
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
	var r=Array();/*this is the decayed array pattern*/
	Object.keys.forEach(
		function(n){/*n: elementName*/
			r.push(
				JSON.stringify(
					{
						"n":pn+"."+n, /*create fully qualified parent.child name string*/
						"t":(pt==templatePattern)?c[n]:typeof(c[n])
					}
				)
			);
			/*append recursively generated array to the end of our current results.*/
			r=r.concat(
						(typeof(c[n])=='object')
							?oDecay(pt,c[n],n)
							:aDecay(pt,c[n],n)
			); 
		}
	);
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
	var r=Array();/*this is the decayed array pattern*/
	aCurrent.forEach(
		function(n){/*n: elementName*/
			r.push(
				JSON.stringify(
					{
						"n":pn+"."+n, /*create fully qualified parent.child name string*/
						"t":(pt==templatePattern)?c[n]:typeof(c[n])
					}
				)
			);
			/*append recursively generated array to the end of our current results.*/
			r=r.concat(
						(typeof(c[n])=='object')
							?oDecay(pt,c[n],n)
							:aDecay(pt,c[n],n)
			);
		}
	);
	return r;
}
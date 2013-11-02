/*
	JSON Config (JSON Configuration Management Tools)
	(c) 2013 Sam Caldwell.  Public Domain
	
	JSON-config.js extends the JSON object to provide tools for validating, managing and interacting
	with JSON-based configuration files.  This utility may be loaded as follows--
	
	require('JSON-config.js')();
	
	If the above line appears more than once, no harm will occur.  A simple notice will appear in 
	console.log if the showWarning property is set.	

	======
	TO DO:
	--------------
		*Make this utility capable of handling Arrays better, looking at the syntax of the
		 elements contained within an array.  We need to handle the nested objects or arrays
		 within the array.

 */

module.exports=function(){

	require('./JSON-commented.js')();
	
 	JSON.showWarnings=false;
 	if(typeof(JSON.showWarnings)!='boolean') throw new Error('JSON.showWarnings must be a boolean value');
 	
 	if(typeof(root.JSON.config)=='undefined'){
 	
	 	JSON.config={};
	 	/*
	 		JSON.config.loadValidJSON()
	 			This method loads two files, a JSON configuration file and its pattern file.
	 			The two are decayed down into string "signatures" which are then compared
	 			to ensure the configuration file complies with the expected syntactical pattern.
	 	 */
	 	JSON.config.loadValidJSON=function(oname,pname){
	 	
			p=JSON.commented.load(pname);/*Pattern File*/
			o=JSON.commented.load(oname);/*Configuration File*/
			
			if(JSON.showWarnings) console.log("preparing to test config syntax");
			if(typeof(o)!='object') throw new Error('configuration file did not load JSON object');
			if(typeof(p)!='object') throw new Error('pattern file did not load JSON object.');
			
			if(JSON.showWarnings) console.log('configuration and pattern files loaded JSON objects.');
			
			if(JSON.showWarnings){
				console.log(
					Array(70).join('=')+
					'\no: '+JSON.stringify(o)+
					'\np: '+JSON.stringify(p)+'\n'
					+Array(70).join('=')
				);
			}
			if( decay(o,'config') == decay(p,'pattern') )
				return o;
			else{
				console.log(
						Array(70).join('-')+'\n'
						+"ERROR!\n"
						+"Configuration file does not match pattern.\n"
						+"FILE:    "+oname+"\n"
						+"PATTERN: "+pname+"\n"
						+Array(70).join('-')+'\n'
						+"o:"+decay(o,'config')+"\n\n"
						+"p:"+decay(p,'pattern')+"\n"
						+Array(70).join('-')+'\n'
				);
				throw new Error('configuration file does not match pattern');
			}

		}/*end of loadValidJSON()*/
		
	}else if((typeof(JSON.showWarnings)=='boolean') && JSON.showWarnings)
		console.log('     JSON.config was already defined.  Not reloading.');
}
/*
	decay(o):
		
		o: JSON object to be decayed.
		m: operating mode
		n: current object name
		
		This function will decay a pattern using recursive calls to either an object or array handling
		function and the result is returned as an array. 
 */
function decay(o,m,n){
	var t=typeof(o);
	var r='';
	if(n==undefined) n='undefined';
	switch( ( t == 'object' ) &&( typeof( o.forEach ) != 'undefined' ) ? 'Array' : t ){
		case 'object':
			Object.keys(o).sort().forEach(function(e){r+=decay(o[e],m,e);});						
			r='object('+r+')';
			break;
		case 'Array':r=JSON.stringify({"n":n,"t":"Array('"+typeof(o[0])+"')"});break;
		default:r=JSON.stringify({"n":((typeof(n)=='undefined')?null:n),"t":((m!='pattern')?typeof(o):o)});break;
	}
	return r;
}




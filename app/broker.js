/*
	broker worker
*/

var config='';
var id=0;

module.exports.main=function(){
	if((config=='') || (id==0)){
		if(config==None) console.log("Error.  No Configuration set.");
		if(id==None) console.log("Error.  No id parameter set.");
	}else {
		console.log("configuration and id are set.");
		console.log("Need payload code.");
	}
	
}

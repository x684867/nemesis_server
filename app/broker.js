/*
	broker worker
*/

var config=None;
var id=None;

module.exports.main=function(){
	if((config==None) || (id==None)){
		if(config==None) console.log("Error.  No Configuration set.");
		if(id==None) console.log("Error.  No id parameter set.");
	}else {
		console.log("configuration and id are set.");
		console.log("Need payload code.");
	}
	
}

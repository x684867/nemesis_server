/*
	broker worker
*/

var config='';
var id=0;

module.exports.main=function(){
	if((config=='') || (id==0)){
		if(config=='') console.log("Error.  No Configuration set.");
		if(id==0) console.log("Error.  No id parameter set.");
		return 1; /*Non-Zero returns indicate error.*/
	}else {
		console.log("configuration and id are set.");
		console.log("Need payload code.");
		return 0; /*Zero returns indicate success*/
	}
	
}

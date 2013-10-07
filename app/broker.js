/*
	broker worker
*/
module.exports=workerClass;

function workerClass(index,data){
	var id=index;
	var config=data;
	
	if(data==undefined) throw new Error('config is not defined.');
	if(index==undefined) throw new Error('index is not defined.');
	if(typeof(data)!='object') throw new Error('config is not an object.  type:'+typeof(data));
	if(typeof(index)!='number') throw new Error('id must be a number.');
}
workerClass.prototype.main=function(){
	console("running main.");
	return 0;/*successful spawn.*/
	return 1;/*failed spawn.*/
}

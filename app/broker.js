/*
	broker worker
*/
module.export=workerClass;

function workerClass(index,data){
	var id=index;
	var config=data;
	
	if(data==undefined) throw new Error('config is not defined.');
	if(index==undefined) throw new Error('index is not defined.');
	if(typeof(this.config)!='object') throw new Error('config is not an object.');
	if(typeof(this.id)!='number') throw new Error('id must be a number.');
}
Broker.prototype.main=function(){
	console("running main.");
	return 0;/*successful spawn.*/
	return 1;/*failed spawn.*/
}

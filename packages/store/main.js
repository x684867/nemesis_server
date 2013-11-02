/*
	Nemesis Data Store Abstraction Layer Package
	/srv/nemesis/packages/store/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package loads and extends the mongoose NPM package to provide an
	abstract mongodb data store.
		
	USE:
		root.store
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Store
	
*/
module.exports=function(){
	/*
		The store object abstracts away the mongo database.
	*/
	var mongoose=require('mongoose');
	
	connect=function(server_type){
		mongoose.connect(
							config.stores[config.server_type].protocol+"://"+
							config.stores[config.server_type].ip+":"+
							config.stores[config.server_type].port+"/"+
							config.server_type
		);
	}
	
	read=function(objectName){
	
	}

	write=function(objectName,objectData){
	
	
	}





	if(typeof(config.server_type)=='undefined') error.raise(error.store.UndefinedServerType);

	mongoose=require('mongoose');
	mongoose.connect('mongodb://'+
						config.stores[config.server_type].ip+":"+
						config.stores[config.server_type].port+"/"+
						config.server_type
	);
	

	/*
	var mongoose = require('mongoose');
		mongoose.connect('mongodb://localhost/store');
	*/
	/*
	var currStore = mongoose.model('Cat', { name: String });

	var kitty = new Cat({ name: 'Zildjian' });
	kitty.save(function (err) {
	  if (err) // ...
	  console.log('meow');
	});
	*/
/*
"stores":{
		"audit":{
			"server":"string",
			"port":"number",
			"user":"string",
			"passwd":"string",
			"tls":{
				"key":"string",
				"cert":"string",
				"ca":"string"
			}
		},
*/
}
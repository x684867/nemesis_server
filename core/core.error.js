/*
"_name":"core.error.js",
"_desc":"Nemesis Error Handler",
"_author":"Sam Caldwell <mail@samcaldwell.net>",
"_copyright":"(c) 2013 Sam Caldwell.  All Rights Reserved.",
*/
module.exports=error_handler;

function error_handler(){
	console.log(module.filename+"  loading error messages");
	messages=function(){
		var localizedErrors=root.conf_dir+'/errors/errors-'+root.config.language+'.json'
		data=require('fs').readFileSync(localizedErrors)
		json=JSON.parse(data);
		
		console.log("RAW OUTPUT:"+data+"\n"+Array(50).join('-'));
		console.log("JSON:"+json+"\n"+Array(50).join('-'));
		
		return json; 
	}
	console.log("...messages loaded.");
	
	raise=function(e){	
		require('util');
		util.log(Array(60).join('=')+"\nERROR:");
		switch(typeof(e)){
			case "object":
				util.log("      CODE:"+e.code);
				util.log("   MESSAGE:"+e.text);
				if((typeof(e.code.fatal)=='boolean') && e.code.fatal ){
					util.log("----STACK TRACE----");
					console.trace();
					/*
						Need a debugging stack trace.
					*/
					process.exit(e.code);
				}
				break;
			case "string":
			case "number":
			case "boolean":
				util.log("   MESSAGE:"+e);
				break;
			default:
				util.log("   UNEXPECTED ERROR TYPE:"+typeof(e));
				util.log("   MESSAGE:"+e);
				break;
		}
	}

}
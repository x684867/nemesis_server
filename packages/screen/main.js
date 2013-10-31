/*
	Nemesis Global Screen Management Package
	/srv/nemesis/packages/screen/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package overloads the console object [e.g. console.log() and console.error()]
	to add functionality.
		
	USE:
		root.screen
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Screen
	
*/
module.exports=function(){

	console.now=function(){
		var d=new Date;
		return d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()+'@'
			  +d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
	};
	console.stdout=console.log;
	console.stderr=console.error;	
	console.width=process.stdout.columns;
	console.height=process.stdout.rows;
	process.on('resize',function(){
		console.width=process.stdout.columns;
		console.height=process.stdout.rows;
	});
	console.log=function(m){if(root.config.screen) console.stdout(console.now()+":"+m);}
	console.error=function(m){if(root.config.screen) console.stderr(console.now()+":"+m);}
	console.clear=function(){console.stdout(Array(console.height).join('\n'));}
	
	if(root.config.screen.debug){
		console.error("Starting types constructor.");
		console.error("----------------------------");
		console.error("    SCREEN  CONFIG:");	
		console.error("----------------------------");
		console.dir(root.config.screen);	
		console.error("----------------------------");
	};
}	

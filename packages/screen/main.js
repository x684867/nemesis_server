/*
	Nemesis Global Screen Management Package
	/srv/nemesis/packages/screen/
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This package creates a global screen management package for writing output through
	console.log() to the terminal.  The screen object extends the functionality of the
	console object by adding a process.on('resize') event, line-drawing methods and other
	pretty output features.
		
	USE:
		root.screen
		
	DOCUMENTATION:
	
		See https://github.com/x684867/nemesis_server/wiki/Framework:-Packages:-Screen
	
*/
{
	init=function(){
	
		/*
			The screen is smart and knows our current dimensions.
		*/
		
		root.screen.width=process.stdout.columns;
		root.screen.height=process.stdout.rows;
		
		/*
			The screen features...
		*/
		root.screen={}
		root.screen.write=function(message){console.log(message);}
		root.screen.log=function(message){root.screen.write(root.screen.now()+message);}
		
		root.screen.repeat=function(s,n){root.screen.write(Array(n).join(s));}
		root.screen.drawSingleLine=function(){root.screen.repeat('-',root.screen.width);}
		root.screen.drawDoubleLine=function(){root.screen.repeat('=',root.screen.width);}
		root.screen.drawDottedLine=function(){root.screen.repeat('.',root.screen.width);}
		root.screen.clear=function(){root.screen.repeat('\n',root.screen.width);}
		
		root.screen.now=function(){
			var d=new Date;
			return d.getFullYear()+'/'+d.getMonth()+'/'+d.getDate()+'@'
				  +d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		};
		
		/*
			The resize event fires to ensure that our screen dimensions
			are updated in real time.
		*/
		process.on('resize',function(){
			root.screen.width=process.stdout.columns;
			root.screen.height=process.stdout.rows;
		});
	}	
}
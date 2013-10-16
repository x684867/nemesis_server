/*

	Message Processor Class (Broker)
	/srv/nemesis/app/servers/broker/msgProc.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.

	This class is the broker-specific message processor which provides context-based 
	message processor methods.
	
	See "Nemesis Message Processor Class Specification"
		
	============================================================	
	JSON "config" parameter:
	============================================================
		{
			id:<workerId>,
			msgRouter:<file/path to message router>
			msgProc:<file/path to  message processor>
			net:{
					port:<tcp port number>,
					ip:<ipv4 address>
			},
			ssl:{
					key:<key path/fname>,
					cert:<certificate path/fname>,
					ca:<ca certificate path/fname>
			}
		}	
*/
module.exports=msgProcClass;

const WEBSTATSCLASS='/srv/nemesis/app/server/web/webStats.js'


function msgProcClass(config){
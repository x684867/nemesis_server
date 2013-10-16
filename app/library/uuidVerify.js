/*

	UUID Verification Class (Generic)
	/srv/nemesis/app/library/msgRouter.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.

	This is the HTTP message router which parses, verifies and routes HTTP inputs.
	The results are then processed by a context-specific message processor.
	
	See "Nemesis Message Router Class Specification"
		
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
	============================================================
	JSON "message" parameter:
	============================================================
		{
			code:<number>,
			<context-based objects>
		}
*/
module.exports=msgRouterClass;
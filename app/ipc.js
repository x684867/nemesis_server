/*
	/srv/nemesis/app/ipc.js
	Nemesis Inter-Process Communications (IPC) Handler Class
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This is the message handling class for the Nemesis Servers.
	When app.js spawns worker processes, it uses this class to
	manage communications between parent and child processes.
	
	PARENT->CHILD INTERACTIONS:
	
	Time	Actor			Action								Target
	-------------------------------------------------------------------------
	1		Parent->		(spawns)							Child
	2		Child->			(starts, sends {code:0})			Parent
	3		Parent->		(sends serverobject, {code:0})		Child
	4		Child->			(executes server.start())			N/A
	5a		Child->			(sends {code:1} if healthy)			Parent
	6a		Parent			(starts monitoring child)			----
	--OR--
	5b		Child->			(sends {code:2} if failed)			Parent
	6a		Parent			(throws exception and dies)			----
	6b		Child			(dies because parent died)			----
	
	CODE		SENDER		DESCRIPTION
	-------------------------------------------------------------------------
	{code:0}	Child		Child is alive.  Requesting server.
	{code:0}	Parent		Acknowledge Child. Sending server.
	
	{code:1}	Child		Child is alive.  Server is alive.
	{code:1}	Parent		<RESERVED MESSAGE CODE>
	
	{code:2}	Child		Child is dying.  Server is dead.  An error occurred.
	{code:2}	Parent		<RESERVED MESSAGE CODE>
	
	{code:3-9}	Both		<RESERVED MESSAGE CODES>
	
	{code:10}	Parent		Heartbeat "ping"
	{code:10}	Child		Heartbeat "ack" (healthy) (response to parent "ping")
	
	{code:11}	Parent		<RESERVED MESSAGE CODE>
	{code:11}	Child		Heartbeat "ack" (unhealthy) (response to parent "ping")
	
	{code:12}	Parent		statsRequest
	{code:12}	Child		statsResponse (Returns JSON object with stats).
	
	{code:98}	Child		"suicide message" (request to parent for "kill").
	{code:98}	Parent		"suicide ack" (parent acknowledges "suicide message").
	
	{code:99}	Parent		"Kill Notice" (parent's warning that child will be killed.)
	{code:99}	Child		"Kill Ack" (child's acknowledge that it will be killed.)
	
*/
modules.exports=ipc;

function ipc(){/*This class is executed either for .child() or .parent()*/}

ipc.child={}	/*IPC Handler for child processes*/
ipc.parent={}	/*IPC Handler for parent processes*/

/*Message Handling*/
	/*Child Processes*/
	childMessageRoutingClass=require('ipcMsgRoutesChild.js');
	ipc.child.messages=new ipcMsgRoutesChild();

	/*Parent Processes*/
	parentMessageRoutingClass=require('ipcMsgRoutesParent.js');
	ipc.parent.messages=new ipcMsgRoutesParent();

/*Error Handling*/
	/*Child Processes*/
	childErrorRoutingClass=require('ipcErrRoutesChild.js');
	ipc.child.errors=new ipcErrRoutesChild();
	
	/*Parent Processes*/
	parentErrorRoutingClass=require('ipcErrRoutesParent.js');
	ipc.parent.errors=new ipcErrRoutesParent();

}


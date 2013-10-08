/*
	/srv/nemesis/app/ipcMsgRoutesParent.js
	Nemesis Inter-Process Communications (IPC) Handler Class (Child Messages)
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	see /srv/nemesis/app/ipc.js
	
	This file defines a class (ipcChildMessageRouting) that is used by ipc.
	
*/
module.exports=ipcMsgRoutesParent;

function ipcMsgRoutesParent(msg){
	if(msg.code==undefined){
		throw new Error('msg.code undefined in ipc message.')
	}else{
		switch(msg.code){
			case 0:	ipc.parent.handleCode0(msg);break;/*Parent sending server. 1st response.*/
			case 1:	ipc.parent.handleCode1(msg);break;/*TBD*/
			case 2:	ipc.parent.handleCode2(msg);break;/*TBD*/
			case 3:	ipc.parent.handleCode3(msg);break;/*TBD*/
			case 10:ipc.parent.handleCode10(msg);break;/*TBD*/
			default:
				throw new Error('msg.code contained unknown message code: '+msg.code);
				break;
		}
	}
}
ipc.parent.handleCode0=function(msg){}
ipc.parent.handleCode1=function(msg){}
ipc.parent.handleCode2=function(msg){}
ipc.parent.handleCode3=function(msg){}
ipc.parent.handleCode10=function(msg){}

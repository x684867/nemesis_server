/*
	/srv/nemesis/app/ipcMsgRoutesChild.js
	Nemesis Inter-Process Communications (IPC) Handler Class (Child Messages)
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	see /srv/nemesis/app/ipc.js
	
	This file defines a class (ipcChildMessageRouting) that is used by ipc.
	
*/
module.exports=ipcMsgRoutesChild;

function ipcMsgRoutesChild(msg){
	if(msg.code==undefined){
		throw new Error('msg.code undefined in ipc message.')
	}else{
		switch(msg.code){
			case 0:	ipc.child.handleCode0(msg);break;/*Parent sending server. 1st response.*/
			case 1:	ipc.child.handleCode1(msg);break;/*TBD*/
			case 2:	ipc.child.handleCode2(msg);break;/*TBD*/
			case 3:	ipc.child.handleCode3(msg);break;/*TBD*/
			case 10:ipc.child.handleCode10(msg);break;/*TBD*/
			default:
				throw new Error('msg.code contained unknown message code: '+msg.code);
				break;
		}
	}
}

/*
	/srv/nemsis/app/nemesis-logger.js
	Nemesis Logger
	(c) 2013 Sam Caldwell.  All Rights Reserved.
	
	This file creates a syslog logging tool.
	
	Currently only TCP connections are supported.  This will go production with 
	encrypted communications over TLS (TCP).
*/

module.exports=logger;

const TSTR='string';
const TNUM='number';

const SYSLOG_CONFIG='/srv/nemesis/app/logger/logger.config.json';
const SYSLOG_PARAMETERS='/srv/nemesis/app/logger/parameters.json';

function logger(source,priority,facility){
	if(typeof(source)!=TSTR) throw new Error('SYSLOG source not a string (expected)');
	if(typeof(priority)!=TNUM) throw new Error('SYSLOG priority not a number (expected)');
	if(typeof(facility)!=TNUM) throw new Error('SYSLOG facility not a number (expected)');
	var config=(function(){
		try{
			return JSON.parse((fs=require('fs')).readFileSync(SYSLOG_CONFIG));
		}catch(e){
			throw new Error('SYSLOG config file failed to read.');
		}
	});
	if(typeof(config)!='object') throw new Error('SYSLOG config file failed to load');
	var syslog=(function(){
		try{
			return JSON.parse((fs=require('fs')).readFileSync(SYSLOG_PARAMETERS));
		}catch(e){
			throw new Error('SYSLOG parameters file failed to read.');
		}
	});
	if(typeof(config)!='object') throw new Error('SYSLOG parameters file failed to load');

	this.send=function(message){
	
		var prefix=config.facility+config.severity+source;
		var p1=0;
		var p2=0;
		var mL=message.length;
		var mS=config.msgSize - prefix.length -1;
		
		if(mS<64) throw new Error('Message Size cannot be less than 64.');
		
		while(p1<mL){
		
			if( ( p2=p1+mS ) > mL ) p2=mL;
			
			msgSlice=prefix + ":" + message.substring(p1,p2);
			
			var client=(require('net')).connect({port:config.port},function(){
				/*parse the message into msgSize chunks and write them to SYSLOG*/
			
				client.write(msgSlice);
		
			});
		}
		client.end();
	}
		

function logger(logSource,config){
	if(typeof(config)!='object') throw new Error("expected config to be type object");
	
	var connection=(require('dgram')).createSocket(netProto);
	
	this.send=function(message){
		var buffer=Array(message.length/config.msgSize+2);
		
		/*Slice the message into chunks if length exceeds msgSize.*/
		
		var prefix=
		var p1=0;
		var p2;
		var ml=message.length;
		var ms=config.msgSize - prefix.length -1;
		
		if(ms<64) throw new Error('Message Size cannot be less than 64.');
		
		while(p1<=ml){

			if( ( p2=p1+ms ) > ml ) p2=ml;

			slice=message.substring(p1,p2);
			
			connection.send(slice,0,slice.length,config.port,config.ip);
			
			p1=p2+1;
		
	}
	
	this.source=(logSource==undefined)?'NoSource':logSource;
	
	this.indent=function(i){return Array(i).join(" ");}
	this.debugMode=enableDebug;
	
	this.debug=function(m){if(debugMode)this.write(m);}

	/*write(message,intend)*/
	this.write=function(m,i){
		i=(i==undefined)?0:i-(this.source.length+1);
		i=(i<=0)?0:i;
		console.log(this.source+":"+this.indent(i)+m);
	}
	
	/*drawLine(width,indent). Default Width==60*/
	this.drawLine=function(w,i){
		i=(i==undefined)?0:i;
		w=((w==undefined)?60:w)-i-(this.source.length+1);
		w=(w<=0)?0:w;
		console.log(this.source+":"+this.indent(i)+Array(w).join("-"));
	}
	
	/*drawBanner(message)*/
	this.drawBanner=function(t,i){
		i=(i==undefined)?0:i;
		this.drawLine(60,i);
		this.write(t);
		this.drawLine(60,i);
	}
}




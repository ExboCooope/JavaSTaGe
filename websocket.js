var express = require('express')    //加载express模块
var app = express()
var port = process.env.PORT || 3000//监听的端口

var wscs=[];
var wscsn=0;

var games=[];


var WebSocketServer = require('ws').Server  
, wss = new WebSocketServer({port:3010}); 

wss.on('connection', function(ws) {  
	console.log("Receiving Connection");
	ws.on('message', function(message) {  
		if(message=='JAVASTAGE'){
			wscsn=wscs.length;
			for(var i=0;i<=wscsn;i++){
				if(!wscs[i]){
					wscs[i]={
						ws:ws,
						header:0,
						gameid:-1,
						active:0,
						ping:-1
					}
					ws.id=i;
					ws.send(JSON.stringify({sid:i}));				
					break;
				}				
			}
		}else{
			var r= JSON.parse(message);
			if(r.join){
				var g=r.joinid||0;
				if(!games[g])games[g]={start:0,cdata:null,syncmode:0,replay:0,players:[],pool:[],maxpin:0};
				wscs[ws.id].gameid=g;
				var ga=games[g];
				if(ga.start==0){								
					ga.players.push(wscs[ws.id]);								
				}else{
					wscs[ws.id].active=-1;
					ga.players.push(wscs[ws.id]);								
				}
				for(var j=0;j<ga.players.length;j++){
					if(ga.players[j]){
						ga.players[j].ws.send(JSON.stringify({jin:1,pid:ws.id,slt:ga.players.length-1}));
					}
				}
			}else if(r.start){
				if(wscs[ws.id].gameid>=0){
					var g=wscs[ws.id].gameid;
					var ga=games[g];
					if(ga){
						for(var j=0;j<ga.players.length;j++){
							if(ga.players[j]){
								if(ga.players[j].active==0){
									ga.players[j].active=1;
								}
							}
						}
					}
				}
			}else if(r.ipt){
				if(wscs[ws.id].active==1){
					var g=wscs[ws.id].gameid;
					var ga=games[g];
					if(ga){
						for(var j=0;j<ga.players.length;j++){
							if(ga.players[j]){
								if(ga.players[j]!=wscs[ws.id]){
									ga.players[j].ws.send(JSON.stringify(r));
								}
							}
						}
					}
				}
			}else if(r.pin){
				ws.send(JSON.stringify(r));
			}else if(r.pina){
				wscs[ws.id].ping=r.pint;
			}else if(r.cdat){
				if(wscs[ws.id].active!=-1){
					var g=wscs[ws.id].gameid;
					var ga=games[g];
					ga.cdata=r.cdat;
					if(ga){
						for(var j=0;j<ga.players.length;j++){
							if(ga.players[j]){
								if(ga.players[j]!=wscs[ws.id]){
									ga.players[j].ws.send(JSON.stringify(r));
								}
							}
						}
					}
				}
			}
		}
	});  
	//ws.send(JSON.stringify({d:1}));  
	ws.on("close",function(){
		console.log("closed "+ws.id);
		var g=wscs[ws.id].gameid;
		
		if(g!=-1 && ws.active!=-1){
			var ga=games[g];
			for(var j=0;j<ga.players.length;j++){
				if(ga.players[j]){
					if(ga.players[j]!=wscs[ws.id]){
						ga.players[j].gameid=-1;
						ga.players[j].ws.close();
					}
					ga.players[j]=null;
				}
			}
			games[g]=null;
		}
		
		wscs[ws.id]=null;
	});
}); 


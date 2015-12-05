/**
 * Created by Exbo on 2015/10/15.
 */
var sin=Math.sin;
var cos=Math.cos;
var tan=Math.tan;
var atan2=Math.atan2;
var sqrt=Math.sqrt;
var PI=Math.PI;
var PI2=PI*2;
var PI180=PI/180;
var atan2p=function(source,dest){
    return atan2(dest[1]-source[1],dest[0]-source[0]);
};
var sqrt2=function(source,dest){
    return sqrt((source[0]-dest[0])*(source[0]-dest[0])+(source[1]-dest[1])*(source[1]-dest[1]));
};

function miscApplyAttr(oObject,oAttribute){
    for(var i in oAttribute){
        oObject[i]=oAttribute[i];
    }
}

function _vec3(vX,vY,vZ){
    return [vX,vY,vZ];
}

function StgMove(){
    this.pos=[0,0,0];
    this.speed=0;
    this._speed=[0,0,0];
    this.speed_angle=0;
    this.speed_angleY=0;
    this.max_speed=0;
    this.acceleration=0;
    this._acceleration=[0,0,0];
    this.acceleration_angle=0;
    this.speed_angle_acceleration=0;
    this.acceleration_angle_default=1;
}

function StgHitDef(){
    this.type=0;
    this.pos=[0,0];
    this.rpos=[0,0];
    this.range=0;
}

function stgDist(p1,p2){
    if(p1.type==0 && p2.type==0){
        return sqrt2(p1.rpos,p2.rpos)-p1.range-p2.range;
    }
    return 100;
}



function StgObject(){
    this.script=null;
    this.move=null;
    this.render=null;
    this.hitdef=null;
    this.hitby=null;
}

function StgRender(sShaderName){
    this.shader_name=sShaderName;
    this.procedures={};
}

function StgProcedure(sTarget,iStartLayer,iEndLayer){
    this.render_target=sTarget;
    this.layers=[];
    for(var i=iStartLayer;i<=iEndLayer;i++){
        this.layers[i]=1;
    }
    this.shader_order=[];
}

function _tickMove(stgMove){
    stgMove.speed_angle+=stgMove.speed_angle_acceleration;
    if(!stgMove.speed_angleY){
        stgMove._speed[0]=stgMove.speed*cos(stgMove.speed_angle);
        stgMove._speed[1]=stgMove.speed*sin(stgMove.speed_angle);
    }else{
        stgMove._speed[0]=stgMove.speed*cos(stgMove.speed_angle)*cos(stgMove.speed_angleY);
        stgMove._speed[1]=stgMove.speed*sin(stgMove.speed_angle)*cos(stgMove.speed_angleY);
        stgMove._speed[2]=stgMove.speed*sin(stgMove.speed_angleY);
    }
    if(stgMove.acceleration_angle_default){
        stgMove.acceleration_angle=stgMove.speed_angle;
    }
    stgMove.pos[0]+=stgMove._speed[0];
    stgMove.pos[1]+=stgMove._speed[1];
    stgMove.pos[2]+=stgMove._speed[2];
    stgMove._acceleration[0]=stgMove.acceleration*cos(stgMove.acceleration_angle);
    stgMove._acceleration[1]=stgMove.acceleration*sin(stgMove.acceleration_angle);
    stgMove._speed[0]+=stgMove._acceleration[0];
    stgMove._speed[1]+=stgMove._acceleration[1];
    stgMove._speed[2]+=stgMove._acceleration[2];
    stgMove.speed=sqrt( stgMove._speed[0]* stgMove._speed[0]+ stgMove._speed[1]* stgMove._speed[1]+ stgMove._speed[2]* stgMove._speed[2]);
    if(stgMove.max_speed && stgMove.speed>stgMove.max_speed)stgMove.speed=stgMove.max_speed;
    stgMove.speed_angle=atan2(stgMove._speed[1],stgMove._speed[0]);
}

function _StgDefaultPlayer(stgPlayerObject){
    stgPlayerObject.character_name="";
    stgPlayerObject.slot=0;
    stgPlayerObject.life=3;
    stgPlayerObject.bomb=3;
    stgPlayerObject.power=0;
    stgPlayerObject.graze=0;
    stgPlayerObject.point_bonus=10000;
    stgPlayerObject.point=0;
    stgPlayerObject.pos=[0,0,0];
    stgPlayerObject.key=[];
    stgPlayerObject.state=stg_const.PLAYER_NORMAL;
    stgPlayerObject.invincible=0;
    stgPlayerObject.bombing=0;
    stgPlayerObject.move_speed=[4,2];
    stgPlayerObject.slow=0;
    stgPlayerObject.no_move=0;
    stgPlayerObject.no_shot=0;
    stgPlayerObject.no_bomb=0;
    stgPlayerObject.type=stg_const.OBJ_PLAYER;
    stgPlayerObject.score=0;
    stgPlayerObject.hiscore=0;

    stgPlayerObject.counter_bomb_time=12;
    stgPlayerObject.down_time=30;
    stgPlayerObject.rebirth_time=30;
    stgPlayerObject.rebirth_x=192;
    stgPlayerObject.rebirth_y=400;
    stgPlayerObject.start_time=240;

    stgPlayerObject.graze_range=15;
    stgPlayerObject.layer=stg_const.LAYER_PLAYER;
}


function _frameMoveCheck(){

}

function _stgMainLoop_Render(){
    for(var i in stg_display){
        _runProcedure(stg_display[i]);
    }
}
function _stgMainLoop_RunScript(){
    for(var i in _pool){
        if(_pool[i].active){
            if(_pool[i].script){
                stg_local_player=stg_players[stg_local_player_pos];
                stg_target=_pool[i];
                _pool[i].script();
            }
        }
    }
    stg_target=null;
}
function _stgMainLoop_RemoveObjects(){
    var i;
    for(i=0;i<_pool.length;i++){
        if(_pool[i].remove){
            if(_pool[i].finalize){
                stg_target=_pool[i];
                _pool[i].finalize();
            }
        }
    }
    var j=0;
    for(i=0;i<_pool.length;i++){
        if(!_pool[i].remove){
            if(j!=i){
                _pool[j]=_pool[i];
                delete _pool[i];
            }
            j++;
        }
    }
    _pool.length=j;
}

function _stgMainLoop(){
    if(!_stg_no_input){
        if(stg_wait_for_all_texture){
            if(stgCheckResources()){
                return;
            }
            stg_wait_for_all_texture=0;
            return;
        }
        _stgMainLoop_GameStateChanger();
        _stgMainLoop_SendInput();
    }
    _stg_no_input=!_stgMainLoop_GetInput();
    if(_stg_no_input)return;
    _stgMainLoop_Pause();
    _stgMainLoop_Engine();
    _stgMainLoop_Hit();
    _stgMainLoop_PlayerState();
    _stgMainLoop_RunScript();
    _stgMainLoop_RemoveObjects();
    _stgMainLoop_Render();
}
var stg_fps=0;
var stg_stop=0;
var stg_clip=16;
var stg_frame_w=384;
var stg_frame_h=448;

var stg_hit_check=[
    [0,1,1],
    [1,0,1],
    [1,1,0]
];

function _stgMainLoop_Hit(){
    var i;
    var j;
    for(var i in _hit_by_pool){
        var a=_hit_by_pool[i];
        var s=a.side;
        if(a.type==stg_const.OBJ_PLAYER){
            for (var j in _hit_pool) {
                var b = _hit_pool[j];
                if (stg_hit_check[s][b.side]) {
                    var d = stgDist(a.hitby, b.hitdef);
                    if(b.type==stg_const.OBJ_BULLET && d< a.graze_range){
                        if(!b.grazed){
                            b.grazed=[];
                        }
                        if(!b.grazed[a.slot]){
                            b.grazed[a.slot]=1;
                            a.graze++;
                            if(a.on_graze){
                                a.on_graze(b);
                            }
                        }
                    }

                    if (d < 0) {
                        //console.log(b);
                        a.hit_by_list.push(b);
                        b.hit_list.push(a);
                        if(b.type==stg_const.OBJ_BULLET){
                            if(d< a.graze)
                                if(!b.invincible){
                                    if(!a.invincible && a.state==stg_const.PLAYER_NORMAL){
                                        a.state=stg_const.PLAYER_HIT;
                                        a.invincible= a.counter_bomb_time;
                                    }
                                    b.penetrate--;
                                    if(b.penetrate<=0){
                                        b.fade_remove=33;
                                        b.alpha=255;
                                        b.ignore_hit=1;
                                    }


                                }
                        }

                        if(b.type==stg_const.OBJ_ENEMY){
                            if(!a.invincible && a.state==stg_const.PLAYER_NORMAL){
                                a.state=stg_const.PLAYER_HIT;
                                a.invincible= a.counter_bomb_time;
                            }
                        }

                        if(b.type==stg_const.OBJ_ITEM){
                            if(b.content){
                                for(var i in b.content){
                                    if(!(a.content===undefined))a.content+= b.content;
                                }
                            }
                            if(b.on_collect)b.on_collect(a);
                            stgDeleteObject(b);
                        }
                    }
                }
            }
        }else {
            for (var j in _hit_pool) {
                var b = _hit_pool[j];
                if (stg_hit_check[s][b.side]) {
                    var d = stgDist(a.hitby, b.hitdef);
                    if (d < 0) {
                        //console.log(b);
                        a.hit_by_list.push(b);
                        b.hit_list.push(a);
                    }
                }
            }
        }
    }
}

function _stgMainLoop_HitScript(){
    var i;
    var j;
    var a;
    var b;
    if(stg_game_state==stg_const.GAME_RUNNING) {
        for (i = 0; i < stg_players_number; i++) {
            a = stg_players[i];
            if (a.active) {
               if(a.hit_by_list.length){
                   for(j in a.hit_by_list){
                       b=a.hit_by_list[j];

                   }
               }
            }

        }
    }
}

var stg_frame_height=448;
var stg_frame_width=384;

function _stgMainLoop_PlayerState(){
    var a;
    var i;
    if(stg_game_state==stg_const.GAME_RUNNING) {
        for (i = 0; i < stg_players_number; i++) {
            a = stg_players[i];
            if(!a)a={};
            if (a.active) {
                a.slow = a.key[stg_const.KEY_SLOW];

                if(a.invincible>0){
                    a.invincible--;
                    if(a.invincible==0 && a.state==stg_const.PLAYER_REBIRTH){
                        a.state=stg_const.PLAYER_NORMAL;
                        a.invincible= a.start_time;
                    }
                    if(a.invincible==0 && a.state==stg_const.PLAYER_HIT){
                        a.state=stg_const.PLAYER_DEAD;
                        a.invincible= a.down_time;
                    }
                    if(a.invincible==0 && a.state==stg_const.PLAYER_DEAD){
                        a.state=stg_const.PLAYER_REBIRTH;
                        a.invincible= a.rebirth_time;
                    }
                }

            }

        }
    }
}
function _stgMainLoop_Engine(){
    _hit_by_pool=[];
    _hit_pool=[];
    var i;
    var a;
    if(stg_game_state==stg_const.GAME_RUNNING) {
        for (i = 0; i < stg_players_number; i++) {
            a = stg_players[i];
            if (a.active) {
                a.slow = a.key[stg_const.KEY_SLOW];

                if (!a.no_move && a.state==stg_const.PLAYER_NORMAL) {
                    var x = a.key[stg_const.KEY_RIGHT] - a.key[stg_const.KEY_LEFT];
                    //  var x=a.key[10]-a.key[9];
                    var y = a.key[stg_const.KEY_DOWN] - a.key[stg_const.KEY_UP];
                    if (x || y) {
                        var s = a.move_speed[a.slow];
                        if (x && y) {
                            s = s / 1.4142;
                        }
                        x = x * s;
                        y = y * s;
                        a.pos[0] += x;
                        a.pos[1] += y;
                    }
                }
                if(a.state==stg_const.PLAYER_REBIRTH){
                    a.pos[0]= a.rebirth_x;
                    a.pos[1]= (stg_frame_height+50-a.rebirth_y)* a.invincible/ a.rebirth_time+a.rebirth_y;
                }else {
                    if (a.pos[0] > stg_frame_w - stg_clip)a.pos[0] = stg_frame_w - stg_clip;
                    if (a.pos[0] < stg_clip)a.pos[0] = stg_clip;
                    if (a.pos[1] > stg_frame_h - stg_clip)a.pos[1] = stg_frame_h - stg_clip;
                    if (a.pos[1] < stg_clip)a.pos[1] = stg_clip;
                }

            }

        }
    }
    for(i=0;i<_pool.length;i++){
        if(_pool[i].active){
            a=_pool[i];
            if(!a.pos){
                a.pos=[0,0,0];
            }
            if(!a.rotate){
                a.rotate=[0,0,0];
            }
            if(a.move){
                _tickMove(a.move);
                a.pos[0]= a.move.pos[0];
                a.pos[1]= a.move.pos[1];
                a.pos[2]= a.move.pos[2];

            }
            if(a.move_rotate){
                a.rotate[2]= a.move.speed_angle;
            }
            if(a.opos){
                a.pos[0]+= a.opos[0];
                a.pos[1]+= a.opos[1];
                a.pos[2]+= a.opos[2];
            }
            if(a.base){
                if(a.base.type==stg_const.BASE_COPY){
                    a.pos[0]= a.base.target.pos[0];
                    a.pos[1]= a.base.target.pos[1];
                    a.pos[2]= a.base.target.pos[2];
                    a.rotate[0]= a.base.target.rotate[0];
                    a.rotate[0]= a.base.target.rotate[0];
                    a.rotate[0]= a.base.target.rotate[0];
                }else if(a.base.type==stg_const.BASE_MOVE){
                    a.pos[0]+= a.base.target.pos[0];
                    a.pos[1]+= a.base.target.pos[1];
                    a.pos[2]+= a.base.target.pos[2];
                }

                if(a.base.auto_remove && a.base.target.remove){
                    if(!a._auto_remove) {
                        a._auto_remove=a.base.auto_remove;
                        a._auto_remove--;
                        if(a._auto_remove<=0) {
                            stgDeleteObject(a);
                        }
                    }else{
                        a._auto_remove--;
                        if(a._auto_remove<=0) {
                            stgDeleteObject(a);
                        }
                    }
                }
            }
            if(a.look_at){
                if(a.look_at.turn_rate){
                    var t=sArrowRotateTo(a.rotate[2],sLookAt(a.pos, a.look_at.target.pos));
                    if(t>a.look_at.turn_rate)t=a.look_at.turn_rate;
                    if(t<-a.look_at.turn_rate)t=-a.look_at.turn_rate;
                    a.rotate[2]+=t;
                }else{
                    a.rotate[2]=sLookAt(a.pos, a.look_at.target.pos);
                }
            }
            if(a.self_rotate){
                a.rotate[2]+=a.self_rotate;
            }
            if(a.orotate){
                a.rotate[0]+= a.orotate[0];
                a.rotate[1]+= a.orotate[1];
                a.rotate[2]+= a.orotate[2];
            }
            if(a.hitby && !a.ignore_hit){
                a.hitby.rpos[0]= a.pos[0]+ a.hitby.pos[0];
                a.hitby.rpos[1]= a.pos[1]+ a.hitby.pos[1];
                a.hitby.rd= a.rotate[2];
                _hit_by_pool.push(a);
                a.hit_by_list=[];
            }
            if(a.hitdef && !a.ignore_hit){
                a.hitdef.rpos[0]= a.pos[0]+ a.hitdef.pos[0];
                a.hitdef.rpos[1]= a.pos[1]+ a.hitdef.pos[1];
                a.hitdef.rd= a.rotate[2];
                _hit_pool.push(a);
                a.hit_list=[];
            }
            if(a.fade_remove){
                if(a.alpha===undefined){
                    a.alpha=255;
                }
                a.alpha-=a.fade_remove;
                if(a.alpha<=0){
                    stgDeleteObject(a);
                }
            }

            if (a.type == stg_const.OBJ_BULLET || a.type == stg_const.OBJ_ENEMY || a.type == stg_const.OBJ_ITEM) {
                if(!a.keep) {
                    if (a.pos[0] > stg_frame_w +30 || a.pos[0] < stg_clip -30 ||a.pos[1] > stg_frame_h +30||a.pos[1] < stg_clip -30){
                        stgDeleteObject(a);
                    }
                }
            }
        }
    }
}
var _stg_no_input=0;
function stgCreateRefresher(){
    var last_f=(new Date()).getTime();
    var uf=last_f;
    var cnt=0;
    var tictoc=0;
    var e=function(){
        last_f=(new Date()).getTime();
        _stgMainLoop();
        if(_stg_no_input==1){
            setTimeout(e,1);
            return;
        }
        cnt++;
        var f=(new Date()).getTime();
        var df=f-last_f;
        last_f=f;
        if(df>16)df=16;
        if(cnt==30){
            stg_fps=30*1000/(last_f-uf);
            uf=last_f;
            cnt=0;
        }
        if(stg_stop){
            return;
        }
        if(stg_refresher_type){
            tictoc=(tictoc+1)%3;
            setTimeout(e,15-df+(tictoc==0?1:0));
        }else {
            requestAnimationFrame(e);
        }
    };
    e();
}

function stgAddObject(oStgObject){
    if(!oStgObject)return;
    _pool.push(oStgObject);
    var tmp=stg_target;
    if(tmp){
        if(!(tmp.side===undefined)){
            oStgObject.side=tmp.side;
        }
        oStgObject.parent=tmp;
    }
    stg_target=oStgObject;
    oStgObject.active=1;
    oStgObject.remove=0;
    if(oStgObject.init){
        oStgObject.init();
    }
    if(oStgObject.render){
        if(!oStgObject.pos){
            oStgObject.pos=[0,0,0];
            if(oStgObject.move) {
                oStgObject.pos[0] = oStgObject.move.pos[0];
                oStgObject.pos[1] = oStgObject.move.pos[1];
                oStgObject.pos[2] = oStgObject.move.pos[2];
            }else if(tmp && tmp.pos){
                oStgObject.pos[0] = tmp.pos[0];
                oStgObject.pos[1] = tmp.pos[1];
                oStgObject.pos[2] = tmp.pos[2];
            }
        }
        if(!oStgObject.rotate){
            oStgObject.rotate=[0,0,0];
            if(oStgObject.move && oStgObject.move_rotate) {
                oStgObject.rotate[2] = oStgObject.move.speed_angle;
            }
        }
    }
    stg_target=tmp;
}

function stgDeleteObject(oStgObject){
    oStgObject.remove=1;
    oStgObject.active=0;
}
var _temp_pool;
function _stgMainLoop_Pause(){
    if(stg_game_state==stg_const.GAME_RUNNING){
        if(stg_system_input[stg_const.KEY_PAUSE] && _stg_pause_lock==0){
            _stgChangeGameState(stg_const.GAME_PAUSED);
        }else{
            _stg_pause_lock=0;
        }
    }
}
var _stg_pause_lock=0;
function _stgMainLoop_GameStateChanger(){
    if(!(_stg_next_game_state===undefined)){
        if(_stg_next_game_state==stg_const.GAME_PAUSED){
            _temp_pool=[_pool,stg_procedures,stg_display];
            stg_procedures=[];
            stg_display=[];
            _pool=[];
            if(stg_in_replay){
                stg_players_number=_replay_watchers;
            }
            stgAddObject(stg_pause_script);
        }else if(_stg_next_game_state==stg_const.GAME_RUNNING){
            if(stg_game_state==stg_const.GAME_PAUSED){
                stg_procedures=_temp_pool[1];
                stg_display=_temp_pool[2];
                _pool=_temp_pool[0];
                _temp_pool=[];
                _stg_pause_lock=1;
                if(stg_in_replay){
                    stg_players_number=stg_players.length;
                }
            }else if(stg_game_state==stg_const.GAME_MENU){
                if(!stg_in_replay)replayClear();
                _stgStartLevel();
            }else if(stg_game_state==stg_const.GAME_RUNNING){
                _stgStartLevel();
            }
        }else if(_stg_next_game_state==stg_const.GAME_MENU){
            if(stg_game_state==stg_const.GAME_PAUSED){
                stg_procedures=_temp_pool[1];
                stg_display=_temp_pool[2];
            }else if(stg_game_state==stg_const.GAME_MENU){

            }else if(stg_game_state==stg_const.GAME_RUNNING){
                _pool=[];
            }
            stgAddObject(stg_menu_script);
        }
        stg_game_state=_stg_next_game_state;
        _stg_next_game_state=undefined;
    }
}

function stgCheckResources(){
    var f=0;
    for(var i in stg_textures){
        if(stg_textures[i]){
            if(stg_textures[i].ready){

            }else{
                f++;
            }
        }
    }
    return f;
}

function _stgChangeGameState(iNextGameState){
    _stg_next_game_state=iNextGameState;
}

function stgAddShader(sName,oShader){
    stg_shaders[sName]=oShader;
    oShader.shader_init();
}
var _start_level=[];
function stgStartLevel(sLevelName,vaPlayerNames,oCommonData){
    _start_level=[sLevelName,vaPlayerNames,oCommonData];
    _stgChangeGameState(stg_const.GAME_RUNNING);
}

function _stgStartLevel(){
    for(var i in _pool){
        stgDeleteObject(_pool[i]);
    }
    _pool=[];
    if(!stg_in_replay){
        _start_level[2].rand_seed=stg_rand_seed[0];
    }else{
        stg_rand_seed[0]=_start_level[2].rand_seed;
    }
    stg_common_data=clone(_start_level[2]);
    stg_target=stg_const.TARGET_ENEMY;
    stgAddObject(stg_system_script);
    stgAddObject(stg_level_templates[_start_level[0]]);

    stg_players=[];
    for(var i=0;i<_start_level[1].length;i++){
        _addPlayer(_start_level[1][i],i)
    }
    stg_players_number=stg_players.length;
    if(!stg_in_replay) {
        replayNewLevel();
        _stg_save_input=1;
    }else{
        _stg_save_input=1;
    }

}
function _addPlayer(sPlayerName,iSlot){
    stg_target=stg_const.TARGET_PLAYER;
    var b=new StgObject();
    _StgDefaultPlayer(b);
    stg_players[iSlot]=b;
    var p=new stg_player_templates[sPlayerName](iSlot);
    stgAddObject(p);
}

function stgStart(){
    stg_game_state=stg_const.GAME_MENU;
    _stgChangeGameState(stg_const.GAME_MENU);
    stgCreateRefresher();
    stg_players_number=0;
    stg_players=[];
}

function stgDeleteSelf(){
    stgDeleteObject(stg_target);
}

function _stgEndLevel(){

}

function stgCloseLevel(){
    _stgEndLevel();
    _stgChangeGameState(stg_const.GAME_MENU);
    stg_common_data.menu_state=1;
}
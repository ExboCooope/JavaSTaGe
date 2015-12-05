/**
 * Created by Exbo on 2015/11/23.
 */
function Default_Player_Sikieiki(iPosition){
    this.player_pos=iPosition;
    this.side=stg_const.SIDE_PLAYER;
}

Default_Player_Sikieiki.prototype.init=function(){
    this.side=stg_const.SIDE_PLAYER;
    stgCreateImageTexture("siki_body","pl13.png");
    stgCreateImageTexture("pl_effect","etama2.png");
    var a=new StgObject();
    this.body=a;



    var b=new StgObject();
    _StgDefaultPlayer(b);
    b.render=new StgRender("sprite_shader");
    renderCreate2DTemplateA1("siki","siki_body",0,0,32,48,32,0,0,1);
    renderApply2DTemplate(b.render,"siki",0);
    b.layer=stg_const.LAYER_PLAYER;
    if(stg_common_data.player){
        if(stg_common_data.player[this.player_pos]){
            miscApplyAttr(b,stg_common_data.player[this.player_pos]);
        }
    }

    stg_players[this.player_pos]=b;
    b.hitby=new StgHitDef();
    b.hitby.range=2;
    b.pos=[stg_frame_width/2,stg_frame_height*0.8,0];
    b.rotate=[0,0,0];
    a.base={target:b,type:stg_const.BASE_COPY};
    a.pos=[stg_frame_width/2,stg_frame_height*0.8,0];
    stgAddObject(b);
    stgAddObject(a);

    var c=new StgObject();
    c.render=new StgRender("sprite_shader");
    c.self_rotate=0.04;
    c.base= a.base;
    renderCreate2DTemplateA1("pan_ding_dian","pl_effect",0,112,64,64,64,0,0,1);
    renderApply2DTemplate(c.render,"pan_ding_dian",0);
    c.layer=stg_const.LAYER_HINT;
    c.alpha=0;
    c.script=function(){

        if(b.state==stg_const.PLAYER_DEAD){
            b.alpha=0;
        }else{
            stg_target.alpha=stg_target.base.target.slow?(stg_target.alpha+40>255?255:stg_target.alpha+40):(stg_target.alpha-16>0?stg_target.alpha-16:0);
            b.alpha=255;
        }
    };
    stgAddObject(c);
};

stg_player_templates.siki=Default_Player_Sikieiki;
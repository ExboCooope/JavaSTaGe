/**
 * Created by Exbo on 2015/11/27.
 */

stageA1={};
stageA1.init=function(){
    stageA1.f=0;
    stageA1.side=stg_const.SIDE_ENEMY;
};

stageA1.script=function(){
    var f=stageA1.f;
    stageA1.f++;
    if(f%3==0) {
        stgCreateShotA1(stg_rand(stg_frame_w), stg_rand(stg_frame_h / 3), 3, stg_rand(180), "mDD", 0, stg_rand(4) >> 0);
    }
};

stg_level_templates.A1=stageA1;
/**
 * Created by Exbo on 2015/12/3.
 */
stageP1={};
stageP1.init=function(){
    stageP1.f=0;
    stageP1.side=stg_const.SIDE_ENEMY;

    var bltcnt = 0;
    var rst = 0;
    var a1={};
    var bltfunc = function () {
        if (stg_target.move.pos[0] > stg_frame_w) {
            stg_target.move.pos[0] = stg_frame_w;
            stg_target.move.speed_angle = PI - stg_target.move.speed_angle;
        }
        if (stg_target.move.pos[0] < 0) {
            stg_target.move.pos[0] = 0;
            stg_target.move.speed_angle = PI - stg_target.move.speed_angle;
        }
        if (stg_target.move.pos[1] > stg_frame_h) {
            stg_target.move.pos[1] = stg_frame_h;
            stg_target.move.speed_angle = -stg_target.move.speed_angle;
        }
        if (stg_target.move.pos[1] < 0) {
            stg_target.move.pos[1] = 0;
            stg_target.move.speed_angle = -stg_target.move.speed_angle;
        }
        if (rst >= 0) {
            stgDeleteObject(stg_target);
            rst--;
            bltcnt--;
        }
    };
    a1.script = function () {
        if (stg_system_input[0]) {
            stgCreateShotA1(50,50,3,Math.random()*360,"mDD",0,(Math.random()*8)>>1).script=bltfunc;
            bltcnt++;
        }
        if (stg_system_input[2]) {
            rst = 1;
        }
    };
    stgAddObject(a1);
    defaultDrawBackground("backTex");

    var ay = new RenderText(560, 420);
    ay.script = function () {
        ay.render.text = "" + _pool.length + "";
    };

    //stgCreateShotA1(100, 100, 0, 45, "mDD", 0, 0);
};


stg_level_templates["压力测试"]=stageP1;

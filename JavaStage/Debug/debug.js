/**
 * Created by Exbo on 2015/11/23.
 */
function _debug2D03() {
    /*
     var c=createCanvas(640,480);
     dc=c;
     var ctx= c.getContext("2d");
     ctx.fillStyle="#888";
     ctx.fillRect(0,0,640,480);
     document.body.appendChild(c);
     */

    var game_startup_object = {};
    var startup_script = function () {
        //载入图片
        bullet00Assignment();
        stgCreateImageTexture("siki_body","pl13.png");
        stgCreateImageTexture("pl_effect","etama2.png");
        stgCreateImageTexture("backTex", "Default_SystemBackground.png");
        stg_pause_script=default_pause_script;
        stg_game_state=stg_const.GAME_RUNNING;
        //初始化输入

    };
    var check_texture = function () {
        if (!stgCheckResources()) {

            stgDeleteObject(stg_target);
            //创建canvas
            stgCreateCanvas("frame", 384, 448, stg_const.TEX_CANVAS2D);
            stgCreateCanvas("back", 640, 480, stg_const.TEX_CANVAS2D);
            stgCreateCanvas("ui", 640, 480, stg_const.TEX_CANVAS2D);
            stgShowCanvas("back", 0, 0, 0, 0, 0);
            stgShowCanvas("frame", 32, 16, 0, 0, 1);
            stgShowCanvas("ui", 0, 0, 0, 0, 2);
            stgAddShader("sprite_shader", default_2d_shader);
            //创建背景渲染器
            var a2 = new StgProcedure("back", 0, 19);
            a2.shader_order = ["testShader2"];
            stg_procedures["drawBackground"] = a2;
            //创建游戏区渲染器
            a2 = new StgProcedure("frame", 20, 80);
            a2.background = "#888";
            a2.shader_order = ["sprite_shader"];
            stg_procedures["drawFrame"] = a2;
            //创建UI渲染器
            a2 = new StgProcedure("ui", 81, 100);
            a2.shader_order = ["testShader2"];
            stg_procedures["drawUI"] = a2;
            //创建渲染流程
            stg_display = ["drawBackground", "drawFrame", "drawUI"];
            //创建子弹和应用贴图
            var t1 = renderCreate2DTemplateA1("sprite_shader", "bullet", 0, 256, 32, 32, 32, 0, 0, 1);
            var a1 = new StgObject;
            //_StgDefaultPlayer(a1);
            //a1.render = new StgRender("bullet_shader");
            //_renderApply2DTemplate(a1.render,t1,0);
            //stg_players[0]=a1;
            // a1.self_rotate=0.05;
            //a1.layer = 40;
            //a1.pos = [135, 70, 0];
            //a1.rotate = [0, 0, 90*PI180];
            var bltcnt = 0;
            var rst = 0;
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
            a1.side=stg_const.SIDE_ENEMY;
            a1 = new StgObject;
            a1.render = new StgRender("testShader2");
            miscApplyAttr(a1.render, {type: 3, x: 0, y: 0, w: 640, h: 480, texture: "backTex"});
            a1.layer = 0;
            a1.pos = [0, 0, 0];
            a1.rotate = [0, 0, 0];
            var a1t = 1;
            a1.script = function () {
                if (a1t == 0) {
                    stgDeleteObject(stg_target);
                }
                a1t--;
            };
            stgAddObject(a1);

            var ax = new RenderText(560, 460);
            ax.script = function () {
                ax.render.text = "" + (stg_fps >> 0) + " FPS";
            };
            var ay = new RenderText(560, 420);
            ay.script = function () {
                ay.render.text = "" + bltcnt + "";
            };

            stgAddObject(new Default_Player_Sikieiki(0));
            stgCreateInput(0);
            //stgCreateShotA1(100, 100, 0, 45, "mDD", 0, 0);
        }
    };
    game_startup_object.init = startup_script;
    game_startup_object.script = check_texture;
    game_startup_object.side=stg_const.SIDE_ENEMY;
    stgAddObject(game_startup_object);
    stgCreateRefresher();
}

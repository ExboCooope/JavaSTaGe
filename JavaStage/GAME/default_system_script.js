/**
 * Created by Exbo on 2015/11/27.
 */

var default_system_script={};
default_system_script.init=function(){
    var p=stg_target;
    p.fps_drawer=new RenderText(560, 460);
    p.game_diffi_drawer=new RenderText(500,10);
    p.game_diffi_drawer.textAlign="center";
    p.high_score_title=new RenderText(430,40);
    p.high_score_title.render.text="最高分";
    p.high_score_drawer=new RenderText(620,40);
    p.high_score_drawer.textAlign="end";
    p.score_title=new RenderText(430,60);
    p.score_title.render.text="得分";
    p.score_drawer=new RenderText(620,60);
    p.score_drawer.textAlign="end";
};


default_system_script.script=function(){
    var p=stg_target;
    p.fps_drawer.render.text="" + (stg_fps >> 0) + " FPS";
    p.game_diffi_drawer.render.text=""+(stg_common_data.difficulty||"Normal");
    p.high_score_drawer.render.text=stg_local_player.hiscore+"";
    p.score_drawer.render.text=stg_local_player.score+"";

    if(stg_replay_end==1){
        stgCloseLevel();
        stg_in_replay=0;
        stg_replay_end=0;
    }
};
/**
 * Created by Exbo on 2015/11/27.
 */
default_menu_script={loaded:0};
default_menu_script.init=function(){
    stg_in_replay=0;
    var t=stg_target;
    if(!t.loaded) {
        stgLoadKeyMap();
        t.loaded=1;
        bullet00Assignment();
        stgCreateImageTexture("siki_body", "pl13.png");
        stgCreateImageTexture("pl_effect", "etama2.png");
        stgCreateImageTexture("backTex", "Default_SystemBackground.png");
        stgCreateImageTexture("backTex1", "System_ScriptSelect_Background.png");
        stg_pause_script = default_pause_script;
        stg_system_script = default_system_script;
        gLoadMenuSystem();
        stgCreateCanvas("frame", 384, 448, stg_const.TEX_CANVAS2D);
       // stgCreateCanvas("frame", 384, 448, stg_const.TEX_CANVAS2D);
        stgCreateCanvas("back", 640, 480, stg_const.TEX_CANVAS2D);
        stgCreateCanvas("ui", 640, 480, stg_const.TEX_CANVAS2D);
        stgShowCanvas("back", 0, 0, 0, 0, 0);
      //  stgShowCanvas("frame", 32, 16, 0, 0, 1);
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
      //  stg_display = ["drawBackground", "drawFrame", "drawUI"];
        stg_display = ["drawBackground", "drawUI"];


        stg_wait_for_all_texture=1;

        stgCreateInput(0);
        stg_rand_seed[0]=new Date().getTime();

    }
    defaultDrawBackground("backTex1");
    //Check Common Data
    if(stg_common_data.menu_state==0){

    }else if(stg_common_data.menu_state==1){
        //display replay save menu
        stg_common_data.menu_state=0;
        stgAddObject(g_replay_save);
        stgDeleteObject(t);
    }

    checkKeyChange();
};
default_menu_script.script=function(){
    //defaultDrawBackground("backTex1");
    var g=0;
    var t=checkKeyChange();
    if(t.length){
        if(t[0]==82){
            stgResetKeyMap();
        }
        g=1;
        if(TextMenuItem.sellock || TextMenuItem.backlock){

        }else {
            stgDeleteObject(stg_target);
            TextMenuItem.sellock = 1;
            stgAddObject(default_menu_script.menu1);
            return;
        }
    }

    if(g==0){
        TextMenuItem.sellock=0;
        TextMenuItem.backlock=0;
    }
};

var diff_sel_menu={};
var g_diff=["EASY","NORMAL","HARD","LUNATIC","EXTRA"];

var g_replay_save={};
var locker;
var g_mitem;

function gLoadMenuSystem(){
    stg_players_number=1;
    var a;
    var ks2;
    var g_keysetter_reset={script:function(){
        g_keysetter.active=1;
        tf2();
        stgDeleteSelf();
    }};
    var tf2=function(){

        for(var i in g_ks){
            g_keysetter.menu_pool[i].mtext=" " + g_ks[i]+" "+temp_key[i].toString();
        }
    };
    var tf3=function(){

        for(var i in g_ks){
            g_keysetter.menu_pool[i].mtext=" " + g_ks[i];
        }
    };
    var g_keysetter2_reset={init:function(){
        g_keysetter2.active=0;
        stg_target.menu_item.render.text="[???]";
        checkKeyChange();
    },script:function(){
        var k=checkKeyChange();
        if(k.length){
            temp_key[stg_target.menu_item.kid][stg_target.menu_item.kc]=k[0];
            var ta=stg_target.parent.select_id;
            stg_target.parent.gDeleteMenu();
            ks2(stg_target.menu_item.kid);
            stgAddObject(g_keysetter2);
            g_keysetter2.select_id=ta;
            stgDeleteSelf();
            TextMenuItem.sellock=1;
            TextMenuItem.backlock=1;
        }
    }};
    var g_keysetter2_add={init:function(){
        g_keysetter2.active=0;
        stg_target.menu_item.render.text="[???]";
        checkKeyChange();
    },script:function(){
        var k=checkKeyChange();
        if(k.length){
            temp_key[stg_target.menu_item.kid][stg_target.menu_item.kc]=k[0];
            g_keysetter2.gDeleteMenu();
            var ta=g_keysetter2.select_id;
            ks2(stg_target.menu_item.kid);
            stgAddObject(g_keysetter2);
            g_keysetter2.select_id=ta;
            stgDeleteSelf();
            TextMenuItem.sellock=1;
            TextMenuItem.backlock=1;
        }
    }};
    g_replay_save=new MenuHolderA1([40,40],[0,30],g_replay_save);
    g_replay_save.finalize=function(){
        stgHideCanvas("frame");
        stgClearCanvas("ui");
    };
    default_menu_script.menu1=new MenuHolderA1([40,40],[0,30],default_menu_script);
    diff_sel_menu=new MenuHolderA1([40,40],[0,30],default_menu_script.menu1);
    g_keysetter=new MenuHolderA1([40,40],[0,30],default_menu_script.menu1);

    a=new TextMenuItem("游戏开始",1,1,diff_sel_menu,1);
    default_menu_script.menu1.pushItem(a);
    a=new TextMenuItem("Extra",1,1,{script:function(){console.log(1);stgDeleteSelf();}},0);
    default_menu_script.menu1.pushItem(a);
    a.selectable=0;
    a=new TextMenuItem("练习模式",1,1,{script:function(){console.log(1);stgDeleteSelf();}},0);
    default_menu_script.menu1.pushItem(a);
    locker={init:function(){locker.a=60},script:function(){if(!locker.a){stgDeleteSelf();}else{locker.a--}}};
    a=new TextMenuItem(stg_players_number==2?"切换为单人模式":"切换为多人模式",1,1,{script:
        function(){

            if(!locker.a) {
                stgAddObject(locker);
                if (stg_players_number == 1) {
                    gSampleMultiplayer({script: function () {

                        stgDeleteSelf();
                    }});

                } else {
                    g_mitem.mtext = "切换为多人模式";
                    //stg_mp_disconnect_object=null;
                    stg_mp_status = 0;
                    mpClose();
                    stg_local_player_pos = 0;
                    MenuHolderA1.sellock = 1;

                    stg_players_number = 1;
                    stgCreateInput(0);
                }
            }else if(locker.remove){
                stgAddObject(locker);
            }
            stgDeleteSelf();
        }
    },0);
    g_mitem=a;
    default_menu_script.menu1.pushItem(a);
    a=new TextMenuItem("回放",1,1,{script:function(){    stgShowCanvas("frame", 32, 16, 0, 0, 1);

        stg_display = ["drawBackground", "drawFrame", "drawUI"];replayStartLevel(0);stgDeleteSelf();}},1);
    default_menu_script.menu1.pushItem(a);
    a=new TextMenuItem("键位设置",1,1,{init:function(){temp_key=clone(_key_map);stgDeleteSelf();stgAddObject(g_keysetter)}},1);
    default_menu_script.menu1.pushItem(a);

    a=new TextMenuItem("保存录像",1,1,{script:function(){
        downloadFile("test.rpy",packReplay());
        stgDeleteSelf();
    }},0);
    g_replay_save.pushItem(a);
    a=new TextMenuItem("重新开始",1,1,g_starter,1);
    a.selectable=0;
    g_replay_save.pushItem(a);
    a=new TextMenuItem("返回",1,1,default_menu_script.menu1,1);
    g_replay_save.pushItem(a);




    for(var i in stg_level_templates) {
        a = new TextMenuItem(" "+i, 1, 1, {level:i,script: function () {
            g_starter.level=stg_target.level;
            g_starter.player_sel=[];
            for(var i=0;i<stg_players_number;i++){
                g_starter.player_sel.push("siki");
            }
            stgDeleteSelf();
            stgAddObject(g_starter);
        }}, 1);
        diff_sel_menu.pushItem(a);
    }
    a = new TextMenuItem("Back", 1, 1,default_menu_script.menu1, 1);
    diff_sel_menu.pushItem(a);

    var tf=function() {
        for (var i in g_ks) {
            a = new TextMenuItem(" " + g_ks[i], 1, 1, {kid: i, script: function () {

                ks2=function(thisid) {
                    tf3();
                    g_keysetter2 = new MenuHolderA1([300, 40], [0, 30], g_keysetter_reset);

                    for (var j in temp_key[thisid]) {
                        var b = new TextMenuItem("[" + temp_key[thisid][j] + "]", 1, 1, g_keysetter2_reset, 0);
                        b.kid = thisid;
                        b.kc = j;
                        b.kt = b;
                        g_keysetter2.pushItem(b);
                    }
                    b = new TextMenuItem("[+]", 1, 1, g_keysetter2_reset, 0);
                    b.kid = thisid;
                    b.kc = temp_key[thisid].length;
                    b.kt = b;
                    g_keysetter2.pushItem(b);
                    var b = new TextMenuItem("Remove", 1, 1, {kid: thisid,script: function () {
                        if (temp_key[stg_target.kid].length > 1) {
                            delete temp_key[stg_target.kid][temp_key[stg_target.kid].length - 1];
                            temp_key[stg_target.kid].length=temp_key[stg_target.kid].length-1;
                            g_keysetter2.gDeleteMenu();
                            var ta=g_keysetter2.select_id-1;
                            ks2(stg_target.kid);
                            stgAddObject(g_keysetter2);
                            g_keysetter2.select_id=ta;

                        }else{
                            stgAddObject(g_keysetter2);
                        }
                        stgDeleteSelf();
                    }}, 1);
                    g_keysetter2.pushItem(b);
                    stgAddObject(g_keysetter2);
                };
                ks2(stg_target.kid);
                g_keysetter.active=0;
                stgDeleteSelf();
            }}, 0);
            g_keysetter.pushItem(a);
        }
        a = new TextMenuItem("Back", 1, 1,default_menu_script.menu1, 1);
        g_keysetter.pushItem(a);
        a = new TextMenuItem("Save", 1, 1,{script:function(){stgDeleteSelf();_key_map=clone(temp_key);stgSaveKeyMap();}}, 0);
        g_keysetter.pushItem(a);
        tf2();
    };
    tf();




}

var g_starter={common_data:{},player_sel:[],level:""};
var temp_key=_key_map;

g_starter.init=function(){
    stgShowCanvas("frame", 32, 16, 0, 0, 1);

    stg_display = ["drawBackground", "drawFrame", "drawUI"];
    //stg_players_number=g_starter.player_sel.length;
    //stg_local_player_pos=0;
    //stgCreateInput(0);
    stgStartLevel(g_starter.level,g_starter.player_sel,g_starter.common_data);
};

var g_keysetter={};
var g_keysetter2={};
var g_ks=["Shot","Slow","Bomb","Up","Down","Left","Right","Pause","Ctrl","User1","User2"];


/**
 * Created by Exbo on 2015/12/27.
 */

var background_controller={
    camera_p1:null,
    camera_p2:null,
    script:function(){
        stg_procedures["drawFrame"].background=0;
        stg_procedures["draw3d"].matV=EMat4().setPerspective(0.732,0.732/stg_frame_width*stg_frame_height,1,500).newLookAt(background_controller.camera_p1.pos,background_controller.camera_p2.pos,[0,1,0]);
        stg_procedures["draw3d"].background="#F00";
    }
};

var background_01={
    init:function(){
        stgAddObject(background_controller);
        var a=new EMesh();
        a.addTriangle([-5,0,10],[5,0,10],[5,0,-200],[-1,-2],[1,-2],[1,40],0);
        a.addTriangle([-5,0,10],[-5,0,-200],[5,0,-200],[-1,-2],[-1,40],[1,40],0);
       // a.addTriangle([-10,-0.1,10],[10,-0.1,10],[10,-0.1,-200],[-2,-2],[2,-2],[2,40],1);
      //  a.addTriangle([-10,-0.1,10],[-10,-0.1,-200],[10,-0.1,-200],[-2,-2],[-2,40],[2,40],1);
        a.addTriangle2([-10,-0.1,10],[10,-0.1,10],[10,-0.1,-200],[-10,-0.1,-200],[-2,-2],[2,-2],[2,40],[-2,40],1);
        a.addTriangle2([-10,-0.5,10],[-10,-0.5,-200],[-10,20,-200],[-10,20,10],[-2,-0.1],[40,-0.1],[40,4],[-2,4],2);
        a.addTriangle2([10,-0.5,10],[10,-0.5,-200],[10,20,-200],[10,20,10],[-2,-0.1],[40,-0.1],[40,4],[-2,4],2);

        a.compile();
        a.setTexture(0,stg_textures["3dTex3"]);
        a.setTexture(1,stg_textures["3dTex1"]);
        a.setTexture(2,stg_textures["3dTex2"]);
        var b={};
        b.render=new StgRender("test3d");
        b.layer=1;
        b.render.mesh=a;
        stgAddObject(b);
        background_controller.camera_p1={pos:[0,10,0]};
        background_controller.camera_p2={pos:[0,0,-7]};
    },
    script:function(){
        background_controller.camera_p1.pos[2]-=0.03;
        background_controller.camera_p2.pos[2]-=0.03;
        if(background_controller.camera_p1.pos[2]<=-5){
            background_controller.camera_p1.pos[2]+=5;
            background_controller.camera_p2.pos[2]+=5;
        }
    },
    layer:0
};
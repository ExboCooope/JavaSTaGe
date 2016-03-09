/**
 * Created by Exbo on 2015/11/27.
 */


function TextMenuItem(sText,iShow,iSelectable,oOnSelect,iSelectRemove){
    this.mtext=sText;
    this.selectable=iSelectable;
    this.on_select=oOnSelect;
    this.select_remove=iSelectRemove;
    this.show=iShow;
    this.render = new StgRender("testShader2");
    miscApplyAttr(this.render,{type:2,x:0,y:0,color:"#AFF"});
    this.layer = 100;
    this.cleaner= new StgObject;
    this.cleaner.render = new StgRender("testShader2");
    miscApplyAttr(this.cleaner.render,{type:0,x:0,y:0,w:200,h:40,color:"#000"});
    this.cleaner.layer = 90;
    this.cleaner.base={type:stg_const.BASE_COPY,target:this,auto_remove:2};
    this.cleaner.script=function(){
        stg_target.render.w=50+stg_target.base.target.render.text.length*30;
    };
}

TextMenuItem.sellock=0;
TextMenuItem.backlock=0;

function MenuHolderA1(vaPos,vaAddPos,oReturn){
    this.menu_pool=[];
    this.select_id=0;
    this.menu_pos=vaPos;
    this.menu_add_pos=vaAddPos;
    this.rolldir=0;
    this.rolllock=0;
    this.menu_return=oReturn;
}

MenuHolderA1.prototype.pushItem=function(oMenuItem){
    var i=this.menu_pool.length;
    this.menu_pool.push(oMenuItem);
    var pos=this.menu_pos;
    var posa=this.menu_add_pos;
    if(! oMenuItem.pos) oMenuItem.pos=[];
    oMenuItem.pos[0]=pos[0]+posa[0]*i;
    oMenuItem.pos[1]=pos[1]+posa[1]*i;
  //  stgAddObject(oMenuItem.cleaner);
   // stgAddObject(oMenuItem);
};

MenuHolderA1.prototype.init=function(){
    var that=this;
    var pool=that.menu_pool;

    var sel=that.select_id;
    for(var i=0;i<pool.length;i++) {
        stgAddObject(pool[i].cleaner);
        stgAddObject(pool[i]);
    }
};

MenuHolderA1.prototype.gDeleteMenu=function(){
    var pool=this.menu_pool;
    for(var j in pool){
        stgDeleteObject(pool[j]);
    }
    stgDeleteObject(this);
};


MenuHolderA1.prototype.script=function(){
    var that=this;
    var pool=that.menu_pool;
    var pos=that.menu_pos;
    var posa=that.menu_add_pos;
    var sel=that.select_id;
    for(var i=0;i<pool.length;i++){
        var a=pool[i];
        var r= a.render;
        a.pos[0]=pos[0]+posa[0]*i;
        a.pos[1]=pos[1]+posa[1]*i;
        a.alpha= a.selectable ? 200:30;
        if(i==sel){
            a.alpha+=55;
            a.render.text="->"+ a.mtext;
        }else{
            a.render.text=a.mtext;
        }
    }

    var k=stg_system_input;
    var flag0=0;
    if(that.rolldir==0){
        if(k[stg_const.KEY_UP] || k[stg_const.KEY_LEFT]) {
            that.rolldir=-1;
            that.rolllock=60;
            sel--;
            flag0=1;
        }else if(k[stg_const.KEY_DOWN] || k[stg_const.KEY_RIGHT]) {
            that.rolldir=1;
            that.rolllock=60;
            sel++;
            flag0=1;
        }
    }else if(that.rolldir==1){
        if(k[stg_const.KEY_DOWN] || k[stg_const.KEY_RIGHT]) {
            that.rolllock--;
            if(that.rolllock<=0){
                that.rolllock=10;
                sel++;
                flag0=1;
            }

        }else{
            that.rolllock=0;
            that.rolldir=0;
        }
    }else if(that.rolldir==-1){
        if(k[stg_const.KEY_UP] || k[stg_const.KEY_LEFT]) {
            that.rolllock--;
            if(that.rolllock<=0){
                that.rolllock=10;
                sel--;
                flag0=1;
            }
        }else{
            that.rolllock=0;
            that.rolldir=0;
        }
    }
    var pck=0;
    if(flag0)stgPlaySE("se_select");
    sel=(sel+pool.length) %pool.length;
    while(!pool[sel].selectable && pck<pool.length){
        pck++;
        sel=(sel+pool.length+that.rolldir) %pool.length;
    }
    this.select_id=sel;
    if(k[stg_const.KEY_SHOT]){
        if(!TextMenuItem.sellock){
            if(pool[sel].select_remove){
                for(var j in pool){
                    stgDeleteObject(pool[j]);
                }
                stgDeleteObject(this);
            }
            TextMenuItem.sellock=1;
            pool[sel].on_select.menu_item=pool[sel];
            stgAddObject(pool[sel].on_select);
            stgPlaySE("se_ok");
        }
    }else{
        TextMenuItem.sellock=0;
    }

    if(k[stg_const.KEY_SPELL]){
        if(!TextMenuItem.backlock){

            for(var j in pool){
                stgDeleteObject(pool[j]);
            }
            stgDeleteObject(this);
            TextMenuItem.backlock=1;
            if(that.menu_return)stgAddObject(that.menu_return);
            stgPlaySE("se_cancel");
        }
    }else{
        TextMenuItem.backlock=0;
    }


};

function defaultDrawBackground(sTexName){
    var a1 = new StgObject;
    a1.render = new StgRender("testShader2");
    miscApplyAttr(a1.render, {color:"#A00",type: 3, x: 0, y: 0, w: 640, h: 480, texture: sTexName});
    a1.layer = 0;
    a1.pos = [0, 0, 0];
    a1.rotate = [0, 0, 0];
    var a1t = 2;
    a1.script = function () {
        if (a1t == 0) {
            stgDeleteObject(stg_target);
        }
        a1t--;
    };
    stgAddObject(a1);
}

function defaultShowBGM(sBGMName){
    var a1=new RenderText(35,445);
    a1.render.text="BGM: "+sBGMName;
    a1.render.alpha=0;
    a1.f=0;
    a1.script=function(){
        if(a1.f<=30){
            a1.render.alpha=255*a1.f/30;
        }else if(a1.f>210){
            a1.render.alpha-=2;
            if(a1.render.alpha<=0){
                stgDeleteSelf();
            }
        }
        a1.f++;
    }
}
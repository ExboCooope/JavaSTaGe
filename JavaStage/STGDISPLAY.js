/**
 * Created by Exbo on 2015/11/8.
 */
function createCanvas(iWidth,iHeight){
    var a=document.createElement("canvas");
    a.setAttribute("width",""+iWidth);
    a.setAttribute("height",""+iHeight);
    a.style.alignContent=""
    return a;
}

function createImage(sSource){
    var a=document.createElement("img");
    a.src=sSource;
    a.onload=function(){a.ready=1;};
    return a;
}

function stgCreateImageTexture(sTexName,sSource){
    if(stg_textures[sTexName])return;
    var a=createImage(sSource);
    a.type=stg_const.TEX_IMG;
    stg_textures[sTexName]=a;
}

function _runProcedure(sProcedure){
    var oProcedure=stg_procedures[sProcedure];
    var j;
    var s;
    if(!oProcedure)return;
    for(j=0;j<oProcedure.shader_order.length;j++){
        if(oProcedure.shader_order[j]){
            s=stg_shaders[oProcedure.shader_order[j]];
            s.post_frame(sProcedure);
        }
    }
    for(var i in _pool){
        if(_pool[i]){
            if(_pool[i].active && _pool[i].render){
                if(oProcedure.layers[_pool[i].layer]){
                    for(j=0;j<oProcedure.shader_order.length;j++){
                        if(oProcedure.shader_order[j]){
                            if(_pool[i].render.shader_name==oProcedure.shader_order[j]){
                                s=stg_shaders[oProcedure.shader_order[j]];
                                s.object_frame(_pool[i],_pool[i].render,sProcedure);
                            }
                        }
                    }
                }
            }
        }
    }
    for(j=0;j<oProcedure.shader_order.length;j++){
        if(oProcedure.shader_order[j]){
            s=stg_shaders[oProcedure.shader_order[j]];
            s.draw_frame(sProcedure);
        }
    }
}

function stgCreateCanvas(sName,iWidth,iHeight,iTextureType){
    if(stg_textures[sName])return stg_textures[sName];
    var a=createCanvas(iWidth,iHeight);
    a.type=iTextureType;
    a.ready=1;
    a.width=iWidth;
    a.height=iHeight;
    _addTexture(sName,a);
    if(iTextureType==stg_const.TEX_CANVAS3D){
        webglCreateFromCanvas(a);
    }
    return a;
}

function _addTexture(name,texture){
    stg_textures[name]=texture;
}

function stgShowCanvas(sName,vX,vY,vW,vH,vLayer){
    var a=stg_textures[sName];
    vW=vW|| a.width;
    vH=vH|| a.height;
    vX=vX||0;
    vY=vY||0;
    vLayer=vLayer||0;
    a.style.position="absolute";
    a.style.zIndex=""+(vLayer>>0);
    a.style.left=vX+"px";
    a.style.top=vY+"px";
    document.body.appendChild(a);
}

function stgHideCanvas(sName){
    var a=stg_textures[sName];
    document.body.removeChild(a);
}

function stgClearCanvas(sName){
    var a=stg_textures[sName];
    if(a.type==stg_const.TEX_CANVAS2D) {
        a.width = a.width;
    }else if(a.type==stg_const.TEX_CANVAS3D){
        _gl.clearColor(0,0,0,0);
        _gl.clear(_gl.COLOR_BUFFER_BIT);
    }
}
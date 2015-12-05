/**
 * Created by Exbo on 2015/11/18.
 */
var default_2d_shader={
    active:0,
    context:null,
    glset:0,
    mode:0,
    shader_init:function(){
        if(_gl) {
            webglCompileShader(default_2d_shader);
            _gl.enable(_gl.BLEND);
            _gl.blendEquation(_gl.FUNC_ADD);
            _gl.blendFunc(_gl.SRC_ALPHA,_gl.ONE_MINUS_SRC_ALPHA);
        }
    }, //shader初始化程序，在这里获得shader的入口地址等
    shader_finalize:function(){}, //shader的结束程序，负责释放资源
    post_frame:function(procedureName){
        default_2d_shader.pool=[];
        default_2d_shader.active=0;
        var pro=stg_procedures[procedureName];
        if(!pro){
            console.log("Cannot initialize shader 2d: bad procedure name ["+procedureName+"]");
            console.log(stg_procedures);
            return;
        }
        default_2d_shader.pro=pro;
        var tgt_n=pro.render_target;
        var tgt=stg_textures[tgt_n];
        if(!tgt){
            return;
        }
        if(tgt.type==stg_const.TEX_CANVAS2D) {
            default_2d_shader.context = tgt.getContext("2d");
            if (!default_2d_shader.context)return;
            default_2d_shader.active = 1;
            default_2d_shader.context.setTransform(1, 0, 0, 1, 0, 0);
            default_2d_shader.context.globalAlpha=1;
            if (pro.background) {

                default_2d_shader.context.fillStyle = pro.background;
                default_2d_shader.context.fillRect(0, 0, tgt.width, tgt.height);
            }
            default_2d_shader.mode=0;
        }else if(tgt.type==stg_const.TEX_CANVAS3D){
            if(!default_2d_shader.glset){
                webglCompileShader(default_2d_shader);
                _webGlUniformInput(default_2d_shader,"uWindow",webgl2DMatrix(tgt.width,tgt.height));
            }
            default_2d_shader.context= _gl;
            default_2d_shader.mode=1;
            for(var i in default_2d_shader.dma_pool){
                for(var j in default_2d_shader.dma_pool[i]) {
                    default_2d_shader.dma_pool[i][j].clean();
                    default_2d_shader.dma_pool[i][j].frameStart();
                }
            }
            if (pro.background) {
                var c=getRgb(pro.background);
                _gl.clearColor(c[0]/255,c[1]/255,c[2]/255,1);
                _gl.clear(_gl.COLOR_BUFFER_BIT);
            }
        }

    }, //每次渲染开始前，会调用，用来初始化该次渲染的数据，存入procedure_cache中
    object_frame:function(object,render,procedureName){
        if(default_2d_shader.mode==0) {
            var pool = default_2d_shader.pool;
            var l = object.layer;
            if (!pool[l])pool[l] = {};
            if (!render.texture)return;
            if (!pool[l][render.texture])pool[l][render.texture] = [];
            var rld = render.reload || 0;
            if (!render.procedures[procedureName]) {
                render.procedures[procedureName] = {};
                rld = 1;
            }
            var t = render.procedures[procedureName];
            t.cx = object.pos[0];
            t.cmx = render.offset[0];
            t.cy = object.pos[1];
            t.cmy = render.offset[1];
            t.r = object.rotate[2] + render.rotate;
            t.uvt = render.uvt;
            t.scale = render.scale;
            t.alpha = (object.alpha===undefined?1:object.alpha/255);
            pool[l][render.texture].push(t);
        }else if(default_2d_shader.mode==1){
            if (!render.texture)return;
            var t;
            var q=default_2d_shader.dma_pool[object.layer];
            if(!q) {
                q = {};
                default_2d_shader.dma_pool[object.layer]=q;
            }
            if(!q[render.texture]){
                t=new WebglDMA(default_2d_shader,1000);
                t.frameStart();
                q[render.texture]=t;
                t.objectParser = shader1_object_parser;
            }
            t=q[render.texture];
            if(object.alpha!= object.last_alpha){
                object.update=1;
                object.last_alpha=object.alpha;
            }
            if(!render.webgl || object.update){
                render.webgl=1;
                var tex=stg_textures[render.texture];
                if(!tex.webgl){
                    tex.webgl=1;
                    tex.gltex= _gl.createTexture();
                    _gl.bindTexture(_gl.TEXTURE_2D, tex.gltex);
                    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, tex);
                    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR);
                    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.LINEAR);
                    _gl.generateMipmap(_gl.TEXTURE_2D);
                }
                //if(!tex.width){
                //}
                object.render.aUVT=webglTextureAssign(null,object.render.uvt,tex.width,tex.height);
                object.render.aRec=new Float32Array([
                        render.offset[0],render.offset[1],
                        render.offset[0]+render.uvt[2],render.offset[1],
                        render.offset[0]+render.uvt[2],render.offset[1]+render.uvt[3],
                        render.offset[0],render.offset[1]+render.uvt[3]
                    ]);
                var ta=(object.alpha===undefined?1:object.alpha/255);
                object.render.aColor= new Float32Array([1, 1, 1, ta, 1, 1, 1, ta, 1, 1, 1, ta, 1, 1, 1, ta]);
            }
            t.parseObject(object);
        }
    }, //对每个参与该procedure和shader的物体会调用一次，负责绘制或将物体渲染信息缓存起来
    draw_frame:function(procedureName){
        if(default_2d_shader.mode==0) {
            var pool = default_2d_shader.pool;
            var l;
            var tn;
            var obj;
            var i;
            var c = default_2d_shader.context;
            for (l = 0; l < pool.length; l++) {
                if (pool[l]) {
                    for (tn in pool[l]) {
                        var tex = stg_textures[tn];
                        if (tex) {
                            if (tex)
                                for (i = 0; i < pool[l][tn].length; i++) {
                                    var obj = pool[l][tn][i];
                                    c.globalAlpha=obj.alpha;
                                    c.setTransform(1, 0, 0, 1, obj.cx, obj.cy);
                                    c.rotate(obj.r);
                                    c.drawImage(tex, obj.uvt[0], obj.uvt[1], obj.uvt[2], obj.uvt[3], obj.cmx, obj.cmy, obj.uvt[2], obj.uvt[3]);
                                }
                        }
                    }
                }
            }
        }else if(default_2d_shader.mode==1){
            for(var q in default_2d_shader.dma_pool){
                for(var i in default_2d_shader.dma_pool[q]) {
                    _gl.bindTexture(_gl.TEXTURE_2D, stg_textures[i].gltex);
                    _gl.activeTexture(_gl.TEXTURE0);
                    _webGlUniformInput(default_2d_shader, "texture", 0);
                    default_2d_shader.dma_pool[q][i].draw();
                }
            }
        }
    }, //每次渲染结束时会调用，如果将物体聚类的话，可以在这里统一绘制
    shader_finalize_procedure:function(procedureName){
        default_2d_shader.pool=[];
    }, //移除procedure时会执行一次，用来释放资源
    template:{},

    vertex:"attribute vec2 aPosition;" +
        "attribute vec2 aOffset;" +
        "attribute vec2 aTexture;" +
        "attribute vec4 aColor;" +
        "attribute float aRotate;" +
        "" +
        "uniform vec2 uWindow;" +
        "varying vec2 vTexture;" +
        "varying vec4 vColor;" +
        "void main( void ){" +
        "vTexture = aTexture;" +
        "vColor = aColor;" +
        "vec2 r = aOffset*cos(aRotate)+vec2(-aOffset[1],aOffset[0])*sin(aRotate);" +
        "vec4 t = vec4( (r + aPosition)*uWindow+vec2(-1.0,1.0) , 0.0 , 1.0 );" +
        "gl_Position = t;" +
        "}",
    fragment:"precision mediump float;" +
        "uniform sampler2D texture;" +
        "varying vec2 vTexture;" +
        "varying vec4 vColor;" +
        "void main(void){" +
        "vec4 smpColor = texture2D(texture, vTexture);" +
        "gl_FragColor  = vColor * smpColor;" +
        //"gl_FragColor  = vColor;" +
        "}",
    input:{
        aPosition:[0,2,null,0,1,0],
        aOffset:[0,2,null,0,0,1],
        aTexture:[0,2,null,0,0,2],
        aColor:[0,4,null,0,0,3],
        aRotate:[0,1,null,0,1,4],
        uWindow:[1,2],
        texture:[2,0]
    },
    dma_pool:[]
};
stg_shaders.testShader=default_2d_shader;

var default_2d_misc_shader={
    active:0,
    context:null,
    shader_init:function(){}, //shader初始化程序，在这里获得shader的入口地址等
    shader_finalize:function(){}, //shader的结束程序，负责释放资源
    post_frame:function(procedureName){
        default_2d_misc_shader.pool=[];
        default_2d_misc_shader.active=0;
        var pro=stg_procedures[procedureName];
        if(!pro){
            console.log("Cannot initialize shader 2d: bad procedure name ["+procedureName+"]");
            console.log(stg_procedures);
            return;
        }
        default_2d_misc_shader.pro=pro;
        var tgt_n=pro.render_target;
        var tgt=stg_textures[tgt_n];
        if(!tgt){
            return;
        }
        if(tgt.type!=stg_const.TEX_CANVAS2D)return;
        default_2d_misc_shader.context=tgt.getContext("2d");
        if(!default_2d_misc_shader.context)return;
        default_2d_misc_shader.active=1;
        default_2d_misc_shader.context.setTransform(1,0,0,1,0,0);
        if(pro.background){
            default_2d_misc_shader.context.fillStyle=pro.background;
            default_2d_misc_shader.context.fillRect(0,0,tgt.width,tgt.height);
        }

    }, //每次渲染开始前，会调用，用来初始化该次渲染的数据，存入procedure_cache中
    object_frame:function(object,render,procedureName){
        var pool=default_2d_misc_shader.pool;
        var l=object.layer;
        if(!pool[l])pool[l]=[];
        var rld=render.reload||0;
        if(!render.procedures[procedureName]){
            render.procedures[procedureName]={};
            rld=1;
        }
        var t=render;
        t.cx=object.pos?object.pos[0]:0;
        t.cy=object.pos?object.pos[1]:0;
        pool[l].push(t);
    }, //对每个参与该procedure和shader的物体会调用一次，负责绘制或将物体渲染信息缓存起来
    draw_frame:function(procedureName){
        var pool=default_2d_misc_shader.pool;
        var l;
        var tn;
        var i;
        var c=default_2d_misc_shader.context;
        c.textAlign="start";
        c.textBaseline="top";
        for(l=0;l<pool.length;l++){
            if(pool[l]){
                for(i=0;i<pool[l].length;i++) {
                    var obj = pool[l][i];
                    c.globalAlpha=(obj.alpha===undefined)?1:obj.alpha/255;
                    if(obj.type==0){
                        c.clearRect(obj.x+ obj.cx, obj.y+obj.cy,obj.w,obj.h);
                    }else if(obj.type==1){
                        c.fillStyle=obj.color||"#000";
                        c.fillRect(obj.x+ obj.cx, obj.y+obj.cy,obj.w,obj.h);
                    }else if(obj.type==2){
                        c.font=obj.font||"20px 宋体";
                        c.fillStyle=obj.color||"#000";
                        c.textAlign=obj.textAlign||"start";
                        c.textBaseline=obj.textBaseline||"top";
                        if(obj.maxWidth){
                            c.fillText(obj.text||"",obj.x+ obj.cx, obj.y+obj.cy,obj.maxWidth);
                        }else{
                            c.fillText(obj.text||"",obj.x+ obj.cx, obj.y+obj.cy);
                        }
                    }else if(obj.type==3){
                        c.drawImage(stg_textures[obj.texture],obj.x+ obj.cx, obj.y+obj.cy,obj.w,obj.h);
                    }
                }
            }
        }
    }, //每次渲染结束时会调用，如果将物体聚类的话，可以在这里统一绘制
    shader_finalize_procedure:function(procedureName){
        default_2d_misc_shader.pool=[];
    }, //移除procedure时会执行一次，用来释放资源
    template:{}
};
stg_shaders.testShader2=default_2d_misc_shader;


function renderCreate2DTemplateA1(sTemplateName,sTextureName,vX,vY,vW,vH,iColorX,iColorY,oRotate,iCenter){
    default_2d_shader.template[sTemplateName]={
        tex:sTextureName,
        data:[vX,vY,vW,vH,iColorX,iColorY,oRotate],
        c:iCenter
    };
    return  default_2d_shader.template[sTemplateName];
}
function _renderApply2DTemplate(oRender,oTemplate,iColor){
    oRender.uvt=[oTemplate.data[0]+oTemplate.data[4]*iColor,oTemplate.data[1]+oTemplate.data[5]*iColor,oTemplate.data[2],oTemplate.data[3]];
    oRender.texture=oTemplate.tex;
    oRender.offset = [0, 0];
    oRender.rotate = oTemplate.data[6];
    if(oTemplate.c){
        renderApply2DCenter(oRender);
    }
}
function renderApply2DTemplate(oRender,sTemplate,iColor){
    var oTemplate=default_2d_shader.template[sTemplate];
    oRender.uvt=[oTemplate.data[0]+oTemplate.data[4]*iColor,oTemplate.data[1]+oTemplate.data[5]*iColor,oTemplate.data[2],oTemplate.data[3]];
    oRender.texture=oTemplate.tex;
    oRender.offset = [0, 0];
    oRender.rotate = oTemplate.data[6];
    if(oTemplate.c){
        renderApply2DCenter(oRender);
    }
}
function renderApply2DCenter(oRender,vaCenterXY){
    if(!vaCenterXY){
        oRender.offset[0]=-oRender.uvt[2]/2;
        oRender.offset[1]=-oRender.uvt[3]/2;
    }else{
        oRender.offset[0]=-vaCenterXY[0];
        oRender.offset[1]=-vaCenterXY[1];
    }
}

function RenderText(x,y){
    var ax = new StgObject;
    ax.render = new StgRender("testShader2");
    miscApplyAttr(ax.render,{type:2,x:x,y:y,color:"#AFF"});
    ax.layer = 100;
    stgAddObject(ax);

    var ay = new StgObject;
    ay.render = new StgRender("testShader2");
    miscApplyAttr(ay.render,{type:0,x:x,y:y,w:200,h:40,color:"#000"});
    ay.layer = 90;
    ay.base={type:stg_const.BASE_COPY,target:ax,auto_remove:1};
    ay.script=function(){
        stg_target.render.w=50+stg_target.base.target.render.text.length*15;
    };
    stgAddObject(ay);
    return ax;
}

var zoomer_shader={
    active:0,
    context:null,
    shader_init:function(){}, //shader初始化程序，在这里获得shader的入口地址等
    shader_finalize:function(){}, //shader的结束程序，负责释放资源
    post_frame:function(procedureName){
        var pro=stg_procedures[procedureName];
        if(!pro){
            console.log("Cannot initialize zoomer: bad procedure name ["+procedureName+"]");
            console.log(stg_procedures);
            return;
        }
        zoomer_shader.pro=pro;
        var tgt_n=pro.render_target;
        var tgt=stg_textures[tgt_n];
        if(!tgt){
            return;
        }
        if(tgt.type!=stg_const.TEX_CANVAS2D)return;
        zoomer_shader.context=tgt.getContext("2d");
        if(!zoomer_shader.context)return;
    }, //每次渲染开始前，会调用，用来初始化该次渲染的数据，存入procedure_cache中
    object_frame:function(object,render,procedureName){
        if(!render.texture)return;
        var c=zoomer_shader.context;
        var prot= stg_textures[zoomer_shader.pro.render_target];
        var tex=stg_textures[render.texture];
        c.drawImage(tex,0,0,tex.width,tex.height,0,0,prot.width,prot.height);
    }, //对每个参与该procedure和shader的物体会调用一次，负责绘制或将物体渲染信息缓存起来
    draw_frame:function(procedureName){
    }, //每次渲染结束时会调用，如果将物体聚类的话，可以在这里统一绘制
    shader_finalize_procedure:function(procedureName){
    } //移除procedure时会执行一次，用来释放资源
};
stg_shaders.testZoomer=zoomer_shader;



/**
 * Created by Exbo on 2015/11/21.
 */
function stgCreateShotA1(x,y,speed,angle,bulletname,delay,color){
    color=color||0;
    delay=delay||0;
    var a=new StgBullet();
    a.move.pos[0]=x;
    a.move.pos[1]=y;
    a.move.speed=speed;
    a.move.speed_angle=angle*PI180;
    a.invincible=delay;
    a.layer=stg_const.LAYER_BULLET;
    a.color=color;
    stg_bullet_parser(a,bulletname);
    stgAddObject(a);
    return a;
}

function StgBullet(){
    this.type=stg_const.OBJ_BULLET;
    this.move=new StgMove();
    this.damage=1;
    this.penetrate=1;
    this.invincible=0;
}
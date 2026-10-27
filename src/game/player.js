import {bowMoveSpeed} from './bow-rules.js?v=73.2';
import * as T from '../../vendor/three.module.js';
export class Player{
 constructor(camera,input,world){this.camera=camera;this.input=input;this.world=world;this.position=new T.Vector3(.5,2.65,2);this.previous=this.position.clone();this.horizontal=new T.Vector3();this.velocity=0;this.grounded=false;this.coyote=0;this.buffer=0;this.jumpHeld=false;this.landing=0;}
 fits(p){const feet=p.y-1.65;for(const x of [p.x-.28,p.x+.28])for(const z of [p.z-.28,p.z+.28])for(const y of [feet+.002,feet+.85,p.y+.12])if(this.world.solid(x,y,z))return false;
 return !(this.world.blockers??[]).some(b=>p.x+.28>b.min.x&&p.x-.28<b.max.x&&p.z+.28>b.min.z&&p.z-.28<b.max.z&&p.y+.12>b.min.y&&feet+.002<b.max.y);
 }
 move(axis,amount){const count=Math.max(1,Math.ceil(Math.abs(amount)/.055));let hit=false;for(let n=0;n<count;n++){const p=this.position.clone();p[axis]+=amount/count;if(this.fits(p))this.position.copy(p);else if(axis!=='y'&&this.grounded&&this.fits(p.clone().add(new T.Vector3(0,.51,0)))){p.y+=.51;this.position.copy(p);}else{hit=true;break;}}return hit;}
 step(dt){
 this.previous.copy(this.position);
 if(this.input.keys.has('ArrowLeft'))this.input.yaw+=dt*1.8;if(this.input.keys.has('ArrowRight'))this.input.yaw-=dt*1.8;
 if(this.input.keys.has('ArrowUp'))this.input.pitch=Math.min(1.5,this.input.pitch+dt*1.2);if(this.input.keys.has('ArrowDown'))this.input.pitch=Math.max(-1.5,this.input.pitch-dt*1.2);
 const i=this.input,jump=i.keys.has('Space');if(jump&&!this.jumpHeld)this.buffer=.13;else this.buffer=Math.max(0,this.buffer-dt);this.jumpHeld=jump;
 this.coyote=this.grounded?.10:Math.max(0,this.coyote-dt);
 if(this.buffer>0&&this.coyote>0){this.velocity=7.6;this.grounded=false;this.coyote=0;this.buffer=0;}
 const dx=Number(i.keys.has('KeyD'))-Number(i.keys.has('KeyA')),dz=Number(i.keys.has('KeyS'))-Number(i.keys.has('KeyW')),n=Math.hypot(dx,dz)||1,speed=bowMoveSpeed(!!this.drawingBow,i.keys.has('ShiftLeft'));
 const tx=(dx*Math.cos(i.yaw)+dz*Math.sin(i.yaw))/n*speed,tz=(-dx*Math.sin(i.yaw)+dz*Math.cos(i.yaw))/n*speed;
 const rate=this.grounded?(dx||dz?32:25):10,blend=1-Math.exp(-rate*dt);
 this.horizontal.x+=(tx-this.horizontal.x)*blend;this.horizontal.z+=(tz-this.horizontal.z)*blend;
 if(this.move('x',this.horizontal.x*dt))this.horizontal.x=0;if(this.move('z',this.horizontal.z*dt))this.horizontal.z=0;
 this.velocity-=20*dt;const falling=this.velocity;this.grounded=false;
 if(this.move('y',this.velocity*dt)){if(this.velocity<0){this.grounded=true;if(falling< -5)this.landing=Math.min(.065,-falling*.004);}this.velocity=0;}
 this.landing*=Math.exp(-14*dt);if(this.position.y< -10)this.home();this.sync();
 }
 sync(){this.camera.position.copy(this.position);this.camera.position.y-=this.landing;this.camera.rotation.set(this.input.pitch,this.input.yaw,0,'YXZ');}
 render(alpha=1){this.camera.position.lerpVectors(this.previous,this.position,Math.max(0,Math.min(1,alpha)));this.camera.position.y-=this.landing;this.camera.rotation.set(this.input.pitch,this.input.yaw,0,'YXZ');}
 home(){this.position.fromArray(this.world.layout?.spawn??[.5,2.65,2]);this.velocity=0;this.horizontal.set(0,0,0);this.coyote=0;this.buffer=0;this.landing=0;this.previous.copy(this.position);this.sync();}
 stop(){this.previous.copy(this.position);this.horizontal.set(0,0,0);this.buffer=0;this.jumpHeld=this.input.keys.has('Space');}
}

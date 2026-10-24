import * as T from '../../vendor/three.module.js';
import {ENTRY_STEPS,ENTRY_STEP_RUN,ENTRY_STEP_RISE} from './underblock-entry-rules.js?v=66';

export function buildUnderblockEntry(world){
 const root=new T.Group();root.name='The Underblock / condemned service descent';world.scene.add(root);
 const b=(...a)=>world.box(...a, false,root);
 const solid=(x,y,z,w,h,d,c)=>world.box(x,y,z,w,h,d,c,true,root);
 const sign=(lines,x,y,z,w,h=.8)=>world.sign(lines,x,y,z,w,h,Math.PI/2,root);
 const stone=0x4b5750,trim=0x868979,iron=0x293a35,rust=0x755947;
 // A solid yard-level apron surrounds the real hole in the west-wing floor.
 b(-29.5,.5,4.65,19,1,2.3,0x77816a);
 b(-29.5,.5,12.6,19,1,4.8,0x77816a);
 b(-22,.5,8,4,1,4.4,0x77816a);
 // Treads rise less than the player's normal step-up allowance.
 for(let i=0;i<ENTRY_STEPS;i++){
  const top=1-(i+1)*ENTRY_STEP_RISE,x=-24-(i+.5)*ENTRY_STEP_RUN;
  b(x,(top-3)/2,8,ENTRY_STEP_RUN,top+3,4.4,i%2?0x687064:0x73796b);
  for(const z of [6,10])b(x,top+.025,z,ENTRY_STEP_RUN-.1,.05,.12,0xb29d68);
  b(x+.3,top-.08,8,.07,.13,4.1,0x939480);
 }
 b(-33.75,-2.5,8,7.5,1,4.4,0x3f514a);
 // Retaining walls contain the lowered floor; rails keep the apron readable.
 for(const z of [5.63,10.37]){
  solid(-30.7,.5,z,13.4,5.2,.3,stone);
  b(-30.7,3.18,z,13.7,.18,.52,trim);
  for(let x=-24;x>-37;x-=1.5){
   b(x,1.9,z,.09,2.4,.1,iron);
   b(x,.9,z+.16,.3,.13,.12,rust);
  }
  b(-30.7,3.12,z,13.5,.08,.09,iron);
  for(let x=-25;x>-36.5;x-=1.1)for(let y=-1.5;y<2.5;y+=.65)b(x+(Math.round(y*10)%2)*.15,y,z+(z<8?.16:-.16),1,.025,.025,0x354740);
 }
 // Heavy portal at the head, tighter service tunnel at the foot.
 for(const z of [5.65,10.35])solid(-23.7,3,z,.6,4,.7,rust);
 b(-23.7,5.1,8,.8,.5,5.4,trim);
 sign(['05 / THE UNDERBLOCK','SERVICE ACCESS / CONDEMNED'],-23.2,4.7,8,4.1,.9);
 for(const x of [-25.5,-27.8,-30.2,-33.2,-36.2]){
  const floor=x>-30?1-Math.ceil((-24-x)/.75)*.375:-2;
  for(const z of [6,10])b(x,floor+1.6,z,.25,3.2,.22,iron);
  b(x,floor+3.3,8,.3,.28,4.3,iron);
 }
 solid(-33.5,1.55,8,7,.4,4.7,0x33473f);
 // Pipes pull the eye downward; collars and repairs repeat along the descent.
 for(let i=0;i<8;i++){
  const x=-24.4-i*.75,y=3.3-i*.375;
  b(x,y,6.15,.85,.16,.16,0x80774e);
  b(x,y,6.15,.12,.31,.31,iron);
 }
 b(-33.5,.6,6.17,7,.16,.16,0x80774e);
 // Locked cells and sealed hatches suggest a larger abandoned prison below.
 for(const x of [-31.7,-34.2]){
  b(x,-.1,5.83,1.5,2.7,.08,0x162d28);
  for(let dx=-.6;dx<=.6;dx+=.3)b(x+dx,-.1,5.9,.06,2.7,.12,iron);
  b(x,-.1,5.95,1.5,.08,.13,trim);
 }
 solid(-36.8,-.4,8,.45,3.2,4.3,0x1b2e29);
 for(const z of [6.3,7.1,7.9,8.7,9.5])b(-36.55,-.4,z,.12,3,.11,iron);
 b(-36.45,-.55,8,.18,.15,4.1,0x9f8058);
 b(-36.32,-.55,8,.2,.45,.35,0xc1a66b);
 sign(['THE SEAL','E / ENTER · F / DIFFICULTY'],-36.45,.7,8,3.5,.8);
 sign(['NO STAFF BEYOND THIS POINT'],-29.5,1.2,8,3.5,.6);
 // Recessed light pools remain on underground even during the daytime.
 const lamp=(x,y,z,color,power,range)=>{
  b(x,y,z,.55,.45,.3,iron);const bulb=world.box(x,y,z+.17,.3,.2,.08,color,false,root);bulb.material=world.mat(color,.65);bulb.userData.alwaysOn=true;
  const light=new T.PointLight(color,power,range,2);light.userData.alwaysOn=true;light.position.set(x,y,z+.4);root.add(light);
 };
 lamp(-23.4,3.6,5.95,0xffba6c,18,8);
 lamp(-27.1,1.8,5.95,0xd6ac73,12,7);
 lamp(-31,-.15,5.95,0x81b7ac,14,7);
 lamp(-35,-.1,5.95,0x88bdaf,12,6);
 world.underblockEntry=root;
}

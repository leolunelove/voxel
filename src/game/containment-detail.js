import * as T from '../../vendor/three.module.js';
// The court is a security aisle feeding three real holding pens, not an open arena.
export function buildContainmentDetail(world,{root,b,sign,lamp,guard,stone,iron,trim,rust}){
 // Yard-facing gatehouse and elevated restricted-wing silhouette.
 b(-21.2,7.5,8,2,2,7,stone);b(-21.2,8.7,8,3,.35,8,iron);
 sign(['LEVEL 3 / CONTAINMENT','60 BLOCKS / RESTRICTED DUTY'],-19.55,5.25,8,6.8,1, -Math.PI/2);
 // Low transfer passage: red-brown route, repeated numbered inspection frames.
 for(const [x,z,a]of [[-25,8,0],[-25,2,Math.PI/2],[-32,2,Math.PI/2],[-40,2,0]]){
  if(a===0){for(const dx of [-1.8,1.8])b(x+dx,3.5,z,.15,5,.25,iron);b(x,6,z,3.8,.22,.3,trim);}
  else{for(const dz of [-1.8,1.8])b(x,3.5,z+dz,.25,5,.15,iron);b(x,6,z,.3,.22,3.8,trim);}
  lamp(x,5.65,z,28,8,0xffac77);
 }
 b(-22.5,1.035,8,5,.03,.15,rust);b(-25,1.035,5,.15,.03,6,rust);b(-32.5,1.035,2,15,.03,.15,rust);b(-40,1.035,4,.15,.03,4,rust);
 sign(['← HOLDING CELLS','WEAPONS AUTHORISED BEYOND CONTROL'],-25,4, .12,3.5,.85);
 sign(['DUTY 03 / NO UNESCORTED TRANSFERS'],-32,4,3.87,7,.55,Math.PI);
 // Recessed observation hatch gives a sense of staff controlling access.
 b(-26.87,3.4,6, .12,2,2,iron);for(const z of [5.3,5.7,6.1,6.5])b(-26.74,3.5,z,.14,1.4,.06,trim);
 sign(['CONTROL / 03'],-26.72,4.7,6,2.6,.45,Math.PI/2);
 // A fully roofed compound, with a narrow arrival mouth at its near end.
 b(-40,.5,12,18,1,16,0x625e59);
 for(const x of [-49,-31]){b(x,5.5,12,.6,9,16.5,stone,true);b(x,10.2,12,1,.35,17,iron);}
 b(-40,5.5,20,18.6,9,.6,stone,true);b(-40,10.5,12,19,.35,17,iron,true);
 for(const [x,w]of [[-45.5,7],[-34.5,7]])b(x,4.5,4.75,w,7,.5,stone,true);
 b(-40,7.7,4.75,4.2,.6,.7,iron,true);
 sign(['HOLDING BLOCK / 03','LIVE SUBJECTS · KEEP RETREAT CLEAR'],-40,6.8,5.13,8,1);
 // Front security aisle, separated from the pens by real wall returns and barred windows.
 for(const x of [-48.3,-42.75,-37.25,-31.7])b(x,3.4,16,.35,4.8,7.5,stone,true);
 const pens=[[-45.5,'01 / CINDER THRALL'],[-40,'02 / CINDER THRALL'],[-34.5,'03 / IRONBOUND']];
 for(const [x,label]of pens){
  // Wide centre opening permits melee footwork; window bays are solid and block shots.
  for(const dx of [-2.15,2.15]){b(x+dx,2.2,12.5,1.15,2.4,.35,stone,true);for(const xx of [-.4,0,.4])b(x+dx+xx,4.1,12.5,.07,1.4,.18,iron);b(x+dx,4.9,12.5,1.15,.14,.24,iron);}
  b(x,5.5,12.5,5.3,.65,.5,iron,true);
  // Raised grille remains visibly parked over the open pen entrance.
  for(let dx=-1.25;dx<=1.26;dx+=.4)b(x+dx,6.8,12.5,.09,2,.16,iron);
  b(x,7.85,12.5,2.9,.15,.25,trim);sign([label,'ACTIVE / REGISTER LOOT ON EXIT'],x,5.5,12.78,4.6,.75,Math.PI);
  b(x,1.025,16,4.8,.035,6.5,0x726752);for(const dx of [-1.5,1.5])b(x+dx,1.045,14.2,.1,.025,2.8,0x9c7651);
  lamp(x,8.8,16,65,12,0xffbd8a);b(x,2.3,19.55,2.2,2.6,.25,iron);b(x,1.25,18.8,2.8,.5,1,stone,true);
 }
 // Guard access overlooks the aisle, leaving ground-level combat and sightlines clear.
 b(-40,7.9,6.2,17,.3,1.4,iron,true);for(const x of [-47,-43,-37,-33])b(x,8.6,7,.08,1.2,.08,iron);b(-40,9.2,7,17,.1,.1,iron);
 guard(-34,6.2,Math.PI).position.y=8.05;lamp(-40,7.2,8,55,14,0xffa677);
 sign(['CONTAINMENT DETAIL','ENGAGE ONE PEN · RETREAT TO BANK'], -40,9.6,19.6,14,1.1,Math.PI);
 sign(['← EXIT / SAFE TRANSFER'], -40,3.8,5.3,3.5,.6,Math.PI);
}

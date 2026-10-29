import {ATTACK_OFFSET,ARCHERY_OFFSET} from './training-layout.js?v=82.3';
import {FOREST_OFFSET} from './conservatory-layout.js?v=82.3';
import * as T from '../../vendor/three.module.js';

// Only edge fixtures collide. Firing lanes, monster navigation and tree work
// circles stay free; all resource and combat awards remain in gameplay rules.
export function buildWorkyardCharacter(world){
 const root=new T.Group();root.name='Timber allotment and prison training wings';world.scene.add(root);
 const rows=[],iron=0x35483f,wood=0x856749,brick=0x776050,cream=0xb9b294;
 const shift=(x,z)=>{const o=z>16?ATTACK_OFFSET:ARCHERY_OFFSET;return [x+o.x,z+o.z];};
 const b=(x,y,z,w,h,d,color,solid=false)=>{[x,z]=shift(x,z);rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(lines,x,y,z,w,h=.7,angle=0,color='#d4c39a')=>{[x,z]=shift(x,z);return world.sign(lines,x,y,z,w,h,angle,root,color);};
 const lamp=(x,y,z,color,power,range)=>{[x,z]=shift(x,z);const bulb=world.box(x,y,z,.5,.16,.4,color,false,root);bulb.material=world.mat(color,.4);bulb.userData.prisonBulb=true;const light=new T.PointLight(color,power,range,2);light.position.set(x,y-.2,z);root.add(light);};
 // ARCHERY: converted covered exercise hall. Clear lanes end at timber butts.
 b(37.8,3.25,9,.4,4.5,10.9,wood,true);
 for(let z=3.8;z<14.5;z+=.48)b(37.55,3.25,z,.08,4.4,.07,0x5b503d);
 for(const z of [5.8,9,12.2]){
  b(35.05,1.6,z,.55,1.2,.55,wood);
  b(35.17,2.5,z,.24,2.3,2.4,0x9d8858);
  // Numbered plaques face the archer, looking east down the room.
  
  b(29.25,1.018,z,11.5,.03,2.3,0x8a856b);
  for(const dz of [-1.22,1.22])b(29.25,1.04,z+dz,11.5,.025,.07,0xc6b58b);
  b(24.4,1.06,z,.12,.03,2.4,0xd7bd82);
  for(const dx of [-.22,.22])b(23.7+dx,1.07,z,.2,.025,.55,0x4e5e4c);
 }
 for(const x of [22,27,32,37]){
  b(x,6.1,9,.24,.35,11.5,0x3b3b40);
  for(const z of [3.7,14.3]){b(x,3.6,z,.2,5,.25,brick);b(x,1.25,z,.55,.5,.65,cream);}
 }
 // Rack and arrow bundles sit against the side wall, off all three lanes.
 b(22.4,2.6,14.1,3.2,2.7,.45,0x4c5e4b,true);
 for(let i=0;i<5;i++){
  b(21.2+i*.55,2.6,13.82,.09,2,.12,wood);
  b(21.2+i*.55,3.15,13.8,.32,.08,.15,cream);
 }
 b(36.2,1.6,4,1.2,1.2,.6,0x806c49,true);

 sign(['RETURN EQUIPMENT','PRISON PROPERTY'],22.4,4.2,14.05,3.1,.75,Math.PI);
 lamp(27,5.7,9,0xffdcaa,19,13);lamp(35,5.7,9,0xffd39a,14,10);
 // MELEE: the condemned exercise yard. No new obstacles inside AI bounds.
 for(const x of [-8.35,8.35]){
  b(x,3.2,24,.18,4.4,12,0x4b4b50);
  b(x,5.55,24,.3,.25,12.5,brick);
  for(let z=19;z<30;z+=2.8){
   b(x,4,z,.23,2.6,.16,iron);
   b(x,2.9,z,.35,.15,1.8,0x8c7d5d);
  }
 }
 // Scuffed exercise court and faded markings remain flush with the ground.
 b(0,1.015,24,13,.025,10,0x6b6d54);
 for(const x of [-6.5,6.5])b(x,1.039,24,.08,.018,10,0xa99b73);
 for(const z of [19,24,29])b(0,1.04,z,13,.018,.08,0xa99b73);
 for(let i=0;i<18;i++)b(-5+(i*7%11),1.055,19.5+(i*11%9),.3+(i%3)*.2,.012,.08,0x525c48);
 for(const x of [-5,0,5]){
  b(x,3.2,30.4,2.6,3.8,.22,brick);
  b(x,3.25,30.23,1.5,2.4,.08,0x26352c);
  for(let dx=-.6;dx<=.6;dx+=.3)b(x+dx,3.25,30.1,.065,2.4,.12,iron);
 }
 sign(['NO ONE COUNTS THE LAPS ANYMORE'],0,5.5,30.15,10,.55,Math.PI,'#b9aa83');

 // Torn strips on the walls give this wing its rust-red identity.
 for(const x of [-8.1,8.1])for(let i=0;i<4;i++)b(x,4.3-i*.4,20.5+i*.1,.08,.5,1.3-i*.2,0x8b6350);
 const material=new T.MeshStandardMaterial({roughness:1});
 const mesh=new T.InstancedMesh(world.geometry,material,rows.length),matrix=new T.Matrix4(),position=new T.Vector3(),scale=new T.Vector3(),q=new T.Quaternion();
 rows.forEach((r,i)=>{matrix.compose(position.set(r.x,r.y,r.z),q,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});mesh.computeBoundingSphere();root.add(mesh);world.workyardCharacter=root;
}

export function dressForestPlot(world){
 const root=world.forestDress??=new T.Group();if(!root.parent)world.scene.add(root);
 root.clear();const stage=world.forestLevel;
 // Soil work circles don't collide or occlude trunk raycasts.
 for(const t of world.trees){
  world.box(t.x,1.014,t.z,1.7,.025,1.7,0x6f6246,false,root);
  for(const dx of [-.8,.8])world.box(t.x+dx,1.04,t.z,.08,.04,1.7,0x9a8b61,false,root);
 }
 // Later allotments get irrigation runs and benches near their rear fence.
 if(stage>0){
  const z=stage===1?-17.65:-21.65;
  world.box((stage===1?10:10.5)+FOREST_OFFSET.x,1.05,z+FOREST_OFFSET.z,stage===1?11:14,.1,.18,0x4e7161,false,root);
  for(let x=5;x<16;x+=3)world.box(x+FOREST_OFFSET.x,1.15,z+FOREST_OFFSET.z,.18,.25,.28,0x94a78a,false,root);
 }
 if(stage===2){
  world.box(16.7+FOREST_OFFSET.x,1.1,-21+FOREST_OFFSET.z,1.3,.2,1,0x866f49,false,root);
  for(const x of [16.4,17])world.box(x+FOREST_OFFSET.x,1.4,-21+FOREST_OFFSET.z,.2,.6,.2,0x729656,false,root);
 }
}

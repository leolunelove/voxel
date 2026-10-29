import {ATTACK_OFFSET,ARCHERY_OFFSET} from './training-layout.js?v=81.3';
import * as T from '../../vendor/three.module.js';

// Architecture stays outside the pursuit bounds and all three firing lanes.
// No triggers, rewards or saved state are owned by this presentation layer.
export function buildTrainingRooms(world){
 const root=new T.Group();root.name='Block 07 / combat hall and Long Room';world.scene.add(root);
 let offset=ATTACK_OFFSET;const rows=[],iron=0x303238,stone=0x4b4b50,trim=0x706b65,rust=0x854b38,timber=0x806246,brass=0xc4a36a;
 const b=(x,y,z,w,h,d,color,solid=false)=>{
  x+=offset.x;z+=offset.z;rows.push({x,y,z,w,h,d,color});
  if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));
 };
 const sign=(lines,x,y,z,w,h,angle=0,color='#efb55e')=>world.sign(lines,x+offset.x,y,z+offset.z,w,h,angle,root,color);
 const lamp=(x,y,z,color,power,range)=>{
  b(x,y+.12,z,.75,.18,.68,iron);
  const bulb=world.box(x+offset.x,y-.015,z+offset.z,.5,.13,.42,color,false,root);bulb.userData.prisonBulb=true;bulb.material=world.mat(color,.5);
  for(const dx of [-.28,.28])b(x+dx,y-.06,z,.055,.3,.56,iron);
  b(x,y-.2,z,.65,.055,.56,iron);
  const light=new T.PointLight(color,power,range,2);light.position.set(x+offset.x,y-.3,z+offset.z);light.userData.workLight=true;root.add(light);
 };
 const glass=(x,y,z,w,d)=>{
  const mesh=new T.Mesh(new T.BoxGeometry(w,.08,d),new T.MeshStandardMaterial({color:0xa1b9bf,transparent:true,opacity:.25,roughness:.6,depthWrite:false}));
  mesh.position.set(x+offset.x,y,z+offset.z);mesh.castShadow=false;root.add(mesh);
 };
 // 03 / CONTAINMENT DETAIL. A condemned exercise block, still used for the hunt.
 // Existing side/rear walls are retained; a high roof completes the enclosure.
 for(const x of [-4.9,4.9])b(x,8.15,23.5,7.8,.35,15.8,stone,true);
 glass(0,8.16,23.5,2,15.6);
 // Glazing is solid for projectiles too, but keeps daylight in the high nave.
 world.blockers.push(new T.Box3(new T.Vector3(5,8.1,31.6),new T.Vector3(7,8.23,47.4)));
 for(const z of [16.3,20.8,25.3,30.3]){
  b(0,7.55,z,17.5,.5,.38,iron);
  b(0,8.24,z,2.12,.1,.16,trim);
  for(const x of [-8.22,8.22]){
   b(x,4.6,z,.35,7.1,.5,trim);
   b(x,6.9,z,.7,.65,.64,iron);
   b(x,1.5,z,.65,1,.75,stone);
  }
 }
 for(const x of [-8.2,8.2]){
  b(x,2.05,24,.055,2.05,12,rust);
  for(const y of [1.15,3.1,5.55,7.25])b(x,y,24,.1,.09,12.6,iron);
  // Closed service grilles above combat silhouettes; no pillars on the floor.
  for(const z of [19.2,23.5,27.8]){
   b(x,5.1,z,.1,2.35,2.4,0x24292d);
   for(const dz of [-.9,-.45,0,.45,.9])b(x+(x<0?.12:-.12),5.1,z+dz,.12,2.3,.055,trim);
  }
  b(x,6.55,24,.14,.14,12.5,0x8c7762);
 }
 // Rear containment doors make the far wall more than an arena boundary.
 for(const x of [-5,0,5]){
  b(x,2.1,30.34,2.55,2.1,.12,rust);
  b(x,4.9,30.28,2.85,.22,.2,iron);
  for(const dx of [-1.35,1.35])b(x+dx,3.1,30.29,.16,4,.22,iron);
  b(x+.85,2,30.17,.16,.4,.12,trim);
  sign(['HOLD 0'+(1+(x+5)/5)],x,4.4,29.96,1.9,.35,Math.PI);
 }
 sign(['CONTAINMENT DETAIL','CONTAINMENT / 03'],0,6.55,30.15,7.4,1,Math.PI);
 // Gatehouse: the entire original opening remains walkable, including retreat.
 b(0,6.75,15.8,7.4,1.3,.72,stone,true);
 b(0,7.52,15.8,7.8,.22,1,trim);
 for(const x of [-3.7,3.7]){
  b(x,3.5,15.67,.35,5,.18,rust);
  for(const y of [1.5,5.7])b(x,y,15.52,.5,.18,.28,iron);
 }
 b(0,6.2,14.03,6.15,.9,.18,iron);
 sign(['03 / CONTAINMENT DETAIL','ATTACK · WALK OUT TO BANK YOUR LOOT'],0,6.2,13.92,6,.8,Math.PI,'#efb18a');
 sign(['SAFE PASSAGE','CROSS THE AMBER LINE TO BANK'],0,5.5,16.5,5.4,.72,0);
 for(let x=-2.3;x<2.4;x+=.55)b(x,1.035,16.45,.32,.035,.62,brass);
 for(const x of [-1.8,1.8])for(let z=12.8;z<15.4;z+=.8)b(x,1.035,z,.1,.025,.42,rust);
 for(const [x,z]of [[-6,19],[6,19],[0,26]])lamp(x,6.35,z,0xffb16c,58,14);
 // Reuse the original far-wall lamps as constant interior work lights.
 world.scene.traverse(o=>{if(o.isPointLight&&Math.abs(o.position.x-6)===7&&o.position.z===44){o.userData.workLight=true;o.intensity=42;}});

 offset=ARCHERY_OFFSET;
 // 04 / BOW RANGE. Warm wooden butts and orderly brass lane markings.
 // Existing shell is complete but green and undetailed; add a proper interior.
 for(const z of [3.54,14.46]){
  b(29.3,2.05,z,17.6,2.05,.055,timber);
  for(const y of [1.18,3.12,5.75])b(29.3,y,z,17.8,.12,.12,iron);
  for(let x=21;x<38;x+=.8)b(x,2.05,z+(z<9?.05:-.05),.035,1.9,.05,0x51473e);
  b(29.5,4.55,z,17.5,2.65,.05,0x57565a);
 }
 // Inset ceiling panels and exposed ties make the room visibly roofed.
 b(29.5,6.31,9,18.6,.08,10.9,0x5a5248,true);
 for(const x of [21.2,25.5,29.8,34.1,37.5]){
  b(x,6.02,9,.22,.35,11.2,iron);
  for(const z of [3.75,14.25]){b(x,4.45,z,.24,2.8,.24,trim);b(x,5.8,z,.42,.3,.65,iron);}
 }
 for(const z of [5.8,9,12.2]){
  b(29.5,6.2,z,18,.12,.12,timber);
  // Each target gets a warm backing bay and a lit lane number.
  b(37.53,3.25,z,.08,4.35,2.65,0x6c503a);
  for(const dz of [-1.35,1.35])b(37.4,3.25,z+dz,.2,4.5,.12,iron);
  sign(['LANE 0'+(Math.round((z-5.8)/3.2)+1)],37.29,4.7,z,2.4,.55,-Math.PI/2,'#f6d29a');
 }
 // Replace the two original lamps instead of layering duplicate light sources.
 world.scene.traverse(o=>{if(o.isPointLight&&o.position.z===27&&(o.position.x===39||o.position.x===47)){o.userData.workLight=true;o.intensity=o.position.x===47?85:60;o.distance=15;o.color.setHex(0xffd39a);}});
 for(const x of [27,35]){
  b(x,5.92,9,.9,.12,2.1,iron);
  for(const z of [8.2,9.8])b(x,6.15,z,.06,.5,.06,iron);
 }
 // Light across the target faces, never a bright emitter behind the bullseye.
 const targetLight=new T.SpotLight(0xffdba7,100,10,1.03,.8,2);
 targetLight.position.set(44.5,5.7,27);targetLight.target.position.set(47,2.5,27);targetLight.userData.workLight=true;root.add(targetLight,targetLight.target);
 // Proper entrance seen from the yard; lintel is above jumping head height.
 for(const z of [5.25,10.75]){
  b(19.15,3.4,z,.75,4.8,.5,timber,true);
  b(19.05,1.35,z,.95,.7,.72,stone);
  b(19.05,5.8,z,.95,.22,.72,iron);
 }
 b(19.15,6.25,8,.8,.8,6.1,timber,true);
 sign(['04 / BOW RANGE','ARCHERY · DRAW / RELEASE'],18.7,6.25,8,5.6,.7,-Math.PI/2,'#f1d296');
 sign(['ARMOURY PASSAGE','EXCHANGE · CELLBLOCK'],20.7,5.25,8,4.3,.65,Math.PI/2);
 lamp(21.1,5.5,8,0xffd9a0,32,8);
 for(const z of [6.1,9.9])b(20.2,1.04,z,2.2,.03,.1,brass);
 
 sign(['FIRING LINE','HOLD TO DRAW · RELEASE TO FIRE'],23.1,4.5,3.94,4.1,.75,0,'#eed0a0');
 sign(['PRISON ARMOURY / 04','THREE LANES. MAKE EVERY SHOT COUNT.'],29.8,4.9,14.04,7.5,.85,Math.PI,'#eed0a0');
 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:.96}),rows.length);
 const matrix=new T.Matrix4(),q=new T.Quaternion(),position=new T.Vector3(),scale=new T.Vector3();
 rows.forEach((r,i)=>{matrix.compose(position.set(r.x,r.y,r.z),q,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});
 mesh.name='Instanced training-room structure';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);world.trainingRooms=root;
}

import * as T from '../../vendor/three.module.js';

// Decoration stays outside the working plots and the central circulation routes.
// Repeated masonry is instanced: richer walls without a draw call per brick.
export function buildYardCharacter(world){
 const root=new T.Group();root.name='Block 07 / lived-in courtyard';world.scene.add(root);
 const rows=[];
 const b=(x,y,z,w,h,d,color,solid=false)=>{rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(lines,x,y,z,w,h=.8,angle=0,color='#e8b867')=>world.sign(lines,x,y,z,w,h,angle,root,color);
 const iron=0x303238,brick=0x4a4848,trim=0x74716b,plaster=0x656064;
 // The cellblock is a building, rather than a single free-standing bedroom.
 // Its open central passage still leads straight to the hunting yard.
 for(const side of [-1,1]){
  const cx=side*11.2;
  b(cx,7,15.15,16.3,5.2,1.5,brick,true);
  b(cx,4.55,14.2,16.5,.28,3.6,trim,true);
  b(cx,9.65,14.7,16.7,.35,2.4,trim);
  b(cx,10.05,15.3,16.6,.45,1.2,iron);
  for(let x=3.5;x<19;x+=.55){b(side*x,5.2,12.55,.055,1,.07,iron);}
  b(cx,5.65,12.55,16.4,.07,.08,iron);
  b(cx,4.8,12.55,16.4,.07,.08,iron);
  for(let x=4.5;x<19;x+=4.3){
   const xx=side*x;
   b(xx,7.3,14.34,1.6,2.4,.08,0x22262b);
   b(xx,8.6,14.2,2,.18,.38,trim);
   b(xx,6.03,14.15,2,.18,.45,trim);
   for(let dx=-.6;dx<=.61;dx+=.3)b(xx+dx,7.3,14.12,.065,2.35,.1,iron);
   b(xx,7.3,14.05,1.6,.07,.12,iron);
  }
  // Staggered courses and chipped patches give the silhouette a human scale.
  for(let row=0;row<9;row++)for(let col=0;col<22;col++){
   const x=side*(3.5+col*.7+(row%2)*.35);
   if(Math.abs(x)>19.3)continue;
   b(x,4.9+row*.5,14.385,.65,.035,.02,0x555151);
  }
 }
 // Upper walkway bridges the hunting gate; no geometry enters the doorway.
 b(0,6.9,15.1,6.1,.35,2.1,trim);
 for(let x=-2.8;x<3;x+=.55)b(x,7.6,14.1,.065,1.2,.1,iron);
 b(0,8.2,14.1,6,.08,.1,iron);
 sign(['CELLBLOCK / 07'],0,9.1,14.24,5.2,.85,Math.PI);
 // Real cell entrance retains its full doorway and resting position.
 b(5.5,4.55,9.65,5.5,.35,.75,trim);
 for(const x of [3,8])b(x,2.85,9.7,.36,3.7,.55,brick,true);
 sign(['07','LIGHTS OUT / YOUR OWN TIME'],5.5,3.85,9.48,3.3,.9,Math.PI);
 // Closed neighboring cells and a receiving hatch sit at the courtyard edge.
 for(const x of [-15,-10,-5,13,17]){
  b(x,2.7,14.5,2.5,3.4,.4,0x913e29,true);
  b(x,3.1,14.24,1.25,.6,.08,0x20252a);
  for(let dx=-.5;dx<=.5;dx+=.25)b(x+dx,3.1,14.12,.055,.6,.1,trim);
  b(x+.8,2.5,14.19,.16,.12,.16,trim);
 }
 sign(['NO VACANCIES'], -10,4.05,14.14,2.4,.45,Math.PI);
 // Pipes, peeling lower plaster, and buttresses break the repeated wall spans.
 for(const x of [-18.9,-3.2,9.1,18.9]){
  b(x,5.2,13.9,.17,8.6,.18,0x44444a);
  for(const y of [2.2,4.3,6.4,8.5])b(x,y,13.84,.3,.12,.28,iron);
 }
 for(let i=0;i<16;i++){
  const x=-18+i*2.4;if(Math.abs(x)<3.2)continue;
  b(x,1.45+(i%3)*.12,15.4,1.2+(i%2)*.4,.7,.08,plaster);
 }
 // Walkable gallery stair: .46 rises fit the existing half-block step-up.
 for(let n=0;n<8;n++){
  const h=(n+1)*.46;b(-15.5,1+h/2,8.9+n*.42,2.1,h,.42,iron,true);
  for(const x of [-16.6,-14.4]){b(x,1+h+.58,8.9+n*.42,.07,1.16,.07,iron);}
 }
 b(-15.5,4.55,12.35,2.1,.28,1.5,trim,true);
 // Pale cell numbers and amber wall lamps read against the rust-red doors.
 for(const [i,x]of [-15,-10,-5,13,17].entries()){
  sign(['C'+(i+1)],x,4.7,14.05,1,.42,Math.PI);
  b(x,4.05,14.02,.7,.38,.18,iron);
  const bulb=world.box(x,4.05,13.9,.48,.22,.08,0xffc36b,false,root);
  bulb.material=world.mat(0xffc36b,.5);bulb.userData.prisonBulb=true;
 }
 // Service conduit and clamps remain above player head height.
 b(-10.8,5.9,12.23,15,.12,.12,iron);
 for(const x of [-18,-14,-10,-6])b(x,5.9,12.22,.23,.26,.2,trim);
 // The portal's fixed posts collide even as its stage-specific dressing changes.
 for(const x of [-12.15,-7.85])world.blockers.push(new T.Box3(new T.Vector3(x-.24,1,.15-.325),new T.Vector3(x+.24,4.8,.15+.325)));
 // A worn circulation spine, patchwork paving and recessed drains.
 b(.5,1.012,7.5,4,.024,13,0x77716a);
 for(const x of [-1.8,2.8]){
  b(x,1.023,7.5,.28,.025,12.5,0x33363a);
  for(let z=1.5;z<14;z+=.34)b(x,1.041,z,.27,.018,.055,0x5f6061);
 }
 for(let i=0;i<28;i++){
  const x=-14+(i*7%28),z=2.2+(i*13%10);
  if(x>2.5&&x<8.5&&z>9)continue;
  b(x,1.02,z,.5+(i%3)*.3,.02,.22+(i%2)*.2,i%3?0x78716a:0x645e5b);
 }
 // Left edge: prison water point, storage and a covered shift noticeboard.
 b(-18.2,1.9,3.7,1.4,1.8,1.3,0x777b68,true);
 b(-18.2,2.85,3.7,1.7,.16,1.5,trim);
 b(-18.2,2.94,3.7,1.2,.06,.9,0x334b45);
 b(-18.7,3.2,3.7,.1,.65,.12,iron);b(-18.45,3.5,3.7,.6,.12,.12,iron);
 sign(['WATER / DO NOT WASTE'], -18.15,3.9,4.3,2.2,.55);
 b(-4.7,2.8,12.15,3.8,2.7,.32,0x695a40,true);
 b(-4.7,2.85,11.94,3.5,2.3,.08,0x25262b);
 b(-4.7,4.3,12.05,4.1,.18,1,iron);
 sign(['SHIFT NOTICES','WORK EARNS PRIVILEGE'], -4.7,3.3,11.86,3.1,.85,Math.PI);
 sign(['07 / KEEP YOUR HAUL','RETURN TO YOUR CELL TO REST'], -4.7,2.25,11.86,3.1,.7,Math.PI,'#aabb98');
 for(const [x,z]of [[-18,9],[-15,13],[17.8,12.6]]){
  b(x,1.5,z,1.35,1,1.1,0x7e6845,true);
  for(const dx of [-.48,.48])b(x+dx,1.5,z,.09,1.04,1.14,0x34363b);
  b(x,2.03,z,1.4,.08,1.15,0x9a8057);
 }
 // Forge silhouette: flue and tool rack, unlike the Exchange's timber counter.
 b(12.5,3.7,11.25,1.1,5.4,1.1,brick,true);
 b(12.5,6.55,11.25,1.4,.25,1.4,iron);
 b(10.3,2.2,11.5,2.4,2.4,.5,0x3e4146,true);
 for(let i=0;i<4;i++){b(9.55+i*.5,2.7,11.15,.1,1,.1,0xa28957);b(9.55+i*.5,3.2,11.15,.4,.12,.2,0x9aa59a);}
 // Warm fixtures join the existing day/night lamp system.
 for(const [x,z]of [[-4.7,11.5],[5.5,9.3],[-10,2.2]]){
  const bulb=world.box(x,4.15,z,.48,.18,.4,0xf0cc8b,false,root);bulb.material=world.mat(0xf0cc8b,.35);bulb.userData.prisonBulb=true;
  const light=new T.PointLight(0xffcf91,11,8,2);light.position.set(x,3.9,z);root.add(light);
 }
 const material=new T.MeshStandardMaterial({roughness:1});
 const mesh=new T.InstancedMesh(world.geometry,material,rows.length),matrix=new T.Matrix4(),scale=new T.Vector3(),position=new T.Vector3(),quaternion=new T.Quaternion();
 for(let i=0;i<rows.length;i++){const r=rows[i];matrix.compose(position.set(r.x,r.y,r.z),quaternion,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));}
 mesh.castShadow=true;mesh.receiveShadow=true;mesh.name='Instanced prison masonry and courtyard fixtures';mesh.computeBoundingSphere();root.add(mesh);
 world.yardCharacter=root;
}

export function dressMineEntrance(world){
 const g=world.mineDress,b=(...a)=>world.box(...a,false,g),s=world.mineLevel;
 const iron=0x303238,wood=0x785238,stone=0x4e4c4d;
 for(const x of [-12.15,-7.85]){
  b(x,3,.15,.56,4,.75,wood);b(x,1.2,.15,.85,.4,1,stone);
  for(const y of [1.7,4.3])b(x,y,.58,.67,.2,.1,iron);
 }
 b(-10,5,.15,5.5,.65,.9,wood);b(-10,5.45,.15,5.9,.22,1.05,iron);
 world.sign(['MINE / DEEPWELL', ['STARTER SEAM','EXCAVATION','DEEP WORKS'][s]],-10,5,.76,4.7,.85,0,g,'#f2b55a');
 // Three overhead portal ribs establish depth while keeping the ramp open.
 for(const z of [-.8,-2.2]){
  for(const x of [-12.15,-7.85])b(x,3,z,.28,4,.3,wood);
  b(-10,5,z,4.7,.28,.3,wood);
 }
 for(const x of [-12.9,-7.1])for(let i=0;i<6;i++)b(x,1.04,2.6-i*.55,.4,.03,.32,i%2?0x37383c:0xd78536);
 for(const x of [-13.15,-6.85]){
  b(x,3.6,.4,.64,.7,.2,iron);
  const bulb=b(x,3.6,.53,.4,.45,.08,0xffc36b);bulb.material=world.mat(0xffc36b,.55);bulb.userData.prisonBulb=true;
 }
 if(s>0){for(const x of [-14.2,-5.7]){b(x,3.2,-2,.3,4.4,.3,iron);b(x,5.4,-2,.8,.2,.8,0xd2a368);}b(-10,5.7,-2,9,.3,.45,iron);}
 if(s>1){b(-16.8,2,-13.8,1.2,2,1.3,iron);b(-16.8,3.15,-13.8,1.4,.3,1.5,0xb9a16e);}
}

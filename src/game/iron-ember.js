import * as T from '../../vendor/three.module.js';

// Presentation-only, fixed at the yard edges. The working plots and their
// expansion bounds stay owned by CampWorld and its rules.
export function buildIronEmber(world){
 const root=new T.Group();root.name='Iron & Ember / courtyard';world.scene.add(root);
 const rows=[],iron=0x303238,stone=0x4c4d52,trim=0x67666a,orange=0xd78b3b;
 const b=(x,y,z,w,h,d,color,solid=false)=>{rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 // An enclosed mine portal with side cheeks; the original 3.8m opening is clear.
 for(const [x,w]of [[-15.7,6.5],[-4.3,6.5]])b(x,3.7,.12,w,5.4,.55,stone,true);
 b(-10,6,.12,17.9,1.2,.55,stone);
 for(const x of [-18.8,-1.2]){b(x,4,.12,.48,6,.8,trim);b(x,7.15,.12,.75,.3,1,trim);}
 b(-10,6.7,.12,18.4,.26,.85,trim);
 // Shallow masonry patches, deliberately large and sparse like the mockup.
 for(const side of [-1,1]){
  for(let i=0;i<28;i++){
   const z=-16+(i*7%32),y=1.8+(i*11%13)*.43;
   if(z>3&&z<11)continue; // Side-room doorways remain legible and open.
   b(side*19.485,y,z,.025,.26,.65+(i%3)*.24,i%4===0?0x6a4b41:0x565459);
  }
  for(const z of [-16,-9,-2,14.5]){
   b(side*19.38,4.1,z,.38,7,.6,trim);b(side*19.38,7.7,z,.65,.25,.85,trim);
  }
 }
 for(let i=0;i<24;i++){
  const x=-18+(i*7%36),y=1.8+(i*5%12)*.42;
  b(x,y,-17.48,.65+(i%3)*.22,.28,.025,i%4===0?0x6a4b41:0x57565a);
 }
 for(let i=0;i<20;i++){
  const x=-18.5+(i*11%35);if(Math.abs(x+10)<2.8)continue;
  b(x,2+(i*7%10)*.38,.414,.8,.25,.025,i%3?0x58565a:0x6b4d41);
 }
 // Conduit follows the portal lintel, with a small inspection box.
 b(-10,6.1,.48,17.2,.11,.13,0x8a8580);
 for(const x of [-17,-13,-9,-5])b(x,6.1,.51,.24,.24,.2,trim);
 b(-17.1,3.1,.53,.5,.8,.18,iron);b(-17.1,3.2,.64,.12,.06,.03,orange);
 // Keep rails and route markings level with the paving; no collision lips.
 for(const x of [-12.8,-7.2])b(x,1.04,5.2,.14,.025,5.1,orange);
 for(let i=0;i<8;i++)b(-10.7+i*.6,1.045,7.65,.38,.025,.24,orange);
 world.sign(['01 / DEEPWELL','FOLLOW THE AMBER LINE'],-14.8,4.45,.47,3.8,.85,0,root);

 // Small wall fixtures and their emissive panes work with the existing clock.
 for(const [x,z,angle]of [[-17.4,14.0,Math.PI],[-5.1,14.0,Math.PI],[13.3,14.0,Math.PI],[-14.4,.6,0],[-5.6,.6,0]]){
  b(x,4.2,z,.68,.66,.2,iron);
  const bulb=world.box(x,4.2,z+(angle?-.13:.13),.44,.36,.08,0xffbd65,false,root);
  bulb.material=world.mat(0xffbd65,.45);bulb.userData.prisonBulb=true;
 }
 // One parked cart, off the mine approach, built from a few chunky boxes.
 b(-4.2,1.62,5.2,1.45,.72,1.15,iron,true);
 b(-4.2,2.04,5.2,1.65,.12,1.3,trim);
 for(const x of [-4.75,-3.65])for(const z of [4.82,5.58])b(x,1.2,z,.23,.32,.25,0x24262a);
 for(let i=0;i<5;i++)b(-4.65+(i%3)*.4,2.06+(i%2)*.1,5.0+(i%2)*.38,.38,.28,.4,i%2?0x8c7770:0x67666c);
 // A few flat paving repairs keep broad surfaces readable at low texture cost.
 for(let i=0;i<34;i++){
  const x=-18+(i*13%36),z=1.7+(i*7%12);if(x>2.5&&x<8.5&&z>9)continue;
  if(x>-13.3&&x<-6.7&&z<7.9)continue;
  b(x,1.035,z,.5+(i%3)*.35,.018,.35+(i%2)*.22,i%5===0?0x806455:0x73706e);
 }
 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:1}),rows.length);
 const matrix=new T.Matrix4(),pos=new T.Vector3(),scale=new T.Vector3(),q=new T.Quaternion();
 rows.forEach((r,i)=>{matrix.compose(pos.set(r.x,r.y,r.z),q,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});
 mesh.name='Instanced charcoal masonry, conduit and safety markings';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);
 // Sun shadows belong to static scenery, not individual ore blocks. Updating
 // this small set avoids thousands of ore shadow submissions per frame.
 world.scene.traverse(o=>{if(o.isMesh&&!o.userData.key&&!o.isInstancedMesh){o.castShadow=true;o.receiveShadow=true;}});
 world.sun.castShadow=true;world.sun.shadow.autoUpdate=false;world.sun.shadow.needsUpdate=true;Object.assign(world.sun.shadow.camera,{left:-28,right:28,top:30,bottom:-25,near:1,far:90});
 world.sun.shadow.mapSize.set(1024,1024);world.sun.shadow.bias=-.0008;world.sun.shadow.normalBias=.035;
 world.emberCharacter=root;
}

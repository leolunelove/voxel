import * as T from '../../vendor/three.module.js';
// Fixed architectural shells sit beyond the maximum harvest bounds. Expanding
// a plot opens more working floor inside its room, not another outdoor pit.
export function buildSkillRooms(world){
 const root=new T.Group();root.name='Block 07 / skill entrances and Deepwell workroom';world.scene.add(root);
 const rows=[],stone=0x4b4b50,trim=0x69666a,iron=0x303238,wood=0x79563b;
 const b=(x,y,z,w,h,d,color,solid=false)=>{rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 // Full-depth retaining walls and a high ceiling, with a narrow glazed rooflight.
 for(const x of [-19.2,-1.1])b(x,1,-14.25,.5,12,17.9,stone,true);
 b(-10.15,1,-23.15,18.6,12,.5,stone,true);
 for(const [x,w] of [[-15.175,8.55],[-5.10,8.60]])b(x,7.15,-14.25,w,.35,18.25,stone,true);
 const glass=new T.Mesh(new T.BoxGeometry(1.5,.08,17.8),new T.MeshStandardMaterial({color:0x9bb6bd,transparent:true,opacity:.28,roughness:.5,depthWrite:false}));glass.position.set(-10.15,7.15,-14.25);root.add(glass);
 for(const z of [-6.2,-10.5,-15,-19.5,-22.8]){
  b(-10.15,6.7,z,18.5,.38,.35,iron);
  for(const x of [-18.82,-1.48]){b(x,3.75,z,.28,6,.38,trim);b(x,6.5,z,.7,.35,.55,iron);}
  b(-10.15,7.22,z,1.6,.1,.14,iron);
 }
 // Stone courses, conduit and low retaining ribs give the interior depth.
 for(const y of [-3.5,-1.5,1.2,3.2,5.2]){
  for(const x of [-18.93,-1.37])b(x,y,-14.3,.035,.055,17.2,0x35373d);
  b(-10.1,y,-22.88,17.4,.055,.035,0x35373d);
 }
 for(const x of [-18.75,-1.55]){b(x,5.75,-14.5,.12,.12,16.7,0x8b8172);for(const z of [-9,-14,-20])b(x,5.75,z,.22,.28,.28,iron);}
 b(-10.15,7.4,-5.28,18.8,.3,.5,trim);
 world.sign(['01 / THE DEEPWELL','MINING WORKROOM · FOLLOW THE AMBER LINE'],-18.88,4.2,-12,5.8,.8,Math.PI/2,root);
 world.sign(['EXCAVATION / 07','EXPAND YOUR SEAM AT THE EXCHANGE'],-10,4.5,-22.84,8,1.1,0,root);
 for(const z of [-9.5,-16,-21]){
  b(-10.15,6.2,z,2.1,.16,.7,iron);
  const bulb=world.box(-10.15,6.08,z,1.65,.08,.42,0xffc982,false,root);bulb.material=world.mat(0xffc982,.5);bulb.userData.prisonBulb=true;
  const lamp=new T.PointLight(0xffd6a1,65,13,2);lamp.position.set(-10.15,5.8,z);lamp.userData.workLight=true;root.add(lamp);
 }

 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:1}),rows.length),matrix=new T.Matrix4(),q=new T.Quaternion(),pos=new T.Vector3(),scale=new T.Vector3();
 rows.forEach((r,i)=>{matrix.compose(pos.set(r.x,r.y,r.z),q,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});mesh.name='Instanced skill-room masonry and structure';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);world.skillRooms=root;
}

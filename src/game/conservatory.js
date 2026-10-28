import * as T from '../../vendor/three.module.js';
// The covered dogleg conceals the nursery until the final turn. All repeat
// scenery is instanced; only lamps and signs stay separate.
export function buildConservatory(world){
 const root=new T.Group();root.name='The Conservatory / checkpoint, service passage and nursery';world.scene.add(root);world.conservatory=root;
 const rows=[],iron=0x303238,stone=0x4c4d52,trim=0x76736d,wood=0x856749,green=0x4e6754;
 const b=(x,y,z,w,h,d,color,solid=false)=>{rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(text,x,y,z,w,h=.7,a=0)=>world.sign(text,x,y,z,w,h,a,root);
 const lamp=(x,y,z,power=28,range=9,color=0xffcf94)=>{b(x,y+.12,z,.65,.22,.45,iron);const bulb=world.box(x,y,z,.4,.10,.32,color,false,root);bulb.material=world.mat(color,.6);bulb.userData.prisonBulb=true;const light=new T.PointLight(color,power,range,2);light.position.set(x,y-.18,z);light.userData.workLight=true;root.add(light);};
 // Former tree frontage is a service building, not an exposed second plot.
 b(4.45,4,-5.7,2.9,6,.55,stone,true);b(14.9,4,-5.7,9.8,6,.55,stone,true);
 b(8,6.2,-5.7,4.2,1.6,.55,stone,true);
 for(const x of [5.7,10.3]){b(x,3.5,-5.35,.4,5,.7,trim,true);b(x,6.25,-5.35,.8,.3,1,iron);}
 for(const x of [6,10])b(x,8,-5.4,.18,3,.3,iron);
 for(let x=6;x<=10;x+=.5)b(x,8.3,-5.4,.07,2.3,.15,iron);
 b(8,9.6,-5.4,4.5,.2,.6,iron);
 sign(['02 / THE CONSERVATORY','WOODCUTTING / PRISON LEVEL 2'],8,5.85,-4.99,4.2,.7);
 sign(['SERVICE WING','A LITTLE MORE PRISON. A LITTLE MORE FREEDOM.'],14.8,4.3,-5.38,6.7,.85);
 lamp(8,4.8,-4.9,24,7);
 // Solid storage bulk screens the old forest footprint from every yard route.
 b(4.5,3.7,-18,3,5.4,12,stone,true);b(14.9,3.7,-18,9.8,5.4,12,stone,true);
 b(11.4,6.6,-18,16.8,.3,12,iron,true);
 // Vestibule and eastbound corridor. Four-metre clear lanes, flat thresholds.
 b(8,.5,-8.5,4,1,7,0x77736c);b(18,.5,-10,24,1,4,0x77736c);
 b(5.75,3.4,-8.5,.5,4.8,7.5,stone,true);b(10.25,3.4,-6.5,.5,4.8,3,stone,true);
 b(20.125,3.4,-7.75,20.25,4.8,.5,stone,true);
 b(13.5,3.4,-12.25,15.5,4.8,.5,stone,true);
 b(30.25,3.4,-10,.5,4.8,4.5,stone,true);
 b(8,5.9,-8.9,4.5,.3,6.7,stone,true);b(18,5.9,-10,24.5,.3,4.5,stone,true);
 for(const x of [8,14,20,26]){b(x,5.6,-10,.2,.22,4.2,iron);lamp(x,5.35,-10,24,7);}
 for(const z of [-6.2,-8])b(8,1.035,z,3.5,.025,.07,0x98ac85);
 b(18,1.035,-10,19.5,.025,.10,0x98ac85);
 sign(['CONSERVATORY  →','NURSERY & TIMBER RECLAMATION'],8,3.7,-11.94,3.3,.85);
 sign(['←  CONSERVATORY','FOLLOW THE DAYLIGHT'],29.96,3.6,-10,3,.85,-Math.PI/2);
 sign(['BLOCK 07  →','EXCHANGE / CELLS'],10.7,3.6,-7.99,3.4,.7,Math.PI);
 // Separate nursery courtyard, beyond the original prison footprint.
 b(30.5,.5,-22.5,19,1,21,0x737267);
 b(30.5,1.011,-22,15,.022,16,0x62734b);
 // Water and a potting bench make the arrival a nursery, not another work pit.
 b(22.1,1.4,-15.2,1.05,.8,2.5,0x7c7976,true);b(22.1,1.82,-15.2,.8,.04,2.25,0x648d88);
 b(22.1,2.3,-16.2,.12,.9,.12,iron);b(22.3,2.75,-16.2,.5,.12,.12,iron);
 b(36.6,1.85,-13.15,3.7,.16,.9,wood);for(const x of [35.1,38.1])b(x,1.4,-13.15,.15,.9,.8,iron);
 for(const x of [35.5,36.5,37.5]){b(x,2.05,-13.15,.5,.35,.5,0x79563b);b(x,2.35,-13.15,.6,.35,.55,0x79974e);}
 for(const z of [-18,-24,-29])for(let n=0;n<5;n++)b(39.94,2.8+n*.45,z+(n%2)*.25,.07,.55,.6,0x4f7843);
 b(20.75,4.4,-22.5,.5,6.8,21.5,stone,true);b(40.25,4.4,-22.5,.5,6.8,21.5,stone,true);
 b(30.5,4.4,-33.25,20,6.8,.5,stone,true);
 b(23.5,4,-12.25,5.5,6,.5,stone,true);b(35.2,4,-12.25,10.1,6,.5,stone,true);
 b(28,6.7,-12.25,4.5,1,.5,trim,true);
 for(const x of [25.8,30.2])b(x,4,-12,.3,6,.75,wood,true);
 sign(['THE CONSERVATORY','GROW SOMETHING THEY CANNOT TAKE'],28,5.9,-11.9,4,.65);
 // A landing before the first trees makes the turn a clear reveal.
 for(const x of [23,28,33,38])b(x,1.025,-13,3.8,.04,.08,0xb9b294);
 b(28,1.03,-13.2,.12,.03,2.2,0x98ac85);
 for(const x of [22,39])for(const z of [-16,-23,-30]){b(x,4.2,z,.3,6.4,.45,trim);b(x,7.6,z,.65,.25,.85,iron);}
 for(const z of [-16,-23,-30])lamp(22,5.9,z,44,13,0xffdbab);
 // The former nursery's high greenhouse frame is the new wing's landmark.
 for(const x of [23,27,31,35,39]){b(x,5,-31.7,.16,8,.2,green);b(x,9,-31.7,.25,.2,2.3,green);}
 for(const y of [3.5,5.5,7.5,9])b(31,y,-32.25,16.4,.12,.13,green);
 b(31,9.4,-31.7,17,.3,2.8,iron);
 const glass=new T.Mesh(new T.BoxGeometry(16,.06,2.3),new T.MeshStandardMaterial({color:0xb5d0c1,transparent:true,opacity:.28,roughness:.7,depthWrite:false}));glass.position.set(31,9.17,-31.7);root.add(glass);
 sign(['CONSERVATORY / 02','RECLAIMED PRISON NURSERY'],31,7.8,-32.03,10,1);
 // Nursery details remain outside all three harvest footprints.
 for(const z of [-17,-22,-27]){b(39.15,1.4,z,.6,.8,2,wood,true);b(39.15,1.83,z,.5,.06,1.8,0x554d37);for(const dz of [-.5,.5]){b(39.15,2.02,z+dz,.22,.35,.22,0x6f904f);b(39.15,2.25,z+dz,.6,.25,.5,0x79974e);}}
 b(22,2,-30.7,1.2,2,1,0x65786c,true);b(22,3.05,-30.7,1.3,.1,1.1,iron);
 b(39.4,1.12,-23,.2,.24,17,0x4f685b);b(39.4,1.25,-23,.12,.02,16.7,0x648d88);
 for(const x of [24,27,30,33,36]){b(x,1.6,-31.4,2.2,.15,.7,wood);for(const dx of [-.8,.8])b(x+dx,1.3,-31.4,.12,.6,.5,iron);}
 // A real receiving hatch supports the starting mine / sell / upgrade loop.
 b(-15.3,2.7,-5.29,2.4,1.4,.12,iron);b(-15.3,2.05,-4.98,2.7,.16,.65,wood);
 sign(['RECEIVING / E','SELL HAUL · FORGE YOUR FIRST STEEL'],-15.3,3.75,-5.22,3.8,.65);
 sign(['BLOCK 07 / FIRST SHIFT','DEEPWELL  ←     SERVICE WING  →'],.5,4.2,-4.8,4.3,.8);
 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:1}),rows.length),matrix=new T.Matrix4(),q=new T.Quaternion(),p=new T.Vector3(),s=new T.Vector3();rows.forEach((r,i)=>{matrix.compose(p.set(r.x,r.y,r.z),q,s.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});mesh.name='Batched Conservatory masonry, floor and nursery fixtures';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);
}

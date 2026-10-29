import * as T from '../../vendor/three.module.js';
import {TRAINING_WINGS,withinTraining} from './training-layout.js?v=79.1';
// Corridors have real walls and roofs; only their portcullises animate.
export function buildTrainingWings(world){
 const root=new T.Group();root.name='Prison / containment and armoury checkpoints';world.scene.add(root);world.trainingWings=root;world.trainingGates=[];
 const rows=[],iron=0x303238,stone=0x4c4d52,trim=0x79746b;
 const b=(x,y,z,w,h,d,c,solid=false)=>{rows.push({x,y,z,w,h,d,c});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(lines,x,y,z,w=3.4,h=.75,a=0,c='#efb55e')=>world.sign(lines,x,y,z,w,h,a,root,c);
 const lamp=(x,z,c,power=30)=>{b(x,5.45,z,.72,.22,.65,iron);const bulb=world.box(x,5.28,z,.46,.10,.4,c,false,root);bulb.material=world.mat(c,.6);bulb.userData.prisonBulb=true;const light=new T.PointLight(c,power,9,2);light.position.set(x,5.05,z);light.userData.workLight=true;root.add(light);};
 for(const wing of TRAINING_WINGS){
  const accent=wing.key==='attack'?0x9f5540:0xc3a16a,cells=new Set(),inside=(x,z)=>wing.passages.some(r=>withinTraining(x,z,r));
  for(let x=-3;x<52;x+=.5)for(let z=5;z<49;z+=.5)if(inside(x+.25,z+.25)&&!withinTraining(x+.25,z+.25,wing.bounds))cells.add(x+','+z);
  for(const r of wing.passages){const x=(r[0]+r[1])/2,z=(r[2]+r[3])/2;b(x,.5,z,r[1]-r[0],1,r[3]-r[2],0x77716b);b(x,5.95,z,r[1]-r[0],.3,r[3]-r[2],stone,true);}
  const edges=new Map();
  for(const key of cells){const [x,z]=key.split(',').map(Number);
   for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const nx=x+.25+dx,nz=z+.25+dz;if(inside(nx,nz)||withinTraining(nx,nz,wing.bounds))continue;
    const [gx,gz]=wing.gate;if((wing.axis==='z'&&Math.abs(z+.25-gz)<.6&&Math.abs(nx-gx)<2.2)||(wing.axis==='x'&&Math.abs(x+.25-gx)<.6&&Math.abs(nz-gz)<2.2))continue;
    const ex=x+.25+dx/2,ez=z+.25+dz/2,k=(dx?'x:':'z:')+(dx?ex:ez);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(dx?ez:ex);
   }
  }
  for(const [key,values]of edges){const [axis,fixed]=key.split(':'),v=[...new Set(values)].sort((a,b)=>a-b);let start=v[0],last=start;const flush=()=>{const center=(start+last)/2,length=last-start+.5,x=axis==='x'?+fixed:center,z=axis==='x'?center:+fixed;b(x,3.4,z,axis==='x'?.18:length,4.8,axis==='x'?length:.18,stone,true);b(x,2.2,z,axis==='x'?.20:length,.45,axis==='x'?length:.20,accent);};for(const n of v.slice(1)){if(n-last>.51){flush();start=n;}last=n;}flush();}
  const [x,z]=wing.gate,rotate=wing.axis==='x';
  for(const side of [-1,1]){b(x+(rotate?0:side*2.2),3.5,z+(rotate?side*2.2:0),rotate?.8:.4,5,rotate?.4:.8,trim,true);b(x+(rotate?0:side*2.2),6.1,z+(rotate?side*2.2:0),rotate?1:.8,.25,rotate?.8:1,iron);}
  b(x,6.4,z,rotate?.8:4.8,1.2,rotate?4.8:.8,stone,true);
  sign([wing.level.toString().padStart(2,'0')+' / '+wing.name,wing.skill+' / PRISON LEVEL '+wing.level],x+(rotate?-.45:0),6.35,z+(rotate?0:-.45),4.5,.85,rotate?-Math.PI/2:Math.PI,wing.color);
  const bars=new T.Group();bars.name=wing.name+' / unlockable portcullis';bars.position.set(x,0,z);world.scene.add(bars);
  const bar=(a,y,w,h,d)=>{const mesh=new T.Mesh(world.geometry,world.mat(iron));mesh.position.set(rotate?0:a,y,rotate?a:0);mesh.scale.set(w,h,d);bars.add(mesh);};
  for(let n=-1.8;n<=1.81;n+=.45)bar(n,3,rotate?.18:.09,4,rotate?.09:.18);
  for(const y of [1.1,3,4.95])bar(0,y,rotate?.22:4,.13,rotate?4:.22);
  const bounds=new T.Box3(new T.Vector3(x-(rotate?.3:2),1,z-(rotate?2:.3)),new T.Vector3(x+(rotate?.3:2),5.2,z+(rotate?2:.3)));
  const beacon=world.box(x+(rotate?-.48:1.55),4.5,z+(rotate?1.55:-.48),.2,.32,.2,0xe4a065,false,root);beacon.material=world.mat(0xe4a065,.4).clone();
  world.trainingGates.push({wing,bars,bounds,beacon,open:false,lift:0});
  // Flush routes and side stripes guide both entry and a safe return.
  for(let i=1;i<wing.route.length;i++){const a=wing.route[i-1],c=wing.route[i],mx=(a[0]+c[0])/2,mz=(a[1]+c[1])/2;b(mx,1.035,mz,Math.max(.1,Math.abs(a[0]-c[0])),.025,Math.max(.1,Math.abs(a[1]-c[1])),accent);}
 }
 // Finished fronts contain the rooms beyond the reveal doorways.
 b(.5,4,32.15,7,6,.5,stone,true);b(11.5,4,32.15,7,6,.5,stone,true);
 b(32.1,3.6,22.6,.5,5.2,3.2,stone,true);b(32.1,3.6,30.4,.5,5.2,4.2,stone,true);
 // Gate frontage seals old room shortcuts from the yard.
 b(20,3.4,4.4,.7,4.8,2.3,stone,true);b(20,3.4,12.8,.7,4.8,5.5,stone,true);
 for(const [x,z]of [[0,18.5],[0,22],[6,22],[6,27],[6,31]])lamp(x,z,0xffb178);
 for(const [x,z]of [[23,8],[28,8],[28,14],[28,20],[28,26],[32,26]])lamp(x,z,0xffd79d);
 sign(['←  IRON HALL','CONTAINMENT / LIVE QUARRY'],0,3.7,23.82,3.3,.85,Math.PI,'#e9a480');
 sign(['IRON HALL  →','KEEP THE RETURN PASSAGE CLEAR'],7.82,3.7,22,3.3,.85,-Math.PI/2,'#e9a480');
 sign(['←  BLOCK 07','SAFE PASSAGE / LOOT BANKED'],6,3.8,32.42,3.6,.8,0,'#e9a480');
 sign(['LONG ROOM  →','FOLLOW THE BRASS LINE'],29.82,3.7,8,3.3,.85,-Math.PI/2,'#efd296');
 sign(['←  BOW RANGE','ARMOURY / THREE FIRING LANES'],28,3.7,27.82,3.3,.85,Math.PI,'#efd296');
 sign(['BLOCK 07  →','EXCHANGE / CELLBLOCK'],32.55,4.7,26,3.6,.75,Math.PI/2,'#efd296');
 sign(['←  BLOCK 07','EXCHANGE / CELLS'],6,3.7,20.18,3.2,.8,0,'#e9a480');
 sign(['BLOCK 07  →','RETURN VIA THE ARMOURY PASSAGE'],26.18,3.7,26,3.2,.8,Math.PI/2,'#efd296');
 sign(['←  BLOCK 07','EXCHANGE / CELLS'],28,3.7,6.18,3.2,.8,0,'#efd296');
 // Character at the two turns, never in walking or fighting lanes.
 for(const z of [17.5,19]){b(-1.82,3,z,.09,2.5,.9,iron);for(let dz=-.3;dz<=.31;dz+=.3)b(-1.73,3,z+dz,.08,2.4,.06,trim);}
 sign(['CONTAINMENT ORDERS','WEAPONS ISSUED / NO ENTRY WITHOUT CLEARANCE'],1.84,3.5,18.2,3,.8,-Math.PI/2,'#e9a480');
 sign(['PRISON ARMOURY','COUNT EVERY ARROW BACK IN'],25,3.6,9.82,3.7,.8,Math.PI,'#efd296');
 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:1}),rows.length),matrix=new T.Matrix4(),q=new T.Quaternion(),pos=new T.Vector3(),scale=new T.Vector3();
 rows.forEach((r,i)=>{matrix.compose(pos.set(r.x,r.y,r.z),q,scale.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.c));});mesh.name='Instanced checkpoints and dogleg corridors';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);
}
export function updateTrainingGates(world,dt){let moving=false;for(const g of world.trainingGates){const target=g.open?5.4:0;g.lift+=(target-g.lift)*Math.min(1,dt*4);if(Math.abs(target-g.lift)<.005)g.lift=target;g.bars.position.y=g.lift;g.beacon.material.color.setHex(g.open?0xa6c791:0xe4a065);if(g.lift!==target)moving=true;}if(moving)world.refreshBlockers();}

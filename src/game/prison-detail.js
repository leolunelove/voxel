import * as T from '../../vendor/three.module.js';
import {GATES} from './prison-layout.js?v=64';

// Dressing stays beside the walking lanes; colliders are owned by PrisonWorld.
export function dressPrison(world,{box,mat,group:g,cube}){
 const metal=0x344b41,stone=0x69766a,wood=0x89704d,cream=0xe4d6b5;
 const plaque=(lines,x,y,z,w=4,h=1.5,angle=0,color='#dfbb7e',floor=false)=>{
  const c=document.createElement('canvas');c.width=1024;c.height=384;const ctx=c.getContext('2d');
  if(!floor){ctx.fillStyle='#182d26';ctx.fillRect(0,0,1024,384);ctx.fillStyle=color;ctx.fillRect(0,0,12,384);ctx.fillRect(28,20,968,3);ctx.fillRect(28,362,968,3);}
  lines.forEach((line,i)=>{let size=lines.length===1?100:i===0?90:64;ctx.font='bold '+size+'px monospace';while(ctx.measureText(line).width>940&&size>12){size-=2;ctx.font='bold '+size+'px monospace';}ctx.fillStyle=i===0?color:'#c0c8b4';ctx.fillText(line,44,lines.length===1?240:115+i*(235/Math.max(1,lines.length-1)));});
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,transparent:floor,depthWrite:!floor,polygonOffset:true,polygonOffsetFactor:-2}));m.position.set(x,y,z);m.rotation.set(floor?-Math.PI/2:0,0,0);if(floor)m.rotation.z=angle;else m.rotation.y=angle;g.add(m);return m;
 };
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;const ctx=shadowCanvas.getContext('2d');const grad=ctx.createRadialGradient(32,32,3,32,32,32);grad.addColorStop(0,'#07181099');grad.addColorStop(1,'#07181000');ctx.fillStyle=grad;ctx.fillRect(0,0,64,64);const shade=new T.CanvasTexture(shadowCanvas);
 const shadow=(x,z,w,d)=>{const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:shade,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,1.04,z);g.add(m);};
 const crate=(x,z,size=1)=>{shadow(x,z,size*2,size*2);box(x,1+size/2,z,size,size,size,wood,true);for(const dz of [-size*.51,size*.51]){for(const yy of [1.12,1+size-.12])box(x,yy,z+dz,size+.04,.1,.06,0x554d39);for(const dx of [-size*.36,size*.36])box(x+dx,1+size*.5,z+dz,.09,size,.07,0xbaa06b);}box(x,1+size+.015,z,size,.035,.12,0xc0a373);};
 const bench=(x,z,angle=0)=>{const b=new T.Group();b.position.set(x,0,z);b.rotation.y=angle;g.add(b);const part=(a,y,c,w,h,d,color)=>{const m=new T.Mesh(cube,mat(color));m.position.set(a,y,c);m.scale.set(w,h,d);b.add(m);};for(const dx of [-1,1]){part(dx,1.3,0,.13,.6,.65,metal);part(dx,1.9,.29,.1,1.1,.1,metal);}for(const yy of [1.6,2,2.22])part(0,yy,yy===1.6?0:.29,2.8,.13,yy===1.6?.8:.12,wood);b.updateMatrixWorld(true);world.blockers.push(new T.Box3().setFromObject(b));shadow(x,z,4,2);};
 // Worn paving: chips and seams replace the large chessboard pattern.
 const paving=document.createElement('canvas');paving.width=paving.height=64;const pctx=paving.getContext('2d');pctx.fillStyle='#a7afa4';pctx.fillRect(0,0,64,64);for(let n=0;n<260;n++){const v=145+(n*17)%35;pctx.fillStyle='rgb('+v+','+(v+4)+','+v+')';pctx.fillRect((n*13)%64,(n*29)%64,n%3+1,1);}pctx.fillStyle='#737e73';pctx.fillRect(0,0,64,1);pctx.fillRect(0,0,1,64);pctx.fillRect(9,26,9,1);pctx.fillRect(17,27,1,5);const pmap=new T.CanvasTexture(paving);pmap.magFilter=T.NearestFilter;pmap.colorSpace=T.SRGBColorSpace;world.paving.material.map=pmap;world.paving.material.color.setHex(0x929c8c);
 const matrix=new T.Matrix4();world.paving.instanceColor=null;world.paving.material.needsUpdate=true;
 // Cellblock: barred doors, number plates, high windows and a patrolled gallery.
 for(const x of [-14.4,14.4]){
  const inward=x<0?1:-1,rotation=x<0?Math.PI/2:-Math.PI/2;
  for(const z of [24,31,37]){
   box(x,4.5,z,.10,1.5,2,0x182c29);box(x+inward*.03,4.5,z,.1,1.1,1.7,0x8caa94,false,.25);
   for(let dz=-.75;dz<=.8;dz+=.38)box(x+inward*.12,4.5,z+dz,.1,1.7,.07,metal);
   box(x+inward*.15,4.45,z,.10,.09,2,metal);plaque(['CELL '+(x<0?'A':'B')+' / '+z],x+inward*.2,3.2,z,2,.45,rotation);
  }
  for(const z of [23,36]){box(x+inward*.35,3.4,z,.15,4.8,.15,0x796d50);for(const y of [1.7,5.5])box(x+inward*.35,y,z,.3,.2,.3,metal);}
  box(x,7.7,30,1.5,.25,21,0x86917c);for(const height of [8,8.8])box(x+inward*.8,height,30,.1,.1,21,metal);for(let z=20;z<=40;z+=2)box(x+inward*.8,8.35,z,.1,1.1,.1,metal);
 }
 plaque(['VOXEL / BLOCK 07','INTAKE & CELLBLOCK'],.5,5.6,40.1,11,2.8,Math.PI);
 for(const x of [-5,-2,2,5]){box(x,3,40.42,2,3.4,.13,0x1e342b);for(let dx=-.75;dx<=.8;dx+=.5)box(x+dx,3,40.28,.09,3.5,.12,0x8d977d);plaque(['07 / INTAKE'],x,5.15,40.24,2,.55);}
 for(const x of [-12.5,12.5])for(const z of [23,36])bench(x,z,x<0?Math.PI/2:-Math.PI/2);
 // Work counters gain equipment, an actual forge opening, and storage.
 for(const x of [-10,10]){shadow(x,29,8,6);box(x,4.65,29,6.3,.1,4.3,0x8b8266);for(const dx of [-2.6,2.6])box(x+dx,1.9,31.1,.12,1.8,.12,0xd4b274);}
 crate(-12,32,1);crate(-10.6,32.4,.75);box(-10,3.1,29,1.4,.12,1,0xc7b383);box(-10,3.2,29,.8,.08,.5,cream);box(-8.5,3.3,29,.25,.6,.3,0x5e7560);
 box(10,2.2,30.56,2.6,1.5,.12,0x1b2e28);box(10,2.15,30.64,1.5,.7,.06,0xe6a467,false,.85);for(let dx=-.7;dx<=.8;dx+=.3)box(10+dx,2.15,30.71,.06,.85,.08,metal);
 box(11.7,3.2,29,.8,.35,.5,0x7b8981);box(11.7,3.45,29,1.2,.18,.55,0xb6c0ad);crate(12,32,1.1);
 // Washing strung above the yard gives the prison a human scale.
 for(const z of [34,38]){box(0,6.6,z,28,.025,.025,metal);for(const x of [-9,-6,5,8]){box(x,6.15,z,1.1,.85,.035,x<0?0xaaa68e:0x758577);box(x-.4,6.6,z,.05,.16,.07,wood);box(x+.4,6.6,z,.05,.16,.07,wood);}}
 // A compact notice board sits off the main lanes, readable from spawn.
 for(const x of [4.8,9.2])box(x,2.6,25,.16,3.2,.16,metal,true);
 plaque(['BLOCK 07 / WAYFINDING','A  ←  DEEPWELL     TIMBER  →','B / C / D  ↑  SERVICE ROAD'],7,3.2,25.15,5,1.9);
 box(7,3.2,25,5,1.9,.14,metal,true);
 plaque(['YOUR SHIFT. YOUR PACE.','Sell your haul / E · Forge / E'],7,1.9,25.15,4,.8);
 // Painted floor routes stay continuous across the yard and every junction.
 const stripe=(x,z,w,d,color)=>box(x,1.014,z,w,.016,d,color);
 stripe(-1.6,24,.10,17,0xe2bd78);stripe(-16,16,29,.10,0xe2bd78);
 stripe(1.6,25,.10,14,0x9bc38b);stripe(9,18,15,.10,0x9bc38b);
 stripe(-1.6,-2,.10,29,0x9cbbca);stripe(-16,-20,29,.10,0x9cbbca);
 stripe(1.6,-22,.10,72,0xc6b083);stripe(-15,-57,33,.10,0xdfbc72);stripe(17,-57,31,.10,0xe4a077);
 plaque(['A / DEEPWELL  ←'], -8,1.032,17.8,6,1.3,0,'#dfbc7f',true);
 plaque(['TIMBER YARD  →'],9,1.032,17,6,1.3,0,'#b0cc9b',true);
 plaque(['B / C / D  ↑'],.5,1.032,13,5,1.3,0,'#bbccd0',true);
 for(const z of [23,27,31]){stripe(0,z,.75,1.1,0xd3c7a7);stripe(0,z+.65,1.3,.12,0xd3c7a7);}
 // Junction signs are readable from both directions and mounted to structures.
 for(const [z,title,sub,color]of [[-24,'B / IRONWORKS  ←','C / GILDED FAULT · D / EMBER  ↑','#aac8d3'],[-61,'C  ←   GILDED FAULT / EMBER HOLLOW   →  D','FOLLOW YOUR PERMIT. KEEP YOUR HAUL.','#dfbd7d']]){
  for(const x of [-5.2,5.2])box(x,3,z,.16,4,.16,metal);
  plaque([title,sub],.5,4.1,z+.12,10,1.7,0,color);
  plaque(['CENTRAL YARD  ↑','EXCHANGE / FORGE / CELLBLOCK'],.5,4.1,z-.12,10,1.7,Math.PI);
 }
 plaque(['CENTRAL YARD  ↑','SELL / FORGE / REST'],.5,4.5,8.86,9,1.5,Math.PI);
 for(const gate of GATES){const {x,z,axis,index}=gate;const rot=axis==='x'?-Math.PI/2:0,color=['#dfbc7f','#aac8d3','#dfbd7d','#ecaa7c','#b0cc9b'][index];
  const marker=plaque([index===4?'02 / TIMBER YARD':'0'+(index+1)+' / WORK WING '+String.fromCharCode(65+index),index===4?'LEVEL 2 / 20 BLOCKS MINED':'PERMANENT ACCESS / MINE PERMIT'],x,3.9,z+.65,index===4?5:6,1.3,rot,color);
  // Header at the top remains visible; this smaller plaque sits beside the doorway.
  marker.position.x+=axis==='x'?.1:6;marker.position.z+=axis==='x'?5:0;
  plaque(['CENTRAL YARD','EXCHANGE / FORGE'],x,6.6,z-.45,6,1.1,rot+Math.PI);
 }
 // Utility runs and stored supplies break up long service-road walls.
 for(const x of [-4.45,4.45])for(const [a,b]of [[-52,-25],[-15,6]]){box(x,2.5,(a+b)/2,.12,.12,b-a,0x887d60);for(let z=a;z<=b;z+=4)box(x,2.5,z,.24,.27,.1,metal);}
 for(const [x,z]of [[-3,-7],[3,-36],[-3,-46],[-34,17],[35,-55]]){crate(x,z,.9);crate(x+.4,z+1.1,.7);}
 // Guard hardware: cameras, wall lamps and weathered brackets.
 for(const x of [-13.8,13.8])for(const z of [22,34]){box(x,6.3,z,.6,.12,.15,metal);const camera=box(x+(x<0?.35:-.35),6.1,z,.55,.24,.26,0x8b9686);camera.rotation.z=x<0?-.3:.3;box(x+(x<0?.63:-.63),6.1,z,.03,.16,.20,0x192f28);box(x,5.5,z,.4,.12,.5,0xe4c991,false,.7);}
 // Sawmill stores and irregular log ends distinguish the tree yard.
 for(let n=0;n<7;n++){const x=39+(n%3)*.55,y=1.3+Math.floor(n/3)*.52;box(x,y,20,.48,.48,2.3,wood);box(x,y,21.17,.42,.42,.035,0xb99b68);box(x,y,21.2,.18,.18,.04,0x73583b);}
 plaque(['TIMBER YARD','NEW ROOTS. SAME WALLS.'],30,4.3,4.7,9,1.7);
 // Quiet drifting motes, frozen by reduced motion and pause.
 const dust=new T.InstancedMesh(new T.BoxGeometry(.022,.022,.022),new T.MeshBasicMaterial({color:0xf0d8a7,transparent:true,opacity:.35}),42);g.add(dust);world.yardMotes={mesh:dust,time:0,matrix};
 return {plaque};
}

export function updatePrisonDetail(world,dt,reduced){const dust=world.yardMotes;if(!dust)return;dust.time+=reduced?0:dt;for(let i=0;i<42;i++){const x=Math.sin(i*73)*13+Math.sin(dust.time*.17+i)*.25,y=1.6+(i*1.71)%5+Math.sin(dust.time*.23+i)*.14,z=12+(i*3.7)%26;dust.matrix.makeTranslation(x,y,z);dust.mesh.setMatrixAt(i,dust.matrix);}dust.mesh.instanceMatrix.needsUpdate=true;}

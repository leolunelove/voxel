import * as T from '../../vendor/three.module.js';
import {LAYOUTS,columnTop} from './layouts.js?v=81.3';
import {MINES} from './rules.js?v=81.3';
export function buildEnvironment(world){
 const index=world.mine,L=LAYOUTS[index],g=new T.Group();g.name=L.id;world.scene.add(g);world.environment=g;world.blockers=[];world.ambientMotes=[];
 const materials=new Map(),cube=new T.BoxGeometry(1,1,1);
 const mat=(color,glow=0)=>{const key=color+':'+glow;if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color,roughness:glow?.65:.92,metalness:index===1?.28:.05,emissive:glow?color:0,emissiveIntensity:glow}));return materials.get(key);};
 const box=(x,y,z,w,h,d,color,solid=false,glow=0)=>{const m=new T.Mesh(cube,mat(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);g.add(m);if(solid)world.blockers.push(new T.Box3().setFromObject(m));return m;};
 const beam=(a,b,width,color)=>{const from=new T.Vector3(...a),to=new T.Vector3(...b),m=box(0,0,0,width,from.distanceTo(to),width,color);m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),to.sub(from).normalize());return m;};
 const lamp=(x,y,z,color,power=10)=>{box(x,y,z,.42,.20,.42,color,false,1);const light=new T.PointLight(color,power,14,2);light.position.set(x,y-.25,z);g.add(light);};
 const rail=(x,z,w,d)=>{box(x,1.9,z,w,.10,d,0x35423e);};
 const text=(content,x,y,z,w=5,h=.8,color='#e1c58b')=>{const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#17251f';ctx.fillRect(0,0,1024,160);ctx.fillStyle=color;ctx.fillRect(0,0,12,160);ctx.font='bold 65px monospace';let size=65;while(ctx.measureText(content).width>950){size-=2;ctx.font='bold '+size+'px monospace';}ctx.fillText(content,35,105);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}));m.position.set(x,y,z);g.add(m);};
 if(index===0||index===2){
 const c=document.createElement('canvas');c.width=128;c.height=64;const ctx=c.getContext('2d');let seed=17;
 const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 ctx.fillStyle='#90968e';ctx.fillRect(0,0,128,64);
 for(let row=0;row<4;row++)for(let col=-1;col<5;col++){const shade=155+Math.floor(rand()*35),x=col*32+(row%2)*16,y=row*16;ctx.fillStyle='rgb('+shade+','+(shade+3)+','+shade+')';ctx.fillRect(x+1,y+1,30,14);ctx.fillStyle='#626d64';ctx.fillRect(x,y,32,1);ctx.fillRect(x,y,1,16);}
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(4,2);map.magFilter=T.NearestFilter;map.colorSpace=T.SRGBColorSpace;mat(L.wall).map=map;mat(L.wall).needsUpdate=true;
 }
 const [xmin,xmax,zmin,zmax]=L.bounds;
 // One instanced floor avoids hundreds of individual floor-tile draw calls.
 const floorCells=[];for(let x=xmin;x<=xmax;x++)for(let z=zmin;z<=zmax;z++)if(columnTop(index,x,z)===null)floorCells.push([x+.5,z+.5]);
 const deck=new T.InstancedMesh(cube,mat(L.floor),floorCells.length),matrix=new T.Matrix4();
 floorCells.forEach(([x,z],i)=>{matrix.makeTranslation(x,.5,z);deck.setMatrixAt(i,matrix);deck.setColorAt(i,new T.Color(0xffffff).multiplyScalar((Math.floor(x)+Math.floor(z))%2===0?1:.89));});g.add(deck);
 box((xmin+xmax+1)/2,L.bottom-.5,(zmin+zmax+1)/2,xmax-xmin+1,1,zmax-zmin+1,L.ground);
 g.add(new T.HemisphereLight(L.ambient,L.ground,L.intensity));const sun=new T.DirectionalLight(L.sun,L.sunPower);sun.position.set(-4,12,5);g.add(sun);
 // Common return gate is behind the player, never over the mining sightline.
 if(!world.connected){box(.5,3.5,8.6,6,5,.5,L.wall,true);for(let x=-1;x<=2;x++)box(x,3.4,8.25,.10,4.4,.12,0x293c34,true);
 text('BLOCK 07 / WORKERS’ NETWORK',.5,5.8,8.30,5,.65);}
 if(index===0){
  for(const x of [xmin-.5,xmax+1.5]){box(x,4,-5,1,8,28,L.wall,true);for(let z=-17;z<=6;z+=3)box(x+(x<0?.55:-.55),3.6,z,.18,.14,2.8,0x839080);}
  box(.5,4,zmin-.5,22,8,1,L.wall,true);
  for(const x of [-8.8,9.8])for(const z of [-16,4]){
   box(x,3.7,z,.32,5.5,.32,0x70553d,true);box(x,6.4,z,2.4,.4,2.4,0x66523d);
   box(x,8.5,z,3,.3,3,0x4a4637);for(const dx of [-.9,.9])box(x+dx,7.4,z,.15,1.8,.15,0x6e583e);
   box(x,6.9,z,2.2,.8,.16,0x53664d);lamp(x,7.7,z,0xffd39c,8);
  }
  for(const z of [-14,-6,2])beam([-10,8,z],[11,8,z],.15,0x283c32);
  for(const x of [-8,9])rail(x,-7,.13,15);
  box(-3.5,1.5,3,1,1,1,0x92704b,true);box(3.4,1.5,3,1,1,1,0x92704b,true);
  text('A / THE DEEPWELL',.5,4.9,zmin+.05,8,1.1);
  text('YOUR SHIFT. YOUR PACE.',.5,3.6,zmin+.06,5,.6);
 }else if(index===1){
  for(const x of [-11.5,12.5])box(x,5,-6.5,1,10,31,L.wall,true);
  box(.5,5,zmin-.5,24,10,1,L.wall,true);box(.5,11,-7,24,.5,31,0x1d2c35);
  // Two pits and a central walk-through inspection gantry.
  for(const x of [-1,2])for(const z of [-16,-10,-4]){box(x,2,z,.12,2,.12,0x263943,true);rail(x,z,.12,5.4);}
  for(const z of [-18,-9,1]){box(.5,8.2,z,23,.6,.5,0x675744);for(const x of [-10,11])box(x,4.6,z,.5,7.1,.5,0x657382,true);}
  beam([-9,7.6,-18],[9,7.6,-18],.2,0x899092);box(-4,6.9,-18,.14,1.4,.14,0x7e8a85);box(-4,6.1,-18,.9,.3,.7,0x303b42);
  for(const x of [-8,-3,3,8]){box(x,2.4,-19.5,2.6,2.8,1.6,0x51463e,true);box(x,2.3,-18.63,1.7,1.4,.06,0xff883e,false,1.5);for(let dx=-.7;dx<=.7;dx+=.35)box(x+dx,2.3,-18.57,.06,1.5,.1,0x292f31);box(x,6.4,-20,1,5.1,1,0x343d41);}
  lamp(-5,6,-9,0xffac69,32);lamp(5,6,-9,0xffac69,32);lamp(-4,7,1,0xbcdced,18);lamp(5,7,-17,0xbcdced,18);
  for(const x of [-9,10]){box(x,1.01,-8,.13,.03,18,0xe3b66b);box(x,8,-8,.5,.5,21,0x5c7281);}
  text('B / IRONWORKS',.5,8.8,-20.9,8,1.1);text('THE FURNACES ARE OURS NOW',.5,7.5,-20.88,7,.65);
 }else if(index===2){
  box(.5,5.5,-22.5,26,11,1,L.wall,true);for(const x of [-12.5,13.5])box(x,5.5,-7,1,11,32,L.wall,true);
  // A clipped octagonal excavation, radial vault ribs, and a raised outer gallery.
  for(const x of [-10,11])for(const z of [-18,-10,-2]){
   box(x,4.7,z,.7,7.4,.7,0x757d88,true);box(x,1.25,z,1.2,.5,1.2,0xa69264,true);box(x,8.5,z,1.1,.3,1.1,0xc5ab6c);
   beam([x,8.6,z],[.5,11.8,z],.33,0x8a8a7a);
  }
  for(const x of [-10.5,11.5]){box(x,1.45,-9,1,1,16,0x8c8979,true);box(x,2,-9,1.2,.12,16,0xc6ae70);}
  // Giant sealed company vault, now a workers' landmark.
  box(.5,4.7,-22,6.6,7.3,.8,0x293b45,true);box(.5,4.7,-21.5,5.4,6,.16,0x7b7e78);
  for(const x of [-2.5,3.5])box(x,4.7,-21.36,.18,7,.18,0xd5b469);
  box(.5,4.7,-21.25,4.5,.15,.2,0xc7ae72);box(.5,4.7,-21.15,.15,4.8,.2,0xc7ae72);
  for(const [x,z]of [[-10,-16],[10,-16],[-10,-4],[10,-4]]){for(let j=0;j<3;j++){const crystal=box(x+(j-1)*.45,2.8+j*.45,z,.4,2+j*.6,.5,j===1?0xe4c47e:0x9ac9ef,false,.35);crystal.rotation.z=(j-1)*.22;}lamp(x,5,z,0xb4d8ff,18);}
  lamp(.5,9,-10,0xffd897,35);text('C / GILDED FAULT',.5,9.5,-22,9,1);text('THE COMPANY’S VAULT. OUR SEAM.',.5,8.3,-21.98,7,.65);
 }else{
  // No flat roof: staggered basalt blocks form an uneven cavern silhouette.
  for(let z=-22;z<=6;z+=2){for(const side of [-1,1]){const height=7+Math.abs(Math.sin(z*2.7))*5,x=side*(11.8+Math.sin(z)*.6)+.5;box(x,1+height/2,z,1.8,height,2.1,L.wall,true);box(x-side*.7,2.9,z,.13,3.5,.25,0xe97f50,false,.6);}}
  for(let x=-11;x<=11;x+=2){const h=8+Math.abs(Math.sin(x*3))*5;box(x+.5,1+h/2,-23,2,h,2,L.wall,true);}
  // A non-minable spine divides the terraced ore beds.
  for(let z=-15;z<=-5;z+=2){const h=3+Math.abs(Math.sin(z))*4;box(.5,1+h/2,z,2.5,h,2,0x292a36,true);box(-.78,2.6,z,.06,2,.16,0xf3a164,false,.7);}
  for(const x of [-10,11]){box(x,1.015,-9,1,.035,24,0xe7804b,false,1.2);rail(x+ (x<0?.6:-.6),-9,.14,23);for(const z of [-19,-9,1])box(x+(x<0?.6:-.6),1.7,z,.12,1.4,.12,0x3b3e46,true);}
  for(const z of [-19,-8,2])beam([-11,10,z],[12,11,z-1],.28,0x5c4f48);
  for(const [x,z]of [[-10,-17],[11,-17],[-10,-4],[11,-4]]){box(x,2,z,.6,2,.6,0x7e4c3d,true);lamp(x,3.3,z,0xff9c69,26);}
  text('D / EMBER HOLLOW',.5,10.2,-22,9,1.15);text('BEYOND THE COMPANY’S MAPS',.5,8.8,-21.98,7,.7);
 }
 // Airborne dust/embers are decorative and never collide.
 const dust=new T.InstancedMesh(new T.BoxGeometry(.026,.026,.026),new T.MeshBasicMaterial({color:index===3?0xffb17b:0xd6cfab,transparent:true,opacity:.42}),48);g.add(dust);world.dust=dust;
 for(let i=0;i<48;i++)world.ambientMotes.push({x:Math.sin(i*93)*9+.5,y:1+((i*1.7)%7),z:-1-((i*3.7)%18)});
 world.environmentTime=0;
}
export function disposeEnvironment(group){if(!group)return;group.removeFromParent();const geometries=new Set(),materials=new Set(),textures=new Set();group.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)geometries.add(o.geometry);if(o.material){materials.add(o.material);if(o.material.map)textures.add(o.material.map);}});geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());}

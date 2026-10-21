import * as T from '../../vendor/three.module.js';
import {dressPrison,updatePrisonDetail} from './prison-detail.js?v=59';
import {World,keyOf} from './world.js?v=59';
import {LAYOUTS} from './layouts.js?v=59';
import {MINES} from './rules.js?v=59';
import {PRISON_SPAWN,WINGS,PATHS,GATES,onPath,wingAt,areaAt,gateOpen,prisonLevel} from './prison-layout.js?v=59';

export class PrisonWorld{
 constructor(scene){
  this.scene=scene;this.mine=0;this.layout={spawn:PRISON_SPAWN};this.blockers=[];this.wings=[];this.trees=[];this.gates=[];this.meshes=[];this.state={rank:0,mined:0};
  scene.background=new T.Color(0x718782);scene.fog=new T.FogExp2(0x718782,.009);
  for(let i=0;i<4;i++){
   const root=new T.Group();root.position.set(WINGS[i].x,0,WINGS[i].z);scene.add(root);
   const w=new World(root);w.connected=true;w.generate(i);w.root=root;this.buildRamp(w,i);w.environment.traverse(o=>{if(o.isHemisphereLight||o.isDirectionalLight)o.visible=false;});
   root.updateMatrixWorld(true);
   for(const b of w.blockers)b.translate(root.position);
   for(const m of w.meshes){m.userData.wing=i;m.userData.localKey=m.userData.key;m.userData.key=i+':'+m.userData.key;}
   this.wings.push(w);this.meshes.push(...w.meshes);this.blockers.push(...w.blockers);
  }
  this.build();this.syncGates(this.state,true);
 }
 buildRamp(w,index){
  const x=[.5,-4.5,.5,-4.5][index],bottom=LAYOUTS[index].bottom,count=(1-bottom)*2;
  // Permanent half-block stairs keep deep excavations connected to the entrance.
  for(const mesh of [...w.meshes])if(Math.abs(mesh.position.x-x)<1.6&&mesh.position.z>=-count&&mesh.position.z<0)w.remove(mesh);
  const material=new T.MeshStandardMaterial({color:index===3?0x776153:0x839080,roughness:.94});
  for(let n=0;n<count;n++){const height=(n+1)*.5,z=-count+n+.5;const m=new T.Mesh(w.geometry,material);m.position.set(x,bottom+height/2,z);m.scale.set(3,height,1);w.environment.add(m);w.blockers.push(new T.Box3().setFromObject(m));}
 }
 build(){
  const g=new T.Group();this.scene.add(g);this.environment=g;const cube=new T.BoxGeometry(),mats=new Map();
  const mat=(c,glow=0)=>{const k=c+':'+glow;if(!mats.has(k))mats.set(k,new T.MeshStandardMaterial({color:c,roughness:.88,emissive:glow?c:0,emissiveIntensity:glow}));return mats.get(k);};
  const box=(x,y,z,w,h,d,c,solid=false,glow=0)=>{const m=new T.Mesh(cube,mat(c,glow));m.position.set(x,y,z);m.scale.set(w,h,d);g.add(m);if(solid)this.blockers.push(new T.Box3().setFromObject(m));return m;};
  const sign=(words,x,y,z,w=6,angle=0)=>{const c=document.createElement('canvas');c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#182e25';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#dcb87a';ctx.fillRect(0,0,14,192);let size=64;ctx.font='bold '+size+'px monospace';while(ctx.measureText(words).width>950){size-=2;ctx.font='bold '+size+'px monospace';}ctx.fillText(words,36,118);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,w*.1875),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide}));m.position.set(x,y,z);m.rotation.y=angle;g.add(m);return m;};
  this.sign=sign;
  // Union of paved cells: a continuous solid yard with no seams at wing entrances.
  const cells=[];for(let x=-45;x<=44;x++)for(let z=-64;z<=49;z++)if(onPath(x+.5,z+.5)&&wingAt(x+.5,z+.5)<0)cells.push([x+.5,z+.5]);
  const floor=new T.InstancedMesh(cube,mat(0x657069),cells.length),matrix=new T.Matrix4();cells.forEach(([x,z],i)=>{matrix.makeTranslation(x,.5,z);floor.setMatrixAt(i,matrix);floor.setColorAt(i,new T.Color((Math.floor(x)+Math.floor(z))%2?0xc7cbbb:0xe0dfca));});g.add(floor);this.paving=floor;
  this.daylight=new T.HemisphereLight(0xd7e1cb,0x425346,1.8);g.add(this.daylight);const sun=new T.DirectionalLight(0xffdfa5,2.3);sun.position.set(-20,45,25);g.add(sun);this.sun=sun;
  box(0,-7,-23,100,.5,152,0x485a40);
  const grassCells=[];for(let x=-47;x<48;x++)for(let z=-96;z<51;z++)if(!onPath(x+.5,z+.5)&&wingAt(x+.5,z+.5)<0)grassCells.push([x+.5,z+.5]);
  const grass=new T.InstancedMesh(cube,mat(0x516343),grassCells.length);grassCells.forEach(([x,z],i)=>{matrix.makeTranslation(x,.45,z);grass.setMatrixAt(i,matrix);grass.setColorAt(i,new T.Color().setScalar(.91+Math.abs(Math.sin(x*71+z*39))*.09));});g.add(grass);
  // The outer wall and watchposts make the separate work wings read as one prison.
  for(const x of [-48,48])box(x,5,-23,1.5,10,150,0x526356);
  for(const z of [-97,51])box(0,5,z,97,10,1.5,0x526356);
  for(const x of [-46,46])for(const z of [-94,47]){box(x,6,z,4,12,4,0x435749);box(x,12.2,z,6,.5,6,0xa3a386);box(x,13.4,z,4,2,4,0x2f4539);box(x,14.6,z,6,.4,6,0x8e947a);}
  // Instanced perimeter rails mark the actual walkable edge without extra draw calls.
  const edges=[];for(const [x,z]of cells)for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]])if(!onPath(x+dx,z+dz)&&wingAt(x+dx,z+dz)<0)edges.push([x+dx*.5,z+dz*.5,dx]);
  for(const y of [1.3,2.6]){const rails=new T.InstancedMesh(cube,mat(0x354d3c),edges.length);edges.forEach(([x,z,dx],i)=>{matrix.compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(dx?.09:1,.12,dx?1:.09));rails.setMatrixAt(i,matrix);});g.add(rails);}
  const posts=new T.InstancedMesh(cube,mat(0x596b50),edges.length);edges.forEach(([x,z],i)=>{matrix.compose(new T.Vector3(x,1.9,z),new T.Quaternion(),new T.Vector3(.10,1.8,.10));posts.setMatrixAt(i,matrix);});g.add(posts);
  // Low retaining walls trace the corridor; tall walls enclose the central yard.
  for(const x of [-5,5])for(const [a,b]of [[-53,-24],[-16,7]]){box(x,2.1,(a+b)/2,1,2.2,b-a,0x526255,true);box(x,3.3,(a+b)/2,1.2,.22,b-a,0x89917b);}
  for(const x of [-15,15]){box(x,4,30,1,7,20,0x526456,true);box(x,7.6,30,1.3,.3,20,0xa4a78d);}
  box(0,4,41,15,7,1,0x526456);box(0,4,49.7,16,7,1,0x526456,true);
  for(const x of [-7.5,7.5])box(x,4,45,1,7,9,0x526456,true);
  sign('VOXEL / BLOCK 07',.5,6.5,40.35,11);sign('CENTRAL YARD',.5,4.7,40.34,6);
  // Exchange and forge are landmarks on the edges of the open yard.
  for(const [x,label,c]of [[-10,'WORKERS’ EXCHANGE',0xe3be82],[10,'THE FORGE',0xf19a61]]){
   box(x,2,29,5,2,3,0x364c3e,true);box(x,4.4,29,6,.35,4,0x31483b);for(const dx of [-2.5,2.5])box(x+dx,2.6,29,.18,3.5,.18,0x806747,true);
   sign(label,x,3.4,30.6,5);box(x,1.2,31,5,.06,.5,c);
  }
  for(const x of [-5,6])box(x,3.2,9,.2,4.4,.2,0x3f5541);
  sign('MINE A  ←     TIMBER YARD  →',.5,4.8,9,10);sign('B / C / D  —  NORTH CORRIDOR',.5,3.5,9,9);
  for(const z of [0,-12,-35,-48]){box(-3.8,1.025,z,.16,.04,3,0xd5b67e);box(3.8,1.025,z,.16,.04,3,0xd5b67e);}
  for(const gate of GATES){
   const {x,z,axis,index}=gate;const rotate=axis==='x';
   for(const side of [-1,1])box(x+(rotate?0:side*3.8),3.7,z+(rotate?side*3.8:0),rotate?1:1.2,5.4,rotate?1.2:1,0x526454,true);
   box(x,6.4,z,rotate?1:8.8,.5,rotate?8.8:1,0x8f967d);
   const bars=new T.Group();bars.position.set(x,0,z);g.add(bars);
   for(let n=-3;n<=3;n++){const m=new T.Mesh(cube,mat(0x2b4438));m.scale.set(rotate?.24:.12,5.1,rotate?.12:.24);m.position.set(rotate?0:n,3.55,rotate?n:0);bars.add(m);}
   for(const y of [1.2,3.5,5.9]){const m=new T.Mesh(cube,mat(0xb09360));m.scale.set(rotate?.26:7,.14,rotate?7:.26);m.position.y=y;bars.add(m);}
   const bounds=new T.Box3(new T.Vector3(x-(rotate?.4:3.5),1,z-(rotate?3.5:.4)),new T.Vector3(x+(rotate?.4:3.5),6.2,z+(rotate?3.5:.4)));
   const label=index===4?'TIMBER YARD / LEVEL 2':MINES[index].rank+' / '+MINES[index].name.toUpperCase();sign(label,x,7.3,z+.55,index===4?7:8,rotate?-Math.PI/2:0);
   // Solid rear facade leaves only the gated doorway open.
   if(!rotate)for(const side of [-1,1])box(x+side*8,3.5,z,8.5,5,.6,LAYOUTS[index].wall,true);
   const light=box(x+(rotate?.6:3.7),5.7,z+(rotate?3.7:.6),.22,.22,.22,0xeabf7c,false,1);
   light.material=light.material.clone();this.gates.push({definition:gate,bars,bounds,light,open:false,lift:0});
  }
  // Tree yard fenced around its one entrance. Trees never obstruct the connecting path.
  for(const x of [18,43.5]){if(x===18){box(x,2.5,7, .4,3,6,0x586b4f,true);box(x,2.5,28,.4,3,12,0x586b4f,true);}else box(x,2.5,19,.4,3,30,0x586b4f,true);}
  for(const z of [4,34.5])box(30.5,2.5,z,26,3,.4,0x586b4f,true);
  box(30,1.03,19,23,.06,28,0x637b45);sign('THE OLD EXERCISE YARD / NEW ROOTS',30,5,4.4,12);
  const leafCanvas=document.createElement('canvas');leafCanvas.width=leafCanvas.height=32;const leafCtx=leafCanvas.getContext('2d');leafCtx.fillStyle='#a8bd8d';leafCtx.fillRect(0,0,32,32);for(let n=0;n<180;n++){leafCtx.fillStyle=n%3?'#80946b':'#c1ce9b';leafCtx.fillRect((n*17)%32,(n*11)%32,2+(n%3),2);}const leafMap=new T.CanvasTexture(leafCanvas);leafMap.magFilter=T.NearestFilter;leafMap.colorSpace=T.SRGBColorSpace;mat(0x799957).map=leafMap;mat(0x456d42).map=leafMap;
  for(const [x,z]of [[23,8],[32,9],[39,9],[23,27],[31,29],[39,26]]){
   box(x+.5,1.075,z+.5,4,.015,4,0x465c38);
   const tree={x,z,blocks:[],leaves:[],timer:0};
   for(let y=1;y<=4;y++){const m=box(x+.5,y+.5,z+.5,1,1,1,0x87613f);m.material=this.wings[0].materials[8];m.userData={key:'tree:'+x+','+y+','+z,type:8,tree};tree.blocks.push(m);this.meshes.push(m);}
   for(const [dx,dy,dz,w]of [[0,5,0,4],[-1,4,0,2],[1,4,0,2],[0,6,0,2.6]])tree.leaves.push(box(x+.5+dx,dy,z+.5+dz,w,1.7,w,dy===6?0x799957:0x456d42));
   this.trees.push(tree);
  }
  box(37,1.65,19,4,1.3,2,0x856846,true);sign('TIMBER / SELL AT THE EXCHANGE',35,3.3,20.1,7);
  // Warm lamps punctuate the service road and make each junction readable.
  for(const [x,z]of [[-12,13.6],[12,22],[3,-22.6],[-18,-22.6],[3,-59.6],[-18,-59.6],[18,-59.6],[-12,35],[12,35]]){
   box(x,3,z,.18,4,.18,0x314b3c,true);box(x,5.1,z,.7,.2,.7,0xf1cc8e,false,1);const l=new T.PointLight(0xffc88c,12,12,2);l.position.set(x,4.8,z);g.add(l);
  }
  sign('← C / GILDED FAULT      D / EMBER HOLLOW →',.5,4,-61,13);sign('← B / IRONWORKS',.5,4,-24,8);
  dressPrison(this,{box,mat,group:g,cube});
  this.staticBlockers=this.blockers.filter(b=>!this.wings.some(w=>w.blockers.includes(b)));
 }
 syncGates(state,instant=false){this.state=state;for(const g of this.gates){g.open=gateOpen(state,g.definition.index);if(instant)g.lift=g.open?5.8:0;g.light.material.color.setHex(g.open?0xa4d999:0xeabf7c);g.light.material.emissive.copy(g.light.material.color);}this.refreshBlockers();}
 refreshBlockers(){this.blockers=this.blockers.filter(b=>!b.isGate);for(const g of this.gates)if(g.lift<5.5){const b=g.bounds.clone();b.min.y+=g.lift;b.max.y+=g.lift;b.isGate=true;this.blockers.push(b);}}
 solid(x,y,z){const i=wingAt(x,z);if(i>=0){if(!gateOpen(this.state,i)&&y>=1)return true;const p=WINGS[i];return this.wings[i].solid(x-p.x,y,z-p.z);}if(x>=18&&z>=4&&z<=34&&prisonLevel(this.state)<2&&y>=1)return true;if(!onPath(x,z))return true;if(y<1)return true;return this.trees.some(t=>t.blocks.some(m=>Math.floor(x)===Math.floor(m.position.x)&&Math.floor(y)===Math.floor(m.position.y)&&Math.floor(z)===Math.floor(m.position.z)));}
 obstructed(ray,distance){return World.prototype.obstructed.call(this,ray,distance);}
 remove(mesh){if(mesh.userData.tree){const t=mesh.userData.tree;t.blocks.splice(t.blocks.indexOf(mesh),1);mesh.removeFromParent();if(!t.blocks.length){t.leaves.forEach(m=>m.visible=false);t.timer=35;}}else{const w=this.wings[mesh.userData.wing];const key=mesh.userData.key;mesh.userData.key=mesh.userData.localKey;w.remove(mesh);mesh.userData.key=key;}this.meshes.splice(this.meshes.indexOf(mesh),1);}
 area(position){return areaAt(position.x,position.z);}
 gateNear(position){return this.gates.find(g=>!g.open&&Math.hypot(position.x-g.definition.x,position.z-g.definition.z)<6);}
 update(dt,reduced=false,position=null){if(position){const area=this.area(position),L=area>=0&&area<4?LAYOUTS[area]:null,blend=1-Math.exp(-dt*2);this.scene.background.lerp(new T.Color(L?.sky??0x718782),blend);this.scene.fog.color.copy(this.scene.background);this.scene.fog.density+=((L?.fog??.009)-this.scene.fog.density)*blend;this.daylight.intensity+=((L?.intensity??1.8)-this.daylight.intensity)*blend;this.sun.intensity+=((area>0&&area<4?.8:2.3)-this.sun.intensity)*blend;}let moving=false;for(const g of this.gates){const target=g.open?5.8:0;if(Math.abs(g.lift-target)>.001){g.lift=Math.min(target,g.lift+dt*3.5);moving=true;}g.bars.position.y=g.lift;}if(moving)this.refreshBlockers();for(const w of this.wings)w.update(dt,reduced);updatePrisonDetail(this,dt,reduced);
  for(const t of this.trees)if(t.timer>0){t.timer-=dt;if(t.timer<=0&&position&&Math.hypot(position.x-t.x-.5,position.z-t.z-.5)<2){t.timer=1;}if(t.timer<=0){for(let y=1;y<=4;y++){const m=new T.Mesh(this.wings[0].geometry,this.wings[0].materials[8]);m.position.set(t.x+.5,y+.5,t.z+.5);m.userData={key:'tree:'+t.x+','+y+','+t.z,type:8,tree:t};this.environment.add(m);t.blocks.push(m);this.meshes.push(m);}t.leaves.forEach(m=>m.visible=true);}}
 }
 refill(index){const w=this.wings[index];this.meshes=this.meshes.filter(m=>m.userData.wing!==index);w.generate(index);this.buildRamp(w,index);w.environment.traverse(o=>{if(o.isHemisphereLight||o.isDirectionalLight)o.visible=false;});w.root.updateMatrixWorld(true);for(const b of w.blockers)b.translate(w.root.position);for(const m of w.meshes){m.userData.wing=index;m.userData.localKey=m.userData.key;m.userData.key=index+':'+m.userData.key;}this.meshes.push(...w.meshes);this.blockers=this.wings.flatMap(w=>w.blockers).concat(this.staticBlockers??[]);this.refreshBlockers();}
}

import {buildStrictPrison} from './strict-prison.js?v=79.1';
import {buildCampus,buildCampusTraining} from './campus.js?v=79.1';
import {intakeFloor,campusYard} from './intake-rules.js?v=79.1';
import {buildTrainingWings,updateTrainingGates} from './training-wings.js?v=79.1';
import {ATTACK_OFFSET,ARCHERY_OFFSET,TRAINING_WINGS,trainingFootprint,trainingWingAt,trainingPassageAt,trainingAccess} from './training-layout.js?v=79.1';
import {buildConservatory} from './conservatory.js?v=79.1';
import {FOREST_OFFSET,inConservatory,inServicePassage,inServiceFootprint,conservatoryFloor} from './conservatory-layout.js?v=79.1';
import {ArchitectureSurfaces} from '../engine/architecture-surfaces.js?v=79.1';
import {surfaceTexture} from '../engine/surface-textures.js?v=79.1';
import {batchScenery} from '../engine/static-batch.js?v=79.1';
import {buildTrainingRooms} from './training-rooms.js?v=79.1';
import {buildSkillRooms} from './skill-rooms.js?v=79.1';
import * as T from '../../vendor/three.module.js';
import {buildUnderblockEntry} from './underblock-entry.js?v=79.1';
import {entryFloor} from './underblock-entry-rules.js?v=79.1';
import {World,keyOf} from './world.js?v=79.1';
import {BLOCKS} from './rules.js?v=79.1';
import {MINE_STAGES,FOREST_STAGES,CAMP_SPAWN,WORK_OFFSET,TREE_LOGS,campLevel,inside,stairTop,mineOre} from './camp-rules.js?v=79.1';
export const TREE_SPOTS=[[7,-4],[10,-7],[7,-8],[13,-4],[13,-9],[5,-11],[16,-4],[16,-12],[10,-14],[4,-15]].map(([x,z])=>[x+FOREST_OFFSET.x,z+WORK_OFFSET+FOREST_OFFSET.z]);
import {buildWorkyardCharacter,dressForestPlot} from './workyard-character.js?v=79.1';
import {buildYardCharacter,dressMineEntrance} from './yard-character.js?v=79.1';
import {buildIronEmber} from './iron-ember.js?v=79.1';
import {buildCell,insideCell} from './cell.js?v=79.1';
export class CampWorld{
 constructor(scene,{campus=false}={}){this.campus=campus;
  this.architecture=new ArchitectureSurfaces();this.scene=scene;this.layout={spawn:CAMP_SPAWN};this.geometry=new T.BoxGeometry(1,1,1);this.materials=BLOCKS.map((b,i)=>new T.MeshStandardMaterial({map:World.prototype.texture.call(this,i),color:0xffffff,roughness:1}));this.paint=new Map();this.blocks=new Map();this.meshes=[];this.trees=[];this.excavated=new Set();this.blockers=[];this.mineLevel=-1;this.forestLevel=-1;this.level=1;this.time=0;this.refillIn=-1;this.elapsed=0;
  this.timberEnd=new T.MeshStandardMaterial({map:surfaceTexture('endgrain'),roughness:1});this.timberSides=[this.materials[8],this.timberEnd];this.timberGeometry=this.geometry.clone();const timberIndex=[...this.geometry.index.array];this.timberGeometry.setIndex([0,1,4,5,2,3].flatMap(face=>timberIndex.slice(face*6,face*6+6)));this.timberGeometry.clearGroups();this.timberGeometry.addGroup(0,24,0);this.timberGeometry.addGroup(24,12,1);this.leafMap=surfaceTexture('leaf');this.mineRoot=new T.Group();this.floorRoot=new T.Group();this.fenceRoot=new T.Group();this.forestRoot=new T.Group();this.mineDress=new T.Group();scene.add(this.mineRoot,this.floorRoot,this.fenceRoot,this.forestRoot,this.mineDress);
  scene.background=new T.Color(0x7f9690);scene.fog=new T.FogExp2(0x7f9690,.013);
  if(campus==='strict'){buildStrictPrison(this);}else if(campus){buildCampus(this);buildCell(this);buildUnderblockEntry(this);buildConservatory(this);buildTrainingWings(this);buildCampusTraining(this);this.gate=new T.Group();this.gate.position.set(8,0,-5.3);this.scene.add(this.gate);for(let x=-2;x<=2;x+=.5){const m=new T.Mesh(this.geometry,this.mat(0x303238));m.position.set(x,3,0);m.scale.set(.1,4,.16);this.gate.add(m);}this.gateLift=0;this.motes=new T.InstancedMesh(new T.BoxGeometry(.023,.023,.023),new T.MeshBasicMaterial({color:0xf3dab0,transparent:true,opacity:.4}),32);this.scene.add(this.motes);this.matrix=new T.Matrix4();}else{this.build();buildCell(this);buildYardCharacter(this);buildWorkyardCharacter(this);buildUnderblockEntry(this);buildSkillRooms(this);buildTrainingRooms(this);buildConservatory(this);buildTrainingWings(this);buildIronEmber(this);}this.architecture.decorate(scene,this.geometry);this.renderStats=batchScenery(scene,this.geometry,[this.gate,...(this.intakeGates??[]).map(g=>g.bars),this.issuedPick,...this.trainingGates.map(g=>g.bars),this.mineRoot,this.floorRoot,this.fenceRoot,this.forestRoot,this.mineDress]);this.staticBlockers=[...this.blockers];
 }
 mat(color,glow=0){color=({0x344b3b:0x303238,0x647469:0x4c4d52,0x65716a:0x535156,0x46554a:0x34363b,0x435e4c:0x41434a,0x9a9f86:0x737277,0xafa992:0x7c7976,0x8b967d:0x5b5d64,0x3f5541:0x35373d,0x8d957b:0x5f5d5b,0x4c6248:0x48423b,0x425b40:0x36383d,0x496b5c:0x914731})[color]??color;const key=color+':'+glow;if(!this.paint.has(key))this.paint.set(key,this.architecture.material(new T.MeshStandardMaterial({color,roughness:.93,emissive:glow?color:0,emissiveIntensity:glow})));return this.paint.get(key);}
 box(x,y,z,w,h,d,color,solid=false,group=this.scene){const m=new T.Mesh(this.geometry,this.mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);group.add(m);if(solid)this.blockers.push(new T.Box3().setFromObject(m));return m;}
 sign(lines,x,y,z,w=6,h=1.4,angle=0,group=this.scene,color='#efb55e'){
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#292a2f';ctx.fillRect(0,0,1024,256);ctx.fillStyle=color;ctx.fillRect(0,0,12,256);
  lines.forEach((line,i)=>{let size=lines.length===1?170:i===0?76:43;ctx.font='bold '+size+'px monospace';while(ctx.measureText(line).width>940&&size>12){size-=2;ctx.font='bold '+size+'px monospace';}ctx.fillStyle=i===0?color:'#c9bca4';ctx.fillText(line,lines.length===1?(1024-ctx.measureText(line).width)/2:40,lines.length===1?180:105+i*100);});
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}));m.position.set(x,y,z);m.rotation.y=angle;group.add(m);return m;
 }
 build(){
  let offset={x:0,z:0};const box=(x,y,z,...args)=>this.box(x+offset.x,y,z+offset.z,...args),metal=0x303238,stone=0x4c4d52;
  this.floorMat=new T.MeshStandardMaterial({map:surfaceTexture('paving'),roughness:.96});

  this.skyLight=new T.HemisphereLight(0xdce1ef,0x57504a,2.2);this.scene.add(this.skyLight);const sun=new T.DirectionalLight(0xffe2b1,2.4);this.sun=sun;sun.position.set(-12,25,8);this.scene.add(sun);
  for(const x of [-20,20]){if(x<0)box(x,4,-9.25,1,8,29.5,stone,true);else{box(x,4,-18,1,8,12,stone,true);box(x,4,-1.25,1,8,13.5,stone,true);box(x,7,-10,1,2,4,stone,true);}box(x,4,13.25,1,8,5.5,stone,true);box(x,8.2,-4,1.7,.35,41,0x9a9f86);for(const y of [8.6,9.4])box(x+(x<0?.8:-.8),y,-4,.1,.1,41,metal);for(let z=-23;z<=15;z+=3)box(x+(x<0?.8:-.8),9,z,.1,1,.1,metal);}
  for(const side of [-1,1]){offset=side>0?ARCHERY_OFFSET:{x:0,z:0};if(side>0)box(side*29.5,.5,9,19,1,12,0x77816a);box(side*39,4,9,1,8,13,stone,true);for(const z of [3,15])box(side*29.5,4,z,20,8,1,stone,true);box(side*29.5,6.5,9,19,.3,12,0x465c49);for(const z of [5.5,10.5])box(side*20,3.5,z,.6,5,.3,metal,true);if(side<0)this.sign(['05 / THE UNDERBLOCK','CONDEMNED SERVICE STAIRS'],-19.4,5.2,8,5.2,1.4,Math.PI/2);}
  offset={x:0,z:0};
  box(0,4,-24,41,8,1,stone,true);
  box(-11.5,4,16,18,8,1,stone,true);box(6.6,4,16,8.2,8,1,stone,true);box(17.85,4,16,5.3,8,1,stone,true);
  offset=ATTACK_OFFSET;for(const x of [-9,9])box(x,4,23.5,1,8,16,stone,true);box(0,4,31,19,8,1,stone,true);
  box(0,.5,23.5,18,1,15,0x746a57);offset={x:0,z:0};
  for(const x of [-2.8,2.8])box(x,3.7,16,.35,5.4,.6,metal,true);box(0,6.5,16,6,.4,1,metal);
  

  
  offset=ATTACK_OFFSET;for(const x of [-7,7]){box(x,1.35,21,1.5,.7,1.5,0x4b5140,true);box(x,3.8,28,.18,5.6,.18,metal);const light=new T.PointLight(0xf3ad69,28,17);light.position.set(x+offset.x,5.9,28+offset.z);this.scene.add(light);const bulb=box(x,6,28,.8,.25,.8,0xe4b16e);bulb.material=this.mat(0xe4b16e,.7);bulb.userData.prisonBulb=true;}
  offset={x:0,z:0};for(const x of [-17,-13,-9,9,13,17]){box(x,4.8,-23.43,2,2,.08,0x1e362d);for(let dx=-.8;dx<=.81;dx+=.4)box(x+dx,4.8,-23.34,.08,2,.12,0x9aa18b);}
  for(const x of [-14,-10,10]){box(x,3.5,15.44,2,3.7,.1,0x1b3028);for(let dx=-.8;dx<=.81;dx+=.4)box(x+dx,3.5,15.35,.08,3.8,.12,0x8d9980);}
  this.sign(['VOXEL / BLOCK 07','YOUR PLOTS. YOUR PROGRESS.'],-11,6.5,15.25,10,2,Math.PI);
  this.sign(['WORK YARD / 07','DEEPWELL  ←     CELLS / EXCHANGE  ↓'],.5,6,-23.3,11,2);
  for(const x of [-18,18]){box(x,6,-22,2.2,12,2.2,0x435e4c);box(x,12.2,-22,4,.4,4,0xafa992);box(x,13.2,-22,2.4,1.7,2.4,metal);box(x,14.2,-22,4,.3,4,0x8b967d);}
  for(const [x,label,color]of [[-10,'WORKERS’ EXCHANGE',0xd8b67b],[8.7,'THE TOOL BENCH',0xd4b67c]]){
   box(x,1.8,10,5,1.6,2.5,metal,true);box(x,5.4,10,6,.22,3.5,0x927c57);for(const dx of [-2.7,2.7])box(x+dx,3.1,10,.15,4.2,.15,0x856746,true);
   this.sign([label,'E / SELL · TOOLS · EXPANSIONS'],x,3.35,11.4,5,1.15);box(x,2.64,10,2,.1,.9,color);
  }
  box(10,2.9,10,.65,.45,.45,0x65786c);box(10,3.17,10,1.1,.15,.55,0xb7c5b5);
  for(const x of [17]){for(const z of [6,12]){box(x,1.5,z,3,.2,.9,0x98784c,true);for(const dx of [-1,1])box(x+dx,1.25,z,.15,.5,.6,metal);box(x,2,z+.3,3,.15,.15,0x98784c);}box(x,4,9,.16,6,.16,metal);const m=box(x,7,9,.8,.2,.8,0xffd295);m.material=this.mat(0xffd295,.7);m.userData.prisonBulb=true;const light=new T.PointLight(0xffd199,28,20);light.position.set(x,6.7,9);this.scene.add(light);}
  for(const x of [-18,18]){const lamp=new T.PointLight(0xffd39a,85,30);lamp.position.set(x,11.7,-21);this.scene.add(lamp);const bulb=box(x,11.9,-20.7,1,.25,.55,0xffd39a);bulb.material=this.mat(0xffd39a,.7);bulb.userData.prisonBulb=true;}
  // Color-coded routes are only a few seconds long.
  box(-4.8,1.015,1,.13,.02,13,0xdd8d39);box(-7,1.015,-2.5,4.5,.02,.13,0xdd8d39);box(4.8,1.015,1,.13,.02,13,0x98ac85);box(6.6,1.015,-2.5,3.5,.02,.13,0x98ac85);
  for(const [x,words]of [[-10,'01 / THE DEEPWELL']]){for(const dx of [-3.3,3.3])box(x+dx,3,-5,.25,4,.25,metal);if(x!==-10)box(x,5.2,-5,7,.3,.5,0x8d957b);this.sign(['CENTRAL YARD','EXCHANGE / FORGE'],x,4.3,-5.3,6,1.2,Math.PI);}
  
  this.gate=new T.Group();this.gate.position.set(8,0,-5.3);this.scene.add(this.gate);for(let x=-2;x<=2;x+=.5){const m=new T.Mesh(this.geometry,this.mat(metal));m.scale.set(.10,3.8,.16);m.position.set(x,2.9,0);this.gate.add(m);}for(const y of [1.1,3,4.8]){const m=new T.Mesh(this.geometry,this.mat(0xc3ab76));m.position.y=y;m.scale.set(4.2,.12,.2);this.gate.add(m);}this.gateLift=0;

  this.motes=new T.InstancedMesh(new T.BoxGeometry(.023,.023,.023),new T.MeshBasicMaterial({color:0xf3dab0,transparent:true,opacity:.4}),32);this.scene.add(this.motes);this.matrix=new T.Matrix4();
 }
 configure(state,instant=false){
  this.state=state;const mineChanged=this.mineLevel!==state.mineLevel,forestChanged=this.forestLevel!==state.forestLevel;
  if(mineChanged){this.mineLevel=state.mineLevel;this.generateMine(true);this.buildFloor();}
  if(forestChanged){this.forestLevel=state.forestLevel;this.growForest();dressForestPlot(this);}
  this.level=campLevel(state);this.syncTrainingAccess(this.huntProgress,instant);if(instant)this.gateLift=this.level>=2?4:0;
  if(mineChanged||forestChanged)this.buildFences();this.refreshBlockers();
 }
 buildFloor(){this.floorRoot.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.floorRoot.clear();const s=MINE_STAGES[this.mineLevel],cells=[];for(let x=-20;x<20;x++)for(let z=-24;z<16;z++)if(!inside(x+.5,z+.5,s.bounds))cells.push([x,z]);const floor=new T.InstancedMesh(this.geometry,this.floorMat,cells.length),matrix=new T.Matrix4();cells.forEach(([x,z],i)=>{matrix.makeTranslation(x+.5,.5,z+.5);floor.setMatrixAt(i,matrix);floor.setColorAt(i,new T.Color(x>2&&z<0?0x929579:0xd4cdc7));});floor.receiveShadow=true;this.floorRoot.add(floor);}
 generateMine(preserve=false){
  if(!preserve){this.excavated.clear();this.elapsed=0;this.refillIn=-1;}
  this.mineRoot.traverse(o=>{if(o.isInstancedMesh)o.dispose();});this.mineRoot.clear();this.blocks.clear();const s=MINE_STAGES[this.mineLevel],[x0,x1,z0,z1]=s.bounds;
  this.meshes=this.meshes.filter(m=>m.userData.tree);
  for(let x=x0;x<x1;x++)for(let z=z0;z<z1;z++)for(let y=s.bottom;y<=0;y++){
   if(stairTop(this.mineLevel,x+.5,z+.5)!==null||this.excavated.has(keyOf(x,y,z)))continue;
   const h=Math.abs(Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453)%1,type=mineOre(this.mineLevel,h),m=new T.Mesh(this.geometry,this.materials[type]);m.position.set(x+.5,y+.5,z+.5);m.userData={key:keyOf(x,y,z),x,y,z,type};this.blocks.set(m.userData.key,m);this.meshes.push(m);m.updateMatrixWorld();
  }
  for(const m of this.blocks.values()){const {x,y,z}=m.userData;m.userData.exposure=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].filter(([dx,dy,dz])=>!this.blocks.has(keyOf(x+dx,y+dy,z+dz))).length;m.visible=m.userData.exposure>0;}
  // Separate collision/raycast proxies from the instanced render geometry.
  const byType=new Map();for(const m of this.blocks.values()){const type=m.userData.type;if(!byType.has(type))byType.set(type,[]);byType.get(type).push(m);}
  this.mineBatches=[];for(const [type,blocks]of byType){const batch=new T.InstancedMesh(this.geometry,this.materials[type],blocks.length);batch.name='Ore seam / '+type;batch.receiveShadow=true;this.mineRoot.add(batch);this.mineBatches.push(batch);blocks.forEach((m,index)=>{m.userData.instance={batch,index};this.updateMineVisual(m);});batch.computeBoundingSphere();}
  const n=(1-s.bottom)*2;for(let k=0;k<n;k++){const h=(k+1)*.5;this.box(-10,s.bottom+h/2,-n+k+.5+WORK_OFFSET,2,h,1,0x84917a,false,this.mineRoot);}
  this.box((x0+x1)/2,s.bottom-.5,(z0+z1)/2,x1-x0,1,z1-z0,0x3e5145,false,this.mineRoot);
  this.mineDress.clear();for(const x of [x0-.5,x1+.5])for(let z=z0+1;z<WORK_OFFSET;z+=4){this.box(x,2.8,z,.32,3.6,.32,0x826b4b,false,this.mineDress);if(this.mineLevel>0){const lamp=this.box(x,4.7,z,.55,.2,.55,0xe7c88b,false,this.mineDress);lamp.material=this.mat(0xe7c88b,.6);}}
  if(!this.campus)dressMineEntrance(this);
  if(this.mineLevel===2){this.box(-10,5,-21.5,14,.3,.4,0x92794f,false,this.mineDress);this.sign(['DEEPWELL WORKS','EVERY BLOCK TAKES YOU FURTHER'],-10,4,-21.2,8,1.5,0,this.mineDress);}
  if(this.campus==='strict'){const cy=(s.bottom+1)/2,h=1-s.bottom;for(const x of [x0-.1,x1+.1])this.box(x,cy,(z0+z1)/2,.2,h,z1-z0+.4,0x44454a,false,this.mineRoot);for(const z of [z0-.1,z1+.1])this.box((x0+x1)/2,cy,z,x1-x0,h,.2,0x44454a,false,this.mineRoot);}
  this.totalBlocks=this.blocks.size+this.excavated.size;
 }
 updateMineVisual(mesh,removed=false){const slot=mesh.userData.instance;if(!slot)return;this.oreMatrix??=new T.Matrix4();if(removed||!mesh.visible)this.oreMatrix.makeScale(0,0,0);else this.oreMatrix.makeTranslation(mesh.position.x,mesh.position.y,mesh.position.z);slot.batch.setMatrixAt(slot.index,this.oreMatrix);slot.batch.instanceMatrix.needsUpdate=true;}
 buildFences(){
  // Reuse fence segments and animate their positions/lengths when plots expand.
  const targets=[];for(const [kind,b]of [['mine',MINE_STAGES[this.mineLevel].bounds],['forest',FOREST_STAGES[this.forestLevel].bounds]]){const [a,bx,c,d]=b;targets.push({key:kind+'left',x:a-.25,z:(c+d)/2,w:.12,d:d-c+.5},{key:kind+'right',x:bx+.25,z:(c+d)/2,w:.12,d:d-c+.5},{key:kind+'back',x:(a+bx)/2,z:c-.25,w:bx-a+.5,d:.12});}
  this.fences??=new Map();for(const t of targets){let f=this.fences.get(t.key);if(!f){const group=new T.Group();for(const y of [1.25,2.7]){const m=new T.Mesh(this.geometry,this.mat(0x4c6248));m.position.y=y;m.scale.set(1,.12,1);group.add(m);}for(let n=-.5;n<=.5;n+=.1){const m=new T.Mesh(this.geometry,this.mat(0x425b40));m.position.set(t.w<1?0:n,1.95,t.w<1?n:0);m.scale.set(t.w<1?1:.009,1.6,t.w<1?.009:1);group.add(m);}group.position.set(t.x,0,t.z);group.scale.set(t.w,1,t.d);this.fenceRoot.add(group);f={group,...t};this.fences.set(t.key,f);}Object.assign(f,t);}
 }
 growForest(){const s=FOREST_STAGES[this.forestLevel];while(this.trees.length>s.trees){const removed=this.trees.pop();this.meshes=this.meshes.filter(m=>m.userData.tree!==removed);removed.visual.removeFromParent();}for(let i=this.trees.length;i<s.trees;i++){const [x,z]=TREE_SPOTS[i];const tree={id:i,x,z,status:'ready',timer:0,visual:new T.Group(),targets:[]};tree.visual.position.set(x,1,z);this.forestRoot.add(tree.visual);this.trees.push(tree);this.makeTree(tree);}this.refreshBlockers();}
 makeTree(t){this.meshes=this.meshes.filter(m=>m.userData.tree!==t);t.hit=0;t.visual.position.y=1;t.visual.clear();t.visual.rotation.set(0,0,0);t.visual.scale.setScalar(1);t.visual.visible=true;t.status='ready';t.targets=[];t.cuts=0;
  for(let y=0;y<TREE_LOGS;y++){const m=new T.Mesh(this.timberGeometry,this.timberSides);m.position.set(0,y+.5,0);m.userData={key:'tree:'+t.id+':'+y,type:8,tree:t};t.visual.add(m);t.targets.push(m);this.meshes.push(m);}
  const leaf=this.mat(t.id%3===0?0x648b48:t.id%3===1?0x79974e:0x4f7843);leaf.map=this.leafMap;leaf.needsUpdate=true;for(const [y,w]of [[3.3,3],[4.3,2.4],[5.1,1.4]]){const m=new T.Mesh(this.geometry,leaf);m.scale.set(w,1.3,w);m.position.y=y;m.userData.canopy=true;t.visual.add(m);}
 }
 syncTrainingAccess(hunt={},instant=false){this.huntProgress=hunt;for(const g of this.trainingGates??[]){g.open=trainingAccess(this.state??{mined:0},hunt,g.wing);if(instant)g.lift=g.open?5.4:0;}this.refreshBlockers();}
 setIntake(stage){this.intakeStage=stage;if(this.issuedPick)this.issuedPick.visible=stage<2;for(const g of this.intakeGates??[])g.bars.position.y=stage>=g.stage?5.5:0;this.refreshBlockers();}
 refreshBlockers(){this.blockers=[...(this.staticBlockers??[])];for(const g of this.intakeGates??[])if((this.intakeStage??0)<g.stage)this.blockers.push(g.bounds);for(const g of this.trainingGates??[])if(g.lift<5.1){const b=g.bounds.clone();b.min.y+=g.lift;b.max.y+=g.lift;this.blockers.push(b);}if(this.level<2)this.blockers.push(new T.Box3(new T.Vector3(5.7,1,-5.65),new T.Vector3(10.3,5.5,-5)));}
 solid(x,y,z){
  if(this.dungeon&&x>45)return this.dungeon.solid(x,y,z);
  if(insideCell(x,z))return y<1;
  if(this.campus&&intakeFloor(x,z))return y<1;
  if(this.campus&&campusYard(x,z)&&!trainingPassageAt({x,z}))return y<1;
  if(trainingFootprint(x,z)){const w=trainingWingAt({x,z})??trainingPassageAt({x,z});return !w||!trainingAccess(this.state??{mined:0},this.huntProgress,w)||y<1;}
  if(inServiceFootprint(x,z)){if(this.level<2||!conservatoryFloor(x,z))return true;const forest=FOREST_STAGES[this.forestLevel??0];if(inside(x,z,FOREST_STAGES[2].bounds)&&!inside(x,z,forest.bounds))return true;if(y<1)return true;return this.trees.some(t=>t.status==='ready'&&Math.abs(x-t.x)<.5&&Math.abs(z-t.z)<.5&&t.targets.some(m=>Math.abs(y-(1+m.position.y))<.5));}
  if(Math.abs(x)>19.5){if(Math.abs(x)>38.5||z<3.5||z>14.5)return true;return y<(x<0?entryFloor(x,z):1);}
  if(insideCell(x,z))return y<1;
  if(z< -23.5||z>30.5)return true;
  if(z>15.5){if(Math.abs(x)>8.5)return true;return y<1;}
  const mine=MINE_STAGES[this.mineLevel??0],forest=FOREST_STAGES[this.forestLevel??0];if(!mine||!forest)return y<1;
  if(inside(x,z,MINE_STAGES[2].bounds)&&!inside(x,z,mine.bounds))return true;
  if(inside(x,z,FOREST_STAGES[2].bounds)&&(!inside(x,z,forest.bounds)||this.level<2))return true;
  if(inside(x,z,mine.bounds)){const top=stairTop(this.mineLevel,x,z);if(top!==null)return y<top;if(y<mine.bottom)return true;return this.blocks.has(keyOf(Math.floor(x),Math.floor(y),Math.floor(z)));}
  if(y<1)return true;
  return this.trees.some(t=>t.status==='ready'&&Math.abs(x-t.x)<.5&&Math.abs(z-t.z)<.5&&t.targets.some(m=>Math.abs(y-(1+m.position.y))<.5));
 }
 area(p){if(this.campus&&intakeFloor(p.x,p.z))return 12;const training=trainingWingAt(p),passage=trainingPassageAt(p);if(training&&trainingAccess(this.state,this.huntProgress,training))return training.area;if(passage&&trainingAccess(this.state,this.huntProgress,passage))return passage.passage;if(inside(p.x,p.z,MINE_STAGES[this.mineLevel].bounds))return 0;if(inConservatory(p)&&this.level>=2)return 4;if(inServicePassage(p)&&this.level>=2)return 9;return -1;}
 obstructed(ray,distance){if(this.dungeon&&ray.origin.x>45)return this.dungeon.blocked(ray,distance);return World.prototype.obstructed.call(this,ray,distance);}
 remove(mesh){
  if(mesh.userData.tree){
   const t=mesh.userData.tree;if(t.status!=='ready'||!t.targets.includes(mesh))return false;
   t.cuts++;mesh.removeFromParent();t.targets=t.targets.filter(m=>m!==mesh);this.meshes=this.meshes.filter(m=>m!==mesh);
   if(t.targets.length)return false;
   t.status='falling';t.fall=0;t.timer=FOREST_STAGES[this.forestLevel].regrow;return true;
  }
  const {key,x,y,z}=mesh.userData;this.excavated.add(key);this.blocks.delete(key);this.updateMineVisual(mesh,true);mesh.removeFromParent();this.meshes.splice(this.meshes.indexOf(mesh),1);for(const [dx,dy,dz]of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const m=this.blocks.get(keyOf(x+dx,y+dy,z+dz));if(m){m.visible=true;m.userData.exposure=(m.userData.exposure??0)+1;this.updateMineVisual(m);}}
 }
 refill(){this.generateMine(false);}
 update(dt,reduced=false,position=null){
  updateTrainingGates(this,dt);this.time+=reduced?0:dt;this.elapsed+=dt;this.gateLift+=(((this.level>=2?4:0)-this.gateLift))*Math.min(1,dt*3);this.gate.position.y=this.gateLift;
  for(const f of this.fences?.values()??[]){const blend=1-Math.exp(-dt*3);f.group.position.x+=(f.x-f.group.position.x)*blend;f.group.position.z+=(f.z-f.group.position.z)*blend;f.group.scale.x+=(f.w-f.group.scale.x)*blend;f.group.scale.z+=(f.d-f.group.scale.z)*blend;}
  for(const t of this.trees){if(t.status==='ready'){t.hit=Math.max(0,(t.hit??0)-dt);for(const leaf of t.visual.children)if(leaf.userData.canopy)leaf.rotation.z=reduced?0:Math.sin(t.hit*45)*t.hit*.08;continue;}if(t.status==='falling'){t.fall+=dt;if(!reduced){t.visual.scale.setScalar(Math.max(.01,1-Math.max(0,t.fall-.10)*3.6));t.visual.position.y=1-Math.min(.35,t.fall*.6);}if(t.fall>.42){t.status='regrowing';t.visual.clear();t.visual.position.y=1;t.visual.rotation.z=0;t.visual.scale.setScalar(1);const stem=new T.Mesh(this.geometry,this.mat(0x795e40));stem.scale.set(.15,.8,.15);stem.position.y=.4;t.visual.add(stem);const sprout=new T.Mesh(this.geometry,this.mat(0x709454));sprout.scale.set(.9,.7,.9);sprout.position.y=.9;t.visual.add(sprout);}}
   else{t.timer-=dt;t.visual.scale.setScalar(.35+.65*(1-t.timer/FOREST_STAGES[this.forestLevel].regrow));if(t.timer<=0){if(position&&Math.hypot(position.x-t.x,position.z-t.z)<1.8)t.timer=1;else this.makeTree(t);}}
  }
  if(this.refillIn<0&&this.excavated.size>0&&(this.blocks.size<this.totalBlocks*.25||this.elapsed>150))this.refillIn=5;
  else if(this.refillIn>=0){this.refillIn-=dt;if(this.refillIn<=0){this.refill();this.refillEvent=true;}}
  for(let i=0;i<32;i++){this.matrix.makeTranslation(Math.sin(i*73)*18,2+(i*1.7)%5+Math.sin(this.time*.3+i)*.1,-15+(i*3.7)%29);this.motes.setMatrixAt(i,this.matrix);}this.motes.instanceMatrix.needsUpdate=true;
 }
}

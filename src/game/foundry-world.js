import * as T from '../../vendor/three.module.js';
import {CampWorld} from './camp.js?v=81.3';
import {keyOf} from './world.js?v=81.3';
import {mineOre,campLevel} from './camp-rules.js?v=81.3';
import {PRISON_SPAWN,CAMPUS_FLOORS,PIT,inBox,terraceFloor} from './foundry-layout.js?v=81.3';
export class FoundryWorld extends CampWorld{
 constructor(scene){super(scene,{campus:'foundry'});this.layout.spawn=PRISON_SPAWN;}
 configure(state){this.state=state;this.level=campLevel(state);this.forestLevel=state.forestLevel; if(this.mineLevel!==state.mineLevel){this.mineLevel=state.mineLevel;this.generateMine(true);}this.refreshBlockers();}
 syncTrainingAccess(hunt={}){this.huntProgress=hunt;}
 setIntake(stage){this.intakeStage=stage;this.issuedPick.visible=stage<3;for(const g of this.intakeGates)g.bars.position.y=stage>=g.stage?6:0;this.refreshBlockers();}
 refreshBlockers(){this.blockers=[...(this.staticBlockers??[])];for(const g of this.intakeGates??[])if((this.intakeStage??0)<g.stage)this.blockers.push(g.bounds);}
 solid(x,y,z){if(inBox(x,z,PIT)){if(y<terraceFloor(x,z))return true;return this.blocks.has(keyOf(Math.floor(x),Math.floor(y),Math.floor(z)));}return !CAMPUS_FLOORS.some(b=>inBox(x,z,b))||y<1;}
 stepHeight(x,z){return Math.max(...[-.28,.28].flatMap(dx=>[-.28,.28].map(dz=>inBox(x+dx,z+dz,PIT)?terraceFloor(x+dx,z+dz):1)));}
 area(p){if(p.z>=37)return 12;if(p.x< -16&&p.z>=4)return 13;if(p.x< -12&&p.z< -8)return 0;return -1;}
 generateMine(preserve=false){if(!preserve){this.excavated.clear();this.elapsed=0;this.refillIn=-1;}for(const o of this.mineRoot.children)if(o.isInstancedMesh)o.dispose();this.mineRoot.clear();this.meshes=[];this.blocks.clear();const groups=new Map();
 // Working faces on the upper, middle and lower benches. Permanent ramps remain unmineable.
 const seams=[[-25,-21,-20,-13],...this.mineLevel>=1?[[-36,-29,-23,-17]]:[],...this.mineLevel>=2?[[-35,-27,-27,-23]]:[]];
 for(const [a,b,c,d]of seams)for(let x=a;x<b;x++)for(let z=c;z<d;z++){const floor=terraceFloor(x+.5,z+.5);for(let y=Math.ceil(floor);y<floor+3;y++){const key=keyOf(x,y,z);if(this.excavated.has(key))continue;const hash=Math.abs(Math.sin(x*127+y*311+z*74)*43758)%1,type=mineOre(this.mineLevel,hash),m=new T.Mesh(this.geometry,this.materials[type]);m.position.set(x+.5,y+.5,z+.5);m.userData={key,x,y,z,type,exposure:1};this.blocks.set(key,m);this.meshes.push(m);if(!groups.has(type))groups.set(type,[]);groups.get(type).push(m);m.updateMatrixWorld();}}
 for(const [type,blocks]of groups){const batch=new T.InstancedMesh(this.geometry,this.materials[type],blocks.length);batch.receiveShadow=true;this.mineRoot.add(batch);blocks.forEach((m,index)=>{m.userData.instance={batch,index};this.updateMineVisual(m);});batch.computeBoundingSphere();}this.totalBlocks=this.blocks.size+this.excavated.size;}
 update(dt,reduced=false){this.time+=dt;this.elapsed+=dt;if(this.refillIn<0&&this.excavated.size>0&&(this.blocks.size<this.totalBlocks*.25||this.elapsed>150))this.refillIn=5;else if(this.refillIn>=0){this.refillIn-=dt;if(this.refillIn<=0){this.refill();this.refillEvent=true;}}}
}

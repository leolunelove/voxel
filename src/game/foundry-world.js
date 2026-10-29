import {TIMBER_FLOORS,TIMBER_PLOTS,TIMBER_SPOTS,timberInside,timberPlot,timberAllocated} from './foundry-timber-layout.js?v=82.3';
import {FOREST_STAGES} from './camp-rules.js?v=82.3';
import * as T from '../../vendor/three.module.js';
import {CampWorld} from './camp.js?v=82.3';
import {keyOf} from './world.js?v=82.3';
import {mineOre,campLevel} from './camp-rules.js?v=82.3';
import {PRISON_SPAWN,CAMPUS_FLOORS,PIT,inBox,terraceFloor} from './foundry-layout.js?v=82.3';
export class FoundryWorld extends CampWorld{
 constructor(scene){super(scene,{campus:'foundry'});this.layout.spawn=PRISON_SPAWN;}
 configure(state){const forestChanged=this.forestLevel!==state.forestLevel||this.level!==campLevel(state);this.state=state;this.level=campLevel(state);this.forestLevel=state.forestLevel; if(this.mineLevel!==state.mineLevel){this.mineLevel=state.mineLevel;this.generateMine(true);}if(forestChanged)this.growForest();this.forestRoot.visible=this.level>=2;this.refreshBlockers();}
 syncTrainingAccess(hunt={}){this.huntProgress=hunt;}
 setIntake(stage){this.intakeStage=stage;this.issuedPick.visible=stage<3;for(const g of this.intakeGates)g.target=stage>=g.stage?6:0;this.refreshBlockers();}
 refreshBlockers(){this.blockers=[...(this.staticBlockers??[])];if(this.level<2||(this.gateLift??0)<3.8)this.blockers.push(new T.Box3(new T.Vector3(17.7,1,8),new T.Vector3(18.3,5.5,12)));for(const g of this.intakeGates??[])if((this.intakeStage??0)<g.stage||g.bars.position.y<5.2)this.blockers.push(g.bounds);}
 solid(x,y,z){if(inBox(x,z,PIT)){if(y<terraceFloor(x,z))return true;return this.blocks.has(keyOf(Math.floor(x),Math.floor(y),Math.floor(z)));}if(timberInside({x,z})){if(this.level<2)return true;if(timberPlot({x,z})&&!timberAllocated({x,z},this.forestLevel))return true;if(y<1)return true;return this.trees.some(t=>t.status==='ready'&&Math.abs(x-t.x)<.5&&Math.abs(z-t.z)<.5&&t.targets.some(m=>Math.abs(y-(1+m.position.y))<.5));}return !CAMPUS_FLOORS.some(b=>inBox(x,z,b))||y<1;}
 stepHeight(x,z){return Math.max(...[-.28,.28].flatMap(dx=>[-.28,.28].map(dz=>inBox(x+dx,z+dz,PIT)?terraceFloor(x+dx,z+dz):1)));}
 area(p){if(this.level>=2&&timberInside(p))return timberPlot(p)?4:9;if(p.z>=37)return 12;if(p.x< -16&&p.z>=4)return 13;if(p.x< -12&&p.z< -8)return 0;return -1;}
 generateMine(preserve=false){if(!preserve){this.excavated.clear();this.elapsed=0;this.refillIn=-1;}for(const o of this.mineRoot.children)if(o.isInstancedMesh)o.dispose();this.mineRoot.clear();this.meshes=this.meshes.filter(m=>m.userData.tree);this.blocks.clear();const groups=new Map();
 // Working faces on the upper, middle and lower benches. Permanent ramps remain unmineable.
 const seams=[[-25,-21,-20,-13],...this.mineLevel>=1?[[-36,-29,-23,-17]]:[],...this.mineLevel>=2?[[-35,-27,-27,-23]]:[]];
 for(const [a,b,c,d]of seams)for(let x=a;x<b;x++)for(let z=c;z<d;z++){const floor=terraceFloor(x+.5,z+.5);for(let y=Math.ceil(floor);y<floor+3;y++){const key=keyOf(x,y,z);if(this.excavated.has(key))continue;const hash=Math.abs(Math.sin(x*127+y*311+z*74)*43758)%1,type=mineOre(this.mineLevel,hash),m=new T.Mesh(this.geometry,this.materials[type]);m.position.set(x+.5,y+.5,z+.5);m.userData={key,x,y,z,type,exposure:1};this.blocks.set(key,m);this.meshes.push(m);if(!groups.has(type))groups.set(type,[]);groups.get(type).push(m);m.updateMatrixWorld();}}
 for(const [type,blocks]of groups){const batch=new T.InstancedMesh(this.geometry,this.materials[type],blocks.length);batch.receiveShadow=true;this.mineRoot.add(batch);blocks.forEach((m,index)=>{m.userData.instance={batch,index};this.updateMineVisual(m);});batch.computeBoundingSphere();}this.totalBlocks=this.blocks.size+this.excavated.size;}
 growForest(){if(this.level<2)return;const count=FOREST_STAGES[this.forestLevel].trees;while(this.trees.length<count){const i=this.trees.length,[x,z]=TIMBER_SPOTS[i],tree={id:i,x,z,status:'ready',timer:0,visual:new T.Group(),targets:[]};tree.visual.position.set(x,1,z);this.forestRoot.add(tree.visual);this.trees.push(tree);this.makeTree(tree);}this.fenceRoot.clear();const [a,b,c,d]=TIMBER_PLOTS[this.forestLevel];for(const [x,z,w,l]of [[b+.1,(c+d)/2,.14,d-c],[ (a+b)/2,c-.1,b-a,.14]]){for(const y of [1.3,2.7])this.box(x,y,z,w,.12,l,0x3e4245,false,this.fenceRoot);}this.refreshBlockers();}
 update(dt,reduced=false,position=null){for(const g of this.intakeGates){const target=g.target??0;g.bars.position.y=reduced?target:g.bars.position.y+(target-g.bars.position.y)*(1-Math.exp(-dt*5));}this.refreshBlockers();CampWorld.prototype.update.call(this,dt,reduced,position);this.refreshBlockers();}
}

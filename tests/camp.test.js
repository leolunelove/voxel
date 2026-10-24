import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {CampWorld} from '../src/game/camp.js';
import {Player} from '../src/game/player.js';
import {freshState,validateSave,Mining,capacity,bagCount,collect} from '../src/game/rules.js';
import {MINE_STAGES,FOREST_STAGES,AXES,expandPlot,forgePick,upgradeAxe,campLevel,TREE_TOUGHNESS,treeYield,stairTop} from '../src/game/camp-rules.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){},measureText:s=>({width:s.length*10})})})};
const world=new CampWorld(new T.Scene());
const state=freshState();world.configure(state,true);
function player(){const p=new Player(new T.PerspectiveCamera(),{keys:new Set(),yaw:0,pitch:0},world);p.home();return p;}
function line(p,a,b){const steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*10);for(let n=0;n<=steps;n++){const t=n/Math.max(1,steps),pos=new T.Vector3(a[0]+(b[0]-a[0])*t,2.65,a[1]+(b[1]-a[1])*t);assert.ok(p.fits(pos),'blocked route '+pos.toArray());}}
test('compact yard has clear short routes to one mine and one forest',()=>{const p=player();line(p,[.5,8],[.5,3]);line(p,[.5,3],[-10,3]);line(p,[-10,3],[-10,-5.5]);assert.equal(world.solid(7,2,-7),true);state.mined=20;world.configure(state);world.update(3);line(p,[.5,3],[8,3]);line(p,[8,3],[8,-7]);assert.equal(campLevel(state),2);});
test('expansions charge exactly once, open larger plots, retain mined holes and add trees',()=>{const s={...freshState(),money:10000,mined:20};world.configure(s);const target=[...world.blocks.values()].find(m=>m.userData.x===-12&&m.userData.y===0);world.remove(target);const key=target.userData.key,oldCount=world.blocks.size;assert.equal(expandPlot(s,'mine'),true);world.configure(s);assert.ok(world.blocks.size>oldCount);assert.equal(world.blocks.has(key),false);assert.equal(s.money,10000-MINE_STAGES[1].cost);const oldTrees=world.trees.length;assert.equal(expandPlot(s,'forest'),true);world.configure(s);assert.ok(world.trees.length>oldTrees);assert.equal(world.trees.length,FOREST_STAGES[1].trees);assert.equal(expandPlot(s,'mine'),true);assert.equal(expandPlot(s,'mine'),false);});
test('forest cannot be expanded or axe forged before level two',()=>{const s=freshState();s.money=9999;assert.equal(expandPlot(s,'forest'),false);assert.equal(upgradeAxe(s),false);s.mined=20;assert.equal(upgradeAxe(s),true);assert.equal(s.axe,1);assert.equal(s.money,9999-AXES[1].cost);});
test('whole-tree harvest removes all trunk targets, falls, and regrows safely',()=>{const s={...freshState(),mined:20};world.configure(s);const tree=world.trees[0],before=world.meshes.filter(m=>m.userData.tree===tree).length;assert.equal(before,3);world.remove(tree.targets[0]);assert.equal(tree.status,'ready');assert.equal(tree.targets.length,2);assert.equal(tree.cuts,1);world.remove(tree.targets[0]);assert.equal(tree.status,'falling');assert.equal(world.meshes.some(m=>m.userData.tree===tree),false);world.update(1);assert.equal(tree.status,'regrowing');world.update(40,false,new T.Vector3(tree.x,2.65,tree.z));assert.equal(tree.status,'regrowing','never regrow inside the player');world.update(2,false,new T.Vector3(0,2.65,8));assert.equal(tree.status,'ready');assert.equal(tree.targets.length,3);});
test('axe upgrades noticeably reduce complete-tree cutting time and capacity reserves the entire haul',()=>{const time=power=>{const mining=new Mining();let elapsed=0;while(elapsed<10){elapsed+=1/120;if(mining.tick(1/120,'tree',8,power,true,true,TREE_TOUGHNESS).broken)return elapsed;}};assert.ok(time(AXES[1].power)<time(AXES[0].power)*.6);const s=freshState();const yieldCount=treeYield(s);for(let n=0;n<capacity(s)-yieldCount;n++)collect(s,0);assert.equal(capacity(s)-bagCount(s),yieldCount);for(let n=0;n<yieldCount;n++)assert.equal(collect(s,8),true);assert.equal(collect(s,8),false);});
test('all three mine stages have walkable stairs down and back to the yard',()=>{const s={...freshState(),money:9999,mined:20};for(let level=0;level<3;level++){s.mineLevel=level;world.configure(s);const p=player();p.position.set(-10,2.65,-5.5);for(let n=0;n<20;n++)p.step(1/120);p.input.keys.add('KeyW');for(let n=0;n<360;n++)p.step(1/120);assert.ok(p.position.y<2,'descend stage '+level);p.input.keys.clear();p.input.keys.add('KeyS');for(let n=0;n<440;n++)p.step(1/120);assert.ok(p.position.z>-5.6&&p.position.y>2.6,'walk out of stage '+level);}});
test('old permits migrate into plot stages while money, inventory and gear survive reload',()=>{const old={version:3,money:777,inventory:[1,2,3,4,5,0,0,0,6],pick:3,bagLevel:2,mined:60,rank:1,mine:1};const s=validateSave(old);assert.equal(s.version,4);assert.equal(s.mineLevel,1);assert.equal(s.money,777);assert.equal(s.pick,3);assert.deepEqual(s.inventory,old.inventory);assert.equal(s.axe,0);s.money=9999;assert.equal(expandPlot(s,'forest'),true);assert.equal(upgradeAxe(s),true);assert.deepEqual(validateSave(s),s);});
test('automatic seam refill warns, preserves progression, and actually restores ore',()=>{const s={...freshState(),mineLevel:0};world.configure(s);world.refill();const before=world.blocks.size;world.remove([...world.blocks.values()][0]);world.update(151);assert.ok(world.refillIn>=0);world.update(6);assert.equal(world.blocks.size,before);assert.equal(world.refillEvent,true);assert.equal(s.mineLevel,0);});

test('cellblock dressing preserves access to bed, shops, combat and side rooms at every plot stage',()=>{
 const s={...freshState(),mined:20};
 for(let stage=0;stage<3;stage++){
  s.mineLevel=stage;s.forestLevel=stage;world.configure(s);const p=player();
  for(const [a,b]of [
   [[.5,8],[.5,13]],[[.5,13],[.5,17]],
   [[.5,8],[13.6,8]],[[13.6,8],[13.6,16.1]],
   [[.5,8],[-10,8]],[[.5,8],[10,8]],
   [[.5,8],[-25,8]],[[.5,8],[25,8]],
   [[.5,3],[-10,3]],[[-10,3],[-10,-5.5]],
   [[.5,3],[8,3]],[[8,3],[8,-7]]
  ])line(p,a,b);
 }
 const p=player();assert.equal(p.fits(new T.Vector3(-4.7,2.65,12.15)),false,'noticeboard has real collision');
 assert.equal(p.fits(new T.Vector3(-18.2,2.65,3.7)),false,'water point has real collision');
 assert.ok(world.yardCharacter.children.some(o=>o.isInstancedMesh&&o.count>300),'masonry uses instancing');
});

test('timber dressing preserves tree approaches through every expansion and rebuilds without accumulating',()=>{
 const s={...freshState(),mined:20};
 for(let stage=0;stage<3;stage++){
  s.forestLevel=stage;world.configure(s);const p=player();
  for(const t of world.trees){
   assert.ok(p.fits(new T.Vector3(t.x,2.65,t.z+1.2)),'approach tree '+t.id+' at stage '+stage);
   const ray=new T.Ray(new T.Vector3(t.x,2.5,t.z+1.2),new T.Vector3(0,0,-1));
   assert.equal(world.obstructed(ray,1.2),false,'clear chopping line '+t.id);
  }
  const count=world.forestDress.children.length;world.configure(s);assert.equal(world.forestDress.children.length,count);
 }
 const expandedCount=world.forestDress.children.length;s.forestLevel=0;world.configure(s);assert.ok(world.forestDress.children.length<expandedCount,'old expansion dressing is removed when loading a smaller plot');
});

test('all archery lanes retain clear shots and a solid backstop beyond the target',()=>{
 const p=player();
 for(const z of [5.8,9,12.2]){
  line(p,[21,9],[23.7,z]);line(p,[23.7,z],[34,z]);
  const ray=new T.Ray(new T.Vector3(23.7,2.5,z),new T.Vector3(1,0,0));
  assert.equal(world.obstructed(ray,11.2),false,'clear target face at '+z);
  assert.equal(world.obstructed(ray,15),true,'backstop catches missed arrows at '+z);
 }
});

test('condemned yard dressing leaves monster pursuit space and retreat route clear',()=>{
 const p=player();line(p,[.5,13],[.5,19]);
 for(const z of [19,22,25,28])line(p,[-5,z],[5,z]);
 assert.ok(world.workyardCharacter.children.some(o=>o.isInstancedMesh),'repeated fixtures are batched');
});

test('Iron & Ember gallery stairs climb onto a solid upper walkway without blocking the main yard',()=>{
 const p=player();p.position.set(-15.5,2.65,8.1);p.input.keys.add('KeyS');
 for(let n=0;n<150;n++)p.step(1/60);
 assert.ok(p.position.y>5.9,'walks up half-block steps onto upper gallery');
 assert.ok(p.position.z>13.1,'reaches the landing');
 assert.equal(p.fits(new T.Vector3(-15.5,5.7,13.7)),false,'gallery has a solid floor');
 assert.ok(p.fits(new T.Vector3(-15.5,6.35,13.7)),'headroom above landing');
 assert.ok(world.emberCharacter.children.some(o=>o.isInstancedMesh),'new masonry is instanced');
});

test('new six-metre forecourt is open ground, while the moved work gates and perimeter stay solid',()=>{
 const s={...freshState(),mined:0};world.configure(s);const p=player();
 line(p,[-12,1],[-12,-3.5]);line(p,[-12,-3.5],[12,-3.5]);
 line(p,[-10,3],[-10,-5.5]);
 assert.equal(world.solid(8,2,-7),true,'forest access stays locked beyond its moved gate');
 assert.equal(world.solid(8,.5,-3),true,'the new forecourt has ground');
 assert.equal(world.solid(0,2,-24),true,'northern perimeter remains closed');
 s.mined=20;world.configure(s);world.update(3);line(p,[8,-3],[8,-7]);
});

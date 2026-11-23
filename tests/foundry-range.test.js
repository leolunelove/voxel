import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {FoundryWorld} from '../src/game/foundry-world.js';import {Player} from '../src/game/player.js';import {freshState} from '../src/game/rules.js';import {freshHunt} from '../src/game/hunt-rules.js';import {Archery} from '../src/game/archery.js';
import {RANGE_ROUTE,RANGE_WING,RANGE_TARGETS,rangeAccess,rangeFiringPosition,targetOffset} from '../src/game/foundry-range-layout.js';import {inRange,trainingGateNear} from '../src/game/foundry-layout.js';
globalThis.document={createElement:()=>({getContext:()=>({createRadialGradient:()=>({addColorStop(){}}),fillRect(){},strokeRect(){},fillText(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},measureText:s=>({width:s.length*10})})})};
const free={obstructed:()=>false};
test('qualification gate uses clearance four, retains prior Archery access and has a full walkable return route',()=>{
 const w=new FoundryWorld(new T.Scene()),state={...freshState(),mined:119};w.configure(state);w.setIntake(5);w.syncTrainingAccess({},true);const p=new Player(new T.PerspectiveCamera(),{keys:new Set(),yaw:0,pitch:0},w);
 assert.equal(p.fits(new T.Vector3(18,2.65,29)),false);assert.equal(rangeAccess(state),false);assert.equal(rangeAccess(state,{archeryXP:6}),true);
 state.mined=120;w.configure(state);w.syncTrainingAccess({},true);w.update(2,true);
 for(const points of [RANGE_ROUTE,[...RANGE_ROUTE].reverse()])for(let i=1;i<points.length;i++){const [x,z]=points[i-1],[tx,tz]=points[i],steps=Math.ceil(Math.hypot(tx-x,tz-z)*12);for(let n=0;n<=steps;n++){const v=new T.Vector3(x+(tx-x)*n/steps,2.66,z+(tz-z)*n/steps);assert.ok(p.fits(v),'blocked '+v.toArray());}}
 assert.equal(w.area(new T.Vector3(32,2.65,29)),11);assert.equal(w.area(new T.Vector3(44.5,2.65,25)),6);assert.equal(trainingGateNear({x:16.5,z:29}).key,RANGE_WING.key);assert.equal(inRange({x:44.5,z:25}),true);
 for(const t of RANGE_TARGETS)assert.ok(p.fits(new T.Vector3(44.5,2.65,t.z)));
 assert.equal(p.fits(new T.Vector3(50,2.65,22)),false);assert.equal(w.solid(36,2,24),true);
});
test('moving targets stay inside their lanes with stable time-based motion',()=>{
 for(const t of RANGE_TARGETS)for(let time=0;time<30;time+=.1){const d=targetOffset(t,time);assert.ok(Math.abs(d)<=1.2);assert.ok(Math.abs(d)+.9<2.5);}
 assert.equal(targetOffset(RANGE_TARGETS[0],10),0);assert.notEqual(targetOffset(RANGE_TARGETS[1],0),targetOffset(RANGE_TARGETS[1],1));
 const a=new Archery(new T.Scene(),freshHunt(),()=>{},()=>{},{targets:RANGE_TARGETS});const c=new T.PerspectiveCamera();for(let i=0;i<60;i++)a.update(1/60,false,c,false,free);assert.ok(Math.abs(a.targets[4].position.z-(30+targetOffset(RANGE_TARGETS[1],1)))<1e-9);assert.equal(a.targets[5].position.z,a.targets[4].position.z);
});
test('registered shots reward accuracy once and lodged arrows follow the moving carriage',()=>{
 const state=freshHunt(),scores=[],spec={...RANGE_TARGETS[1],x:54,z:25,speed:0,phase:Math.PI/2};const a=new Archery(new T.Scene(),state,(xp,r)=>scores.push([xp,r]),()=>{},{targets:[spec],canScore:rangeFiringPosition}),c=new T.PerspectiveCamera(72,1.8,.05,180);c.position.set(44.5,2.65,26.2);c.lookAt(54,3.04,26.2);c.updateMatrixWorld();a.update(0,false,c,true,free);a.fire(c,1,free);for(let n=0;n<60;n++)a.update(1/120,false,c,true,free);
 assert.equal(scores.length,1);assert.equal(scores[0][0],8);assert.equal(state.archeryXP,8);assert.equal(a.impacts.length,1);const arrow=a.impacts[0].mesh,target=a.targets[0];assert.equal(arrow.parent,target);target.updateMatrixWorld(true);const before=arrow.getWorldPosition(new T.Vector3());spec.speed=1;for(let n=0;n<60;n++)a.update(1/60,false,c,true,free);target.updateMatrixWorld(true);const after=arrow.getWorldPosition(new T.Vector3());assert.ok(Math.abs(after.z-before.z)>.3);assert.equal(state.archeryXP,8);a.reset();assert.equal(a.impacts.length,0);
});
test('crossing the firing line or shooting through masonry cannot farm qualification XP',()=>{
 for(const blocked of [false,true]){const state=freshHunt(),a=new Archery(new T.Scene(),state,()=>assert.fail('invalid scoring'),()=>{},{targets:[RANGE_TARGETS[0]],canScore:rangeFiringPosition});let rejected=0;a.onRangeReject=()=>rejected++;const c=new T.PerspectiveCamera();c.position.set(blocked?44.5:50,2.8,25);c.lookAt(54,2.85,25);c.updateMatrixWorld();a.fire(c,1);for(let n=0;n<100;n++)a.update(.01,false,c,true,{obstructed:()=>blocked});assert.equal(state.archeryXP,0);assert.equal(rejected,blocked?0:1);}
});

import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {Archery} from '../src/game/archery.js';import {freshHunt} from '../src/game/hunt-rules.js';
const free={obstructed:()=>false};
test('reticle-centred shots hit bullseyes while turning, jumping and using different charge and frame rates',()=>{
 for(const dt of [1/30,1/60,1/120])for(const charge of [.3,1])for(const height of [2.5,3.8]){
  const state=freshHunt(),scores=[],a=new Archery(new T.Scene(),state,(xp,radius)=>scores.push({xp,radius})),camera=new T.PerspectiveCamera(72,1.8,.05,180);camera.position.set(24,height,9);camera.lookAt(35,2.5,9);camera.updateMatrixWorld();a.fire(camera,charge,free);
  for(let t=0;t<1;t+=dt)a.update(dt,false,camera,false,free);
  assert.equal(scores.length,1);assert.ok(scores[0].radius<.08,'impact close to crosshair at '+dt+'/'+height+'/'+charge);assert.equal(scores[0].xp,6);
 }
});
test('foreground walls catch a converging shot once and never award target XP',()=>{
 const state=freshHunt(),a=new Archery(new T.Scene(),state,()=>assert.fail('target is behind wall')),camera=new T.PerspectiveCamera(72,1.8,.05,180);camera.position.set(24,2.5,9);camera.lookAt(35,2.5,9);camera.updateMatrixWorld();
 const wall=new T.Box3(new T.Vector3(28,0,5),new T.Vector3(29,6,13)),world={obstructed:(ray,d)=>{const p=ray.intersectBox(wall,new T.Vector3());return !!p&&p.distanceTo(ray.origin)<d;}};let impacts=0;a.onWallHit=()=>impacts++;a.fire(camera,1,world);
 for(let i=0;i<100;i++)a.update(.01,false,camera,false,world);
 assert.equal(impacts,1);assert.equal(state.archeryXP,0);assert.equal(a.arrows.length,0);
});

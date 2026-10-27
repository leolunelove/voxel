import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {Archery} from '../src/game/archery.js';import {freshHunt} from '../src/game/hunt-rules.js';
const free={obstructed:()=>false};
test('uncompensated arrows fall naturally at every frame rate and require a higher aim at distance',()=>{
 for(const dt of [1/30,1/60,1/120])for(const charge of [.3,1]){
  const a=new Archery(new T.Scene(),freshHunt(),()=>{}),camera=new T.PerspectiveCamera(72,1.8,.05,180);camera.position.set(0,8,0);camera.updateMatrixWorld();a.fire(camera,charge,free);
  const arrow=a.arrows[0],origin=arrow.mesh.position.clone(),velocity=arrow.velocity.clone();
  for(let n=0;n<Math.round(.5/dt);n++)a.update(dt,false,camera,false,free);
  const expected=origin.clone().addScaledVector(velocity,.5);expected.y-=.5*14*.5*.5;
  assert.ok(arrow.mesh.position.distanceTo(expected)<1e-8,'consistent ballistic drop');
  assert.ok(arrow.mesh.getWorldDirection(new T.Vector3()).dot(arrow.velocity)<0,'arrowhead leads and feathers trail');
 }
 const state=freshHunt(),scores=[],a=new Archery(new T.Scene(),state,(xp,radius)=>scores.push({xp,radius})),camera=new T.PerspectiveCamera(72,1.8,.05,180);camera.position.set(24,2.65,9);camera.lookAt(35,2.95,9);camera.updateMatrixWorld();a.fire(camera,1,free);
 for(let n=0;n<60;n++)a.update(1/60,false,camera,false,free);
 assert.equal(scores.length,1);assert.equal(scores[0].xp,6,'aiming above the centre compensates gravity');
});
test('foreground walls catch a converging shot once and never award target XP',()=>{
 const state=freshHunt(),a=new Archery(new T.Scene(),state,()=>assert.fail('target is behind wall')),camera=new T.PerspectiveCamera(72,1.8,.05,180);camera.position.set(24,2.5,9);camera.lookAt(35,2.5,9);camera.updateMatrixWorld();
 const wall=new T.Box3(new T.Vector3(28,0,5),new T.Vector3(29,6,13)),world={obstructed:(ray,d)=>{const p=ray.intersectBox(wall,new T.Vector3());return !!p&&p.distanceTo(ray.origin)<d;}};let impacts=0;a.onWallHit=()=>impacts++;a.fire(camera,1,world);
 for(let i=0;i<100;i++)a.update(.01,false,camera,false,world);
 assert.equal(impacts,1);assert.equal(state.archeryXP,0);assert.equal(a.arrows.length,0);
});

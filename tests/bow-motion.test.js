import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {bowRig,applyBowRig,BOW_ROTATION} from '../src/engine/bow-motion.js';
import {bowFlight,bowMuzzle,viewArrowTip,ballisticVelocity} from '../src/engine/bow-space.js';
import {createBow,bowPose,BOW_SCALE} from '../src/engine/pickaxe.js';
function poseBow(draw,aspect=1.8,age=Infinity){const bow=createBow(0),rig=bowRig(draw,age),pose=bowPose(rig.stance,aspect);applyBowRig(bow,rig);bow.scale.setScalar(BOW_SCALE);bow.position.fromArray(pose.position);bow.rotation.fromArray(pose.rotation);bow.position.z+=rig.follow;bow.updateMatrixWorld(true);return {bow,rig};}
test('nock pulls toward the eye along the aiming axis while both 3D cords stay attached',()=>{
 let first,last;
 for(let i=0;i<=20;i++){
  const {bow,rig}=poseBow(i/20),nock=bow.getObjectByName('loaded-arrow').getWorldPosition(new T.Vector3());if(!i)first=nock;last=nock;
  const points=bow.getObjectByName('bowstring').geometry.attributes.position;
  for(const [index,side,name,cordName]of [[0,-1,'lower-limb','string-lower'],[2,1,'upper-limb','string-upper']]){
   const tip=new T.Vector3(.28,side*.50,-.015).applyEuler(bow.getObjectByName(name).rotation),p=new T.Vector3().fromBufferAttribute(points,index);assert.ok(p.distanceTo(tip)<1e-6);
   const cord=bow.getObjectByName(cordName),a=new T.Vector3(0,-.5,0).multiply(cord.scale).applyQuaternion(cord.quaternion).add(cord.position),b=new T.Vector3(0,.5,0).multiply(cord.scale).applyQuaternion(cord.quaternion).add(cord.position);assert.ok(a.distanceTo(tip)<1e-6);assert.ok(b.distanceTo(new T.Vector3(...rig.nock))<1e-6);
  }
 }
 assert.ok(last.z-first.z>.8,'long visible pull toward the player');
});
test('visible arrow points at the screen centre at every draw, without hiding the shaft',()=>{
 for(const aspect of [.9,1.8,2.4])for(const draw of [0,.2,.6,1]){
  const {bow}=poseBow(draw,aspect),camera=new T.PerspectiveCamera(48,aspect,.01,10),arrow=bow.getObjectByName('loaded-arrow'),n=arrow.localToWorld(new T.Vector3()).project(camera),t=arrow.localToWorld(new T.Vector3(0,0,-1.39)).project(camera);
  const dx=t.x-n.x,dy=t.y-n.y,distance=Math.abs(n.x*dy-n.y*dx)/Math.hypot(dx,dy);assert.ok(distance<1e-6,'shaft extended intersects crosshair');
  if(draw===1)assert.ok(Math.hypot(dx,dy)>.08,'full draw exposes a real length of shaft');
 }
});
test('release snaps forward immediately, rings briefly, then returns to a stable rest',()=>{
 assert.ok(bowRig(0,.02).arrowLaunch>2);assert.equal(bowRig(0,.03).arrowVisible,false);assert.ok(bowRig(0,.04).tension<0);assert.equal(bowRig(0,.3).tension,0);
 assert.equal(bowRig(1,Infinity,1,true).nock[2],bowRig(1).nock[2]);assert.equal(bowRig(0,.1,1,true).follow,0);
 const {bow,rig}=poseBow(0,1.8,.02),flight=new T.Vector3(0,0,-1).applyQuaternion(bow.getObjectByName('loaded-arrow').quaternion).applyEuler(new T.Euler(...BOW_ROTATION));assert.ok(flight.distanceTo(bowFlight(rig.stance))<1e-6);
});
test('every upgraded bow stays inside narrow and wide views through draw and release',()=>{
 for(const aspect of [.9,1.8])for(let tier=0;tier<4;tier++){
  const bow=createBow(tier),camera=new T.PerspectiveCamera(48,aspect,.01,10);
  for(let i=0;i<=40;i++){
   const draw=i<=20?i/20:0,age=i<=20?Infinity:(i-20)*.012,rig=bowRig(draw,age);applyBowRig(bow,rig);const pose=bowPose(rig.stance,aspect);bow.scale.setScalar(BOW_SCALE);bow.position.fromArray(pose.position);bow.rotation.fromArray(pose.rotation);bow.position.z+=rig.follow;bow.updateMatrixWorld(true);
   bow.traverse(o=>{if(!o.geometry||!o.visible||!o.parent.visible)return;const attr=o.geometry.attributes.position;for(let j=0;j<attr.count;j++){const p=new T.Vector3().fromBufferAttribute(attr,j).applyMatrix4(o.matrixWorld).project(camera);assert.ok(Number.isFinite(p.x)&&Math.abs(p.x)<1&&Math.abs(p.y)<1,o.name+' clipped at '+draw+'/'+age+' '+p.toArray());}});
  }
 }
});
test('real muzzle and visible arrow tip share a screen position through pitch, yaw and field of view changes',()=>{
 for(const fov of [69,72,90])for(const yaw of [-2,0,2])for(const pitch of [-1,.3,1]){
  const camera=new T.PerspectiveCamera(fov,1.8,.05,180);camera.position.set(7,3,-4);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();const view=new T.PerspectiveCamera(48,1.8,.01,10);
  for(const draw of [.2,1]){const world=bowMuzzle(camera,draw).project(camera),visible=viewArrowTip(draw).project(view);assert.ok(Math.hypot(world.x-visible.x,world.y-visible.y)<1e-6);}
 }
});
test('ballistic launch keeps equipment speed and intersects the intended point at different heights',()=>{
 for(const target of [new T.Vector3(0,0,-4),new T.Vector3(1,8,-20),new T.Vector3(-4,-3,-35)])for(const speed of [24,42,84]){
  const origin=new T.Vector3(-.1,-.05,-.55),v=ballisticVelocity(origin,target,speed),horizontal=Math.hypot(target.x-origin.x,target.z-origin.z),time=horizontal/Math.hypot(v.x,v.z),hit=origin.clone().addScaledVector(v,time).add(new T.Vector3(0,-.8*time*time,0));assert.ok(Math.abs(v.length()-speed)<1e-8);assert.ok(hit.distanceTo(target)<1e-7);
 }
});

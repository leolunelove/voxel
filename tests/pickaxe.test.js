import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {createPickaxe,createAxe,createSword,SWORD_TIP,swordSwingPose,swingPose,contactPivot,CONTACT_TIP,AXE_TIP,heldPose,TOOL_SCALE} from '../src/engine/pickaxe.js';

test('swing returns smoothly to rest with a faster strike than recovery',()=>{
 assert.deepEqual(swingPose(0),swingPose(1));
 for(let p=0;p<1;p+=.001){const a=swingPose(p),b=swingPose(p+.001);assert.ok(a.every(Number.isFinite));assert.ok(a.every((v,i)=>Math.abs(v-b[i])<.04));}
 assert.ok(swingPose(.30)[3]<-.1);assert.ok(swingPose(.30)[3]>-.45,'strike rotation should remain restrained');assert.ok(swingPose(.16)[3]>0);
 assert.ok(Math.abs(swingPose(.30)[0])<.2,'contact must not swipe sideways');
 assert.ok(swingPose(.30)[2]<-.05,'contact must drive the pick forward');
});
test('contact stops briefly before the tool lifts away and settles',()=>{
 assert.deepEqual(swingPose(.30),swingPose(.33),'the head must stop rather than float through contact');
 for(const aspect of [.9,16/9])assert.deepEqual(heldPose(.30,aspect),heldPose(.33,aspect),'framing must stay still during contact');
 assert.ok(swingPose(.48)[1]>swingPose(.30)[1],'recoil lifts the head off the block');
 assert.ok(swingPose(.48)[2]>swingPose(.30)[2],'recoil pulls back from the face');
 assert.deepEqual(swingPose(.8),swingPose(1),'the end of each cycle has a quiet resting interval');
 const distance=(a,b)=>Math.hypot(...swingPose(a).map((v,i)=>v-swingPose(b)[i]));
 assert.ok(distance(.28,.30)>distance(.16,.18)*3,'the downward stroke accelerates into impact');
});
test('the solid pick has a square shaft and its working point faces away from the camera',()=>{
 const tool=createPickaxe(0);assert.ok(tool.children.length>10,'head, socket and grip are solid separate parts');
 const shaft=tool.children[0].geometry.parameters;assert.equal(shaft.width,shaft.depth);
 for(const phase of [0,.16,.30,.48]){const pose=heldPose(phase,16/9),tip=CONTACT_TIP.clone().applyEuler(new T.Euler(...pose.rotation));assert.ok(tip.z<-.35,'leading point must project into the scene');}
});
test('the leading tip meets the aimed surface without modifying the camera',()=>{for(const aspect of [.9,16/9])for(const pitch of [-1.2,-.4,.3])for(const yaw of [-2,.7]){
 const camera=new T.PerspectiveCamera(72,aspect,.05,100);camera.position.set(2,3,-1);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();const before=camera.quaternion.clone();
 const view=new T.PerspectiveCamera(48,aspect,.01,10),point=new T.Vector3(.12,-.05,-3).applyMatrix4(camera.matrixWorld),rotation=new T.Euler(-1.14,1.35,-.085);
 const position=contactPivot(point,camera,view,rotation),tip=CONTACT_TIP.clone().multiplyScalar(TOOL_SCALE).applyEuler(rotation).add(position).project(view),expected=point.clone().project(camera);
 assert.ok(Math.abs(tip.x-expected.x)<1e-6);assert.ok(Math.abs(tip.y-expected.y)<1e-6);assert.ok(camera.quaternion.equals(before));
}});
test('every tier stays framed horizontally through the actual held swing on narrow and wide displays',()=>{
 for(const kind of ['pick','axe'])for(const tier of kind==='pick'?[0,1,2,3,4,5]:[0,1,2,3])for(const aspect of [.9,4/3,16/9])for(const phase of Array.from({length:21},(_,i)=>i/20)){
  const camera=new T.PerspectiveCamera(48,aspect,.01,10),pivot=new T.Group(),tool=kind==='axe'?createAxe(tier):createPickaxe(tier);
  const pose=heldPose(phase,aspect,1,kind);tool.scale.setScalar(TOOL_SCALE);pivot.add(tool);pivot.position.fromArray(pose.position);pivot.rotation.fromArray(pose.rotation);pivot.updateMatrixWorld(true);
  tool.traverse(mesh=>{if(!mesh.geometry)return;const vertices=mesh.geometry.attributes.position;
   for(let i=0;i<vertices.count;i++){
    const point=new T.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).project(camera);if(point.y>=-1)assert.ok(Math.abs(point.x)<1,`tier ${tier}, aspect ${aspect}, x ${point.x}`);
   }
  });
 }
});

test('the forward working point strikes close to the reticle without a large position correction',()=>{for(const kind of ['pick','axe'])for(const aspect of [.9,4/3,16/9]){const pose=heldPose(.30,aspect,1,kind),view=new T.PerspectiveCamera(48,aspect,.01,10);const tip=(kind==='axe'?AXE_TIP:CONTACT_TIP).clone().multiplyScalar(TOOL_SCALE).applyEuler(new T.Euler(...pose.rotation)).add(new T.Vector3(...pose.position)).project(view);assert.ok(Math.abs(tip.x)<.15);assert.ok(Math.abs(tip.y)<.04);}});

 test('sword stays framed through its full slash and contacts the reticle',()=>{for(const aspect of [.9,16/9])for(let n=0;n<=100;n++){const phase=n/100,tool=createSword(),pose=heldPose(phase,aspect,1,'sword'),camera=new T.PerspectiveCamera(48,aspect,.01,10);tool.scale.setScalar(TOOL_SCALE);tool.position.fromArray(pose.position);tool.rotation.fromArray(pose.rotation);tool.updateMatrixWorld(true);tool.traverse(m=>{if(!m.geometry)return;const v=m.geometry.attributes.position;for(let i=0;i<v.count;i++){const p=new T.Vector3().fromBufferAttribute(v,i).applyMatrix4(m.matrixWorld).project(camera);if(p.y>=-1)assert.ok(Math.abs(p.x)<1,`phase ${phase} aspect ${aspect} x ${p.x}`);}});if(n===30){const tip=SWORD_TIP.clone().applyMatrix4(tool.matrixWorld).project(camera);assert.ok(Math.abs(tip.x)<1e-6&&Math.abs(tip.y)<1e-6);}tool.traverse(m=>{m.geometry?.dispose();m.material?.dispose();});}assert.ok(swordSwingPose(.18)[5]>0);assert.ok(swordSwingPose(.30)[5]<-.2);});

test('work tools rest at the right shoulder and pitch forward without a sideways sweep',()=>{
 for(const kind of ['pick','axe']){
  const rest=heldPose(0,16/9,1,kind),lift=heldPose(.16,16/9,1,kind),hit=heldPose(.30,16/9,1,kind);
  assert.ok(rest.position[0]>.5,'grip sits to the right of the aiming line');
  assert.ok(Math.abs(rest.rotation[2])<.3,'restrained grip roll, not a broadside presentation');
  assert.ok(hit.rotation[0]<lift.rotation[0]-.5,'head pitches down and forward');
  assert.ok(Math.abs(hit.rotation[1]-lift.rotation[1])<.04,'no large yaw sweep');
  for(let n=1;n<=1000;n++){
   const a=heldPose((n-1)/1000,16/9,1,kind),b=heldPose(n/1000,16/9,1,kind);
   assert.ok(Math.hypot(...a.position.map((v,i)=>v-b.position[i]))<.035,'continuous contact approach');
  }
 }
});

test('the working edge faces into the scene and follows a downward contact path',()=>{
 for(const kind of ['pick','axe']){
  const localTip=kind==='pick'?CONTACT_TIP:AXE_TIP;
  const tipAt=phase=>{const p=heldPose(phase,16/9,1,kind);return localTip.clone().multiplyScalar(TOOL_SCALE).applyEuler(new T.Euler(...p.rotation)).add(new T.Vector3(...p.position));};
  for(const phase of [0,.16,.26,.30,.44]){
   const p=heldPose(phase,16/9,1,kind),edge=localTip.clone().sub(new T.Vector3(0,.285,0)).normalize().applyEuler(new T.Euler(...p.rotation));
   assert.ok(-edge.z>.7,'head points forward rather than broadside');
   assert.ok(-edge.z>Math.abs(edge.x)*1.7,'forward reach dominates sideways reach');
  }
  assert.ok(tipAt(.16).y>.15,'windup visibly lifts above the target');
  for(let n=17;n<=30;n++){
   const before=tipAt((n-1)/100),after=tipAt(n/100);
   assert.ok(after.y<=before.y+1e-8,'downstroke never floats upward toward contact');
   assert.ok(after.z<before.z,'point drives into the surface');
  }
  const hit=tipAt(.30),rebound=tipAt(.44);
  assert.ok(Math.abs(hit.x)<1e-8&&Math.abs(hit.y)<1e-8);
  assert.ok(rebound.y>hit.y+.07&&rebound.z>hit.z+.18,'short upward/backward recoil');
  // The lower handle remains below and to the right of the contacting point.
  const p=heldPose(.30,16/9,1,kind),grip=new T.Vector3(0,-1,.22).multiplyScalar(TOOL_SCALE).applyEuler(new T.Euler(...p.rotation)).add(new T.Vector3(...p.position));
  assert.ok(grip.x>hit.x+.3&&grip.y<hit.y-.4,'grip supports the forward head');
 }
});

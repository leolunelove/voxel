import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {faceUV,fractureLines,BlockFracture} from '../src/engine/block-fracture.js';
import {impactSound} from '../src/engine/impact-sound.js';
import {Feedback} from '../src/engine/feedback.js';
function canvas(){return {width:128,height:128,getContext:()=>({clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillRect(){}})};}globalThis.document={createElement:canvas};
test('face UV anchors map all six block faces without using a camera',()=>{
 const p=new T.Vector3(.2,.3,-.4);
 assert.deepEqual(faceUV(p,new T.Vector3(0,0,1)),{face:4,u:.7,v:.8});
 assert.deepEqual(faceUV(p,new T.Vector3(0,1,0)),{face:2,u:.7,v:.9});
 const faces=new Set();for(const n of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])faces.add(faceUV(p,new T.Vector3(...n)).face);assert.equal(faces.size,6);
});
test('fractures stay fixed to the first impact, grow on contact, and follow a parent transform',()=>{
 const scene=new T.Scene(),group=new T.Group(),block=new T.Mesh(new T.BoxGeometry(1,1,1));group.position.set(3,2,-5);group.rotation.y=.4;group.add(block);scene.add(group);scene.updateMatrixWorld(true);block.userData.key='ore:1';
 const f=new BlockFracture(scene),local=new T.Vector3(.2,.1,.5),point=block.localToWorld(local.clone()),normal=new T.Vector3(0,0,1).transformDirection(block.matrixWorld);
 f.hit(block,point,normal,.3);f.target(block);const anchor={...f.anchor};assert.ok(Math.abs(anchor.u-.7)<1e-6);assert.equal(f.stage,3);assert.equal(f.mesh.visible,true);
 f.hit(block,block.localToWorld(new T.Vector3(-.3,-.3,.5)),normal,.7);assert.deepEqual(f.anchor,anchor,'turning across the face never slides the fracture');assert.equal(f.stage,7);
 group.position.x+=2;group.rotation.y+=.6;scene.updateMatrixWorld(true);f.target(block);assert.ok(f.mesh.matrix.equals(block.matrixWorld));
 f.target(null);assert.equal(f.mesh.visible,false);assert.equal(f.stage,0);
});
test('crack networks are repeatable per block, distinct between blocks, and become denser',()=>{
 assert.deepEqual(fractureLines('a',4,5),fractureLines('a',4,5));assert.notDeepEqual(fractureLines('a',4,5),fractureLines('b',4,5));assert.ok(fractureLines('a',4,9).length>fractureLines('a',4,1).length);
 for(const line of fractureLines('a',4,9,{u:.99,v:.01}))for(const p of line)for(const c of p)assert.ok(c>=1&&c<=127);
});
test('impact chips leave the struck face, are bounded, expire, and never move the game camera',()=>{
 const f=new Feedback(new T.Scene()),m=new T.Mesh(new T.BoxGeometry(1,1,1));m.userData.type=3;const camera=new T.PerspectiveCamera(),before=camera.matrix.clone();
 for(const normal of [new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,-1)]){
  f.particles=[];f.blockImpact(m,new T.Vector3(),normal,0xcccccc,.5);assert.equal(f.particles.length,5);for(const p of f.particles){assert.ok(p.v.dot(normal)>.5);assert.ok(p.m.position.dot(normal)>.02);}
 }
 f.reduced=true;f.particles=[];f.blockImpact(m,new T.Vector3(),new T.Vector3(0,0,1),0xcccccc,1,true);assert.equal(f.particles.length,6);
 for(let i=0;i<80;i++)f.update(.02,false,0,false,{camera});assert.equal(f.particles.length,0);assert.ok(camera.matrix.equals(before));
});
test('mining sounds have a sharp bounded transient, material identities and a separate break tail',()=>{
 for(let type=0;type<9;type++)for(let tier=0;tier<6;tier++)for(const kind of ['hit','break']){
  const layers=impactSound(kind,type,tier,2);assert.ok(layers[0].attack<=.002);assert.ok(layers.some(x=>x.kind==='grit'&&x.delay===0&&x.duration<.03));
  for(const x of layers){assert.ok(x.frequency>0&&x.frequency<8000);assert.ok(x.volume>0&&x.volume<=.12);assert.ok(x.delay+x.duration<.2);}
 }
 assert.notDeepEqual(impactSound('hit',0),impactSound('hit',3));assert.notDeepEqual(impactSound('hit',3),impactSound('hit',6));assert.notDeepEqual(impactSound('hit',0),impactSound('hit',8));assert.ok(impactSound('break',0).length>impactSound('hit',0).length);
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {CampWorld} from '../src/game/camp.js';
import {Player} from '../src/game/player.js';
import {freshState} from '../src/game/rules.js';
import {entryFloor,atUnderblockSeal,entryDepth} from '../src/game/underblock-entry-rules.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},strokeRect(){},fillText(){},measureText:s=>({width:s.length*10})})})};
function setup(){const scene=new T.Scene(),world=new CampWorld(scene);world.configure(freshState(),true);const input={keys:new Set(),yaw:0,pitch:0},p=new Player(new T.PerspectiveCamera(),input,world);p.position.set(-22,2.65,8);return {p,input,world,scene};}
test('walk all the way down to the seal and back to the yard without jumping',()=>{
 for(const dt of [1/120,1/60,1/30]){
  const {p,input}=setup();for(let i=0;i<10;i++)p.step(dt);
  input.keys.add('KeyA');for(let t=0;t<3.3;t+=dt)p.step(dt);input.keys.clear();
  for(let t=0;t<.25;t+=dt)p.step(dt);
  assert.ok(atUnderblockSeal(p.position),'reach seal at '+dt+' '+p.position.toArray());
  assert.ok(Math.abs(p.position.y+.35)<.05,'settle on lower landing');
  input.keys.add('KeyD');for(let t=0;t<3.6;t+=dt)p.step(dt);input.keys.clear();for(let t=0;t<.25;t+=dt)p.step(dt);
  assert.ok(p.position.x> -23&&p.position.y>2.6,'walk out at '+dt+' '+p.position.toArray());
 }
});
test('seal cannot be triggered from the upper floor or beside the stairwell',()=>{
 assert.equal(atUnderblockSeal({x:-34,y:2.65,z:8}),false);
 assert.equal(atUnderblockSeal({x:-34,y:-.35,z:11}),false);
 assert.equal(atUnderblockSeal({x:-34,y:-.35,z:8}),true);
 assert.equal(atUnderblockSeal({x:-27,y:.8,z:8}),false);
 assert.equal(entryFloor(-22,8),1);assert.equal(entryFloor(-34,8),-2);assert.equal(entryFloor(-34,12),1);
 assert.equal(entryDepth({x:0,z:8}),0);assert.equal(entryDepth({x:-34,z:8}),1);assert.equal(entryDepth({x:-34,z:12}),0);
});
test('retaining walls prevent sideways exits, door stops overshooting and underground lamps remain on',()=>{
 const {p,input,world,scene}=setup();
 p.position.set(-34,-.35,8);
 assert.equal(p.fits(new T.Vector3(-34,-.35,5.65)),false);
 assert.equal(p.fits(new T.Vector3(-36.8,-.35,8)),false);
 input.keys.add('KeyA');for(let i=0;i<120;i++)p.step(1/60);
 assert.ok(p.position.x> -36.4&&p.position.y> -1,'seal door catches player');
 const lamps=[];scene.traverse(o=>{if(o.isPointLight&&o.userData.alwaysOn)lamps.push(o);});assert.ok(lamps.length>=5,'cell and stairwell stay lit');
 assert.ok(world.underblockEntry);
});

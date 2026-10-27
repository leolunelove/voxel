import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {bowPower,bowMoveSpeed} from '../src/game/bow-rules.js';import {BOWS,arrowDamage} from '../src/game/weapons.js';import {Archery} from '../src/game/archery.js';import {freshHunt} from '../src/game/hunt-rules.js';import {Player} from '../src/game/player.js';
const free={obstructed:()=>false};
test('short draws are weak, full draws retain tier damage, and holding never autofires',()=>{
 const s=freshHunt(),a=new Archery(new T.Scene(),s,()=>{}),camera=new T.PerspectiveCamera();camera.updateMatrixWorld();
 assert.equal(BOWS[0].draw,1);assert.equal(bowPower(1),1);assert.ok(arrowDamage(s,.3)<arrowDamage(s,1)*.25);
 a.update(.1,true,camera,true,free);a.update(0,false,camera,true,free);assert.equal(a.arrows.length,0);
 a.update(3,true,camera,true,free);assert.equal(a.charge,1);assert.equal(a.arrows.length,0);
 a.update(0,false,camera,true,free);assert.equal(a.arrows.length,1);assert.equal(a.arrows[0].damage,26);assert.equal(a.arrows[0].critical,true);
 a.update(0,false,camera,true,free);assert.equal(a.arrows.length,1,'one arrow per release');
});
test('canceling a draw or leaving the skill never discharges a stale arrow',()=>{
 for(const cancel of [a=>a.cancel(),a=>a.update(0,false,new T.PerspectiveCamera(),false,free)]){
  const a=new Archery(new T.Scene(),freshHunt(),()=>{}),c=new T.PerspectiveCamera();c.updateMatrixWorld();a.update(1,true,c,true,free);cancel(a);a.update(0,false,c,true,free);assert.equal(a.arrows.length,0);assert.equal(a.charge,0);
 }
});
test('drawing slows travel and disables sprint while keeping jumping and turning available',()=>{
 assert.equal(bowMoveSpeed(true,true),bowMoveSpeed(true,false));assert.ok(bowMoveSpeed(true,false)<bowMoveSpeed(false,false)*.4);
 const input={keys:new Set(['KeyW','ShiftLeft','ArrowLeft']),yaw:0,pitch:0},p=new Player(new T.PerspectiveCamera(),input,{solid:(_x,y)=>y<1,blockers:[]});p.position.set(0,2.65,0);p.grounded=true;p.drawingBow=true;
 for(let i=0;i<120;i++)p.step(1/120);assert.ok(p.horizontal.length()<1.31);assert.ok(input.yaw>1.7);
 input.keys.add('Space');p.step(1/120);assert.ok(p.velocity>0,'jump remains available');
});
test('right mouse draws a captured bow, guards with a sword, and remains look in fallback mode',async()=>{
 const {Input}=await import('../src/engine/input.js'),events={},canvasEvents={};
 const oldWindow=globalThis.window,oldDocument=globalThis.document;
 globalThis.window={addEventListener:(n,fn)=>events[n]=fn};globalThis.document={addEventListener(){}};
 try{const input=new Input({addEventListener:(n,fn)=>canvasEvents[n]=fn},()=>{});input.locked=true;input.bowMode=true;canvasEvents.mousedown({button:2});assert.equal(input.bowHeld,true);assert.equal(input.blocking,false);events.mouseup({button:2});assert.equal(input.bowHeld,false);input.bowMode=false;input.guardMode=true;canvasEvents.mousedown({button:2});assert.equal(input.blocking,true);input.clear();assert.equal(input.blocking,false);input.locked=false;input.fallback=true;input.guardMode=false;input.bowMode=true;canvasEvents.mousedown({button:2});assert.equal(input.looking,true);assert.equal(input.bowHeld,false);input.clear();assert.equal(input.looking,false);}finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {Player} from '../src/game/player.js';
import {World,keyOf} from '../src/game/world.js';
function setup(){const world={blocks:new Map(),solid:World.prototype.solid};const input={keys:new Set(),yaw:0,pitch:0};const p=new Player(new T.PerspectiveCamera(),input,world);return {p,input,world};}
test('player settles on yard and cannot fall through bedrock',()=>{const {p}=setup();for(let i=0;i<400;i++)p.step(1/120);assert.ok(Math.abs(p.position.y-2.65)<.04);p.position.set(.5,2,-3);for(let i=0;i<600;i++)p.step(1/120);assert.ok(Math.abs(p.position.y-(-2.35))<.04);});
test('solid voxel wall blocks forward motion',()=>{const {p,input,world}=setup();for(let x=-1;x<=1;x++)for(let y=0;y<5;y++)world.blocks.set(keyOf(x,y,-1),true);input.keys.add('KeyW');for(let i=0;i<300;i++)p.step(1/120);assert.ok(p.position.z>=.28);});
test('mine refill homes player outside regenerated blocks',()=>{const {p,world}=setup();p.position.set(2,-2,-5);p.home();assert.equal(p.fits(p.position),true);assert.equal(world.solid(.5,1.1,2),false);});
test('jump clears a one-block crate and holding jump does not bounce forever',()=>{const {p,input,world}=setup();world.blockers=[new T.Box3(new T.Vector3(0,1,-.6),new T.Vector3(1,2,.4))];for(let i=0;i<20;i++)p.step(1/120);input.keys.add('Space');input.keys.add('KeyW');let top=0;for(let i=0;i<95;i++){p.step(1/120);top=Math.max(top,p.position.y);}assert.ok(top>3.9);assert.ok(p.position.z<-.9,'must pass over crate');input.keys.delete('KeyW');for(let i=0;i<300;i++)p.step(1/120);assert.equal(p.grounded,true);assert.equal(p.velocity,0);});
test('jump buffer catches a press just before landing',()=>{const {p,input}=setup();p.position.y=2.8;p.velocity=-3;input.keys.add('Space');let bounced=false;for(let i=0;i<30;i++){p.step(1/120);if(p.velocity>6)bounced=true;}assert.equal(bounced,true);});
test('movement accelerates and stops without diagonal speed boost',()=>{const {p,input}=setup();for(let i=0;i<20;i++)p.step(1/120);input.keys.add('KeyD');input.keys.add('KeyW');for(let i=0;i<50;i++)p.step(1/120);assert.ok(p.horizontal.length()<=4.31);input.keys.clear();for(let i=0;i<80;i++)p.step(1/120);assert.ok(p.horizontal.length()<.01);});

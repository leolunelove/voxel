import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {Pickups} from '../src/game/pickups.js';
import {freshState,bagCount} from '../src/game/rules.js';
test('ore travels toward the miner and collects once on arrival',()=>{const scene=new T.Scene(),drops=new Pickups(scene),state=freshState();drops.spawn(new T.Vector3(0,0,-4),2);assert.equal(bagCount(state),0);let arrivals=0;for(let i=0;i<300;i++)drops.update(1/120,new T.Vector3(0,2,0),state,()=>arrivals++);assert.equal(drops.count,0);assert.equal(bagCount(state),1);assert.equal(arrivals,1);assert.equal(scene.children.length,0);});
test('save snapshot includes pending ore without mutating live inventory',()=>{const drops=new Pickups(new T.Scene()),state=freshState();drops.spawn(new T.Vector3(),1);assert.deepEqual(drops.snapshot(state).inventory,[0,1,0,0,0,0,0,0,0]);assert.deepEqual(state.inventory,[0,0,0,0,0,0,0,0,0]);drops.flush(state);assert.deepEqual(state.inventory,[0,1,0,0,0,0,0,0,0]);drops.flush(state);assert.equal(bagCount(state),1);});

import {test} from 'node:test';import assert from 'node:assert/strict';import * as T from '../vendor/three.module.js';
import {arrowImpact,impactRecoil,pushDistance} from '../src/game/arrow-impact.js';
import {embedArrow,updateArrows} from '../src/game/embedded-arrows.js';
import {Hunt} from '../src/game/hunt.js';import {Archery} from '../src/game/archery.js';import {freshHunt} from '../src/game/hunt-rules.js';
const create=(type=0)=>{const scene=new T.Scene(),state=freshHunt(),hunt=new Hunt(scene,state,{spawns:[[0,0,0,type]],bounds:[-3,3,-3,3],active:()=>true});return {scene,state,hunt,e:hunt.enemies[0]};};
test('full power has a stronger flinch and shove; armor and bosses retain their weight',()=>{
 const weak=arrowImpact(.25),full=arrowImpact(1),heavy=arrowImpact(1,true),boss=arrowImpact(1,false,true);
 assert.ok(full.push>weak.push*2);assert.ok(full.strength>weak.strength*2);assert.ok(full.stagger>weak.stagger);assert.ok(heavy.push<full.push);assert.ok(boss.push<heavy.push);assert.equal(boss.stagger,0);
 assert.ok(impactRecoil(.28)>.6,'recoil peaks within the first 20ms');assert.ok(impactRecoil(.06)<.1);assert.equal(impactRecoil(0),0);
 for(const fps of [30,60,120]){let speed=full.push,distance=0;for(let i=0;i<fps;i++){distance+=speed*pushDistance(1/fps);speed*=Math.exp(-10/fps);}assert.ok(Math.abs(distance-full.push*(1-Math.exp(-10))/10)<1e-8);}
});
test('contact anchor follows a rotated scaled limb while the shaft rings, settles and fades',()=>{
 const {hunt,e}=create();e.root.rotation.y=.8;e.root.scale.setScalar(1.22);e.body.rotation.z=.2;e.root.updateMatrixWorld(true);
 const localPoint=new T.Vector3(.12,.1,.325),point=e.body.localToWorld(localPoint.clone()),velocity=new T.Vector3(-.4,0,-1).normalize();embedArrow(e,e.body,point,velocity,1);const a=e.embeddedArrows[0];e.root.updateMatrixWorld(true);
 assert.ok(a.root.getWorldPosition(new T.Vector3()).distanceTo(point)<1e-6);const tip=a.root.localToWorld(new T.Vector3(0,0,arrowImpact(1).penetration));assert.ok(tip.clone().sub(point).normalize().dot(velocity)>.999);
 e.root.position.x=2;e.root.rotation.y=-.6;e.body.rotation.x=.45;updateArrows(e,.02);e.root.updateMatrixWorld(true);assert.ok(Math.abs(a.shaft.rotation.x)>.01);assert.ok(a.root.getWorldPosition(new T.Vector3()).distanceTo(e.body.localToWorld(localPoint.clone()))<1e-6);
 updateArrows(e,.8);assert.ok(Math.abs(a.shaft.rotation.x)<.0001);updateArrows(e,8.5,true);assert.equal(a.shaft.rotation.x,0);assert.ok(a.shaft.children[0].material.opacity<1);hunt.dispose();assert.equal(e.embeddedArrows.length,0);
});
test('projectile passes charge and incoming direction once, and contact cannot be farmed for loot',()=>{
 const {scene,state,hunt,e}=create(),a=new Archery(scene,state,()=>{}),c=new T.PerspectiveCamera();c.position.set(0,1.85,3);c.lookAt(0,1.85,0);c.updateMatrixWorld();scene.updateMatrixWorld(true);a.combatTargets=hunt.targets;let hits=0;
 a.onEnemyHit=(enemy,source,damage,point,impact)=>{hits++;assert.equal(impact.charge,1);assert.ok(impact.velocity.z<0);hunt.strike(enemy,source,damage,'archery',impact);};a.fire(c,1);for(let i=0;i<40;i++)a.update(.01,false,c,true,{obstructed:()=>false});assert.equal(hits,1);assert.equal(e.embeddedArrows.length,1);assert.equal(state.loot,0);assert.equal(e.hp,26);assert.ok(e.push.y<0);a.reset();hunt.dispose();
});
test('knockback uses flight direction, interrupts ordinary attacks, and stays within the room',()=>{
 const {hunt,e}=create();e.windup=.1;e.lunge=.2;e.root.position.x=2.99;hunt.strike(e,new T.Vector3(0,2,3),1,'archery',{charge:1,velocity:new T.Vector3(1,0,0)});assert.equal(e.windup,0);assert.equal(e.lunge,0);assert.ok(e.stagger>.3);assert.ok(e.push.x>8);assert.equal(e.push.y,0);hunt.update(.02,new T.Vector3(2.99,2.65,2));assert.ok(e.root.position.x<=3);assert.ok(Math.abs(e.root.rotation.z)>.01);hunt.dispose();
 const b=create(2);b.e.windup=.8;b.hunt.strike(b.e,new T.Vector3(0,2,3),1,'archery',{charge:1,velocity:new T.Vector3(0,0,-1)});assert.equal(b.e.windup,.8);assert.equal(b.e.stagger,0);assert.ok(b.e.push.length()<1.1);b.hunt.dispose();
});
test('lethal full-power shots reward once and embedded arrows clear on reset',()=>{
 const {hunt,e,state}=create();embedArrow(e,e.body,new T.Vector3(0,1.8,.325),new T.Vector3(0,0,-1),1);assert.equal(hunt.strike(e,new T.Vector3(0,2,3),52,'archery',{charge:1,velocity:new T.Vector3(0,0,-1)}),true);assert.equal(state.loot,18);assert.equal(state.archeryXP,12);assert.equal(hunt.strike(e,null,52,'archery'),false);assert.equal(state.loot,18);hunt.update(.2,new T.Vector3(0,2.65,3));assert.ok(e.root.rotation.z>.2);hunt.reset();assert.equal(e.embeddedArrows.length,0);assert.equal(e.push.length(),0);assert.equal(e.root.rotation.z,0);hunt.dispose();
});

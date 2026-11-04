import {swordContact} from '../src/engine/melee-contact.js';
function canvas(){return {width:128,height:128,getContext:()=>({clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fillRect(){}})};}globalThis.document={createElement:canvas};
import {test} from 'node:test';import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {Feedback} from '../src/engine/feedback.js';
import {Hunt} from '../src/game/hunt.js';
import {freshHunt} from '../src/game/hunt-rules.js';
import {swordCadence,deathPose} from '../src/game/melee-impact.js';
import {heldPose,SWORD_TIP,TOOL_SCALE} from '../src/engine/pickaxe.js';

test('one sword contact per cycle at both 30 and 144Hz; no damage during windup or tool switch',()=>{
 for(const hz of [30,144]){const f=new Feedback(new T.Scene());let contacts=0,first=-1;for(let i=0;i<hz*2;i++){if(f.update(1/hz,true,0,false,null,'sword')){contacts++;if(first<0)first=i/hz;}}assert.equal(contacts,4);assert.ok(first>=.10&&first<.19);f.update(.01,true,0,false,null,'axe');assert.equal(f.update(.01,true,0,false,null,'sword'),false);}
 assert.ok(swordCadence(3)<swordCadence(0));
});
test('sword reaches the reticle, holds contact, and recoils without changing a moving camera',()=>{
 for(const aspect of [.9,16/9]){const tipAt=p=>{const pose=heldPose(p,aspect,1,'sword');return SWORD_TIP.clone().multiplyScalar(TOOL_SCALE).applyEuler(new T.Euler(...pose.rotation)).add(new T.Vector3(...pose.position));};const lift=tipAt(.18),hit=tipAt(.30),after=tipAt(.60);assert.ok(lift.y>.2&&hit.y<.001&&hit.z<lift.z-.3);assert.ok(hit.distanceTo(tipAt(.33))<1e-8);assert.ok(after.z>hit.z+.2);}
 const f=new Feedback(new T.Scene()),camera=new T.PerspectiveCamera(72,16/9,.05,100);for(let i=0;i<80;i++){camera.position.set(i*.02,2.65+Math.sin(i*.1),0);camera.rotation.set(-.2,i*.01,0);camera.updateMatrixWorld();const pos=camera.position.clone(),rotation=camera.quaternion.clone(),point=new T.Vector3(0,0,-2).applyMatrix4(camera.matrixWorld);f.update(1/60,true,0,true,{camera,point},'sword');assert.ok(camera.position.equals(pos)&&camera.quaternion.equals(rotation));}
});
test('melee interrupts ordinary windups, preserves boss attacks and scales heavy knockback',()=>{
 const h=new Hunt(new T.Scene(),freshHunt(),{spawns:[[0,0,0,0],[1,3,0,1],[2,-3,0,2]],active:()=>true,bounds:[-8,8,-8,8],respawn:false}),p=new T.Vector3(0,2.65,3);for(const e of h.enemies){e.windup=.5;h.strike(e,p,1);assert.ok(e.hit>0);assert.equal(e.windup,e.stats.boss?.5:0);}assert.ok(h.enemies[0].push.length()>h.enemies[1].push.length());assert.ok(h.enemies[1].push.length()>h.enemies[2].push.length()*3);h.dispose();
});
test('finisher completes collapse before shrinking; rewards and magnetic tokens award exactly once',()=>{
 assert.equal(deathPose(.5).scale,1);assert.ok(deathPose(.72).collapse>.95);assert.ok(deathPose(1).scale<.03);
 const s=freshHunt(),h=new Hunt(new T.Scene(),s,{spawns:[[0,0,0,0]],active:()=>true,respawn:false}),e=h.enemies[0],p=new T.Vector3(0,2.65,3);h.strike(e,p,100);assert.equal(s.loot,18);h.strike(e,p,100);assert.equal(s.kills,1);for(let i=0;i<300;i++)h.update(1/60,p);assert.equal(s.loot,18);assert.equal(s.xp,12);assert.equal(h.loot.items.length,0);assert.equal(e.root.visible,false);h.dispose();
});
test('contact effects are bounded and reduced motion removes weapon pause',()=>{
 const f=new Feedback(new T.Scene()),p=new T.Vector3(0,2,0),source=new T.Vector3(0,2,2);for(let i=0;i<30;i++)f.meleeContact(p,source,0,true);assert.equal(f.particles.length,160);f.confirmHit(true);assert.ok(f.contactStop>.04);f.reduced=true;f.confirmHit(true);assert.equal(f.contactStop,0);for(let i=0;i<60;i++)f.update(1/60,false,0,false,null,'sword');assert.equal(f.particles.length,0);
});

test('blade-width sweep catches a near miss, requires real surface contact and never reaches through a wall',()=>{const camera=new T.PerspectiveCamera(72,16/9,.05,100),ray=new T.Raycaster(),m=new T.Mesh(new T.BoxGeometry(.25,.7,.4));m.position.set(.36,0,-2);m.updateMatrixWorld();camera.updateMatrixWorld();const open={obstructed:()=>false};assert.ok(swordContact(ray,camera,[m],open));assert.equal(swordContact(ray,camera,[m],{obstructed:()=>true}),null);m.position.z=-4;m.updateMatrixWorld();assert.equal(swordContact(ray,camera,[m],open),null);m.position.set(2,0,-2);m.updateMatrixWorld();assert.equal(swordContact(ray,camera,[m],open),null);});

test('a slow frame cannot slide the blade past contact during its hit pause',()=>{const f=new Feedback(new T.Scene());f.setTier(0,'sword');f.equip=0;f.phase=.40;f.swinging=true;f.contactStop=.05;f.update(.03,false,0,false,null,'sword');const pose=heldPose(.30,1,1,'sword');for(let i=0;i<3;i++)assert.ok(Math.abs(f.pivot.position.getComponent(i)-pose.position[i])<1e-8);assert.equal(f.phase,.40);});

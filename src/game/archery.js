import {bowMuzzle,ballisticVelocity} from '../engine/bow-space.js?v=69';
import {BOWS,arrowDamage} from './weapons.js?v=69';
import * as T from '../../vendor/three.module.js';
import {shotXP} from './dungeon-rules.js?v=69';
import {embedArrow} from './embedded-arrows.js?v=69';
export class Archery{
 constructor(scene,state,onScore,onFire=()=>{}){this.onFire=onFire;this.scene=scene;this.state=state;this.onScore=onScore;this.targets=[];this.arrows=[];this.impacts=[];this.charge=0;this.wasHeld=false;this.cooldown=0;this.geometry=new T.BoxGeometry(.035,.035,.65).translate(0,0,-.325);this.headGeometry=new T.ConeGeometry(.055,.13,4);this.featherGeometry=new T.BoxGeometry(.12,.012,.14);this.arrowTrim=new T.MeshLambertMaterial({color:0xbcbda3});this.material=new T.MeshLambertMaterial({color:0xd7bd81});this.root=new T.Group();scene.add(this.root);
  for(const z of [5.8,9,12.2]){const target=new T.Mesh(new T.CylinderGeometry(.9,.9,.15,24),new T.MeshLambertMaterial({color:0xd6c9a7}));target.rotation.z=Math.PI/2;target.position.set(35,2.5,z);target.userData.ready=0;this.root.add(target);this.targets.push(target);
   for(const [radius,color,x]of [[.65,0x945c42,34.91],[.40,0xd6c9a7,34.90],[.21,0xbc754b,34.89]]){const disc=new T.Mesh(new T.CircleGeometry(radius,24),new T.MeshBasicMaterial({color,side:T.DoubleSide}));disc.rotation.y=-Math.PI/2;disc.position.set(x,2.5,z);this.root.add(disc);this.targets.push(disc);disc.userData.target=target;}
  }
 }
 reset(){this.cancel();for(const a of this.arrows)a.mesh.removeFromParent();for(const a of this.impacts){a.mesh.removeFromParent();a.mesh.material.dispose();}this.impacts=[];this.arrows=[];}
 cancel(){this.charge=0;this.wasHeld=false;this.cooldown=0;}
 update(dt,held,camera,enabled,world){this.cooldown=Math.max(0,this.cooldown-dt);this.targets.forEach(t=>{if(t.userData.ready>0)t.userData.ready-=dt;});if(!enabled)this.cancel();else{if(held&&this.cooldown===0){const before=this.charge;this.charge=Math.min(1,this.charge+dt/BOWS[this.state.bow??0].draw);if(Math.floor(before*3)<Math.floor(this.charge*3)&&this.charge<1)this.onTension?.(this.charge);if(before<1&&this.charge===1)this.onReady?.();}if(!held&&this.wasHeld){if(this.charge>=.18&&this.cooldown===0)this.fire(camera,this.charge,world);this.charge=0;}this.wasHeld=held;}
  for(const t of this.targets){if(t.userData.target)continue;const pulse=Math.max(0,t.userData.ready??0)/.35;t.scale.setScalar(1+pulse*.06);t.material.color.setHex(pulse>0?0xffdf92:0xd6c9a7);}for(let i=this.impacts.length-1;i>=0;i--){const a=this.impacts[i];a.life-=dt;a.mesh.material.opacity=Math.min(1,a.life*2);if(a.life<=0){a.mesh.removeFromParent();a.mesh.material.dispose();this.impacts.splice(i,1);}}this.root.updateMatrixWorld(true);for(let i=this.arrows.length-1;i>=0;i--){const a=this.arrows[i];a.life-=dt;a.velocity.y-=1.6*dt;const travel=a.velocity.clone().multiplyScalar(dt),length=travel.length(),ray=new T.Raycaster(a.mesh.position,travel.clone().normalize(),0,length);const hit=length>0?ray.intersectObjects([...this.targets,...(this.combatTargets??[]).filter(m=>!m.userData.enemy.dead&&m.userData.enemy.root.visible)],false)[0]:null;let remove=a.life<=0;
   if(hit&&world.obstructed(ray.ray,hit.distance)){this.wallImpact(ray.ray,hit.distance,a.charge,world);remove=true;}else if(hit?.object.userData.enemy){embedArrow(hit.object.userData.enemy,hit.object,hit.point,a.velocity);this.onEnemyHit?.(hit.object.userData.enemy,a.source,a.damage,hit.point);remove=true;}else if(hit){const target=hit.object.userData.target??hit.object;if(target.userData.ready<=0){const radius=Math.hypot(hit.point.y-2.5,hit.point.z-target.position.z),xp=shotXP(a.charge,radius);this.state.archeryXP+=xp;target.userData.ready=.35;this.onScore(xp,radius);}a.mesh.position.copy(hit.point);a.mesh.material=this.material.clone();a.mesh.material.transparent=true;this.impacts.push({mesh:a.mesh,life:1.6});this.arrows.splice(i,1);continue;}
   else if(length>0&&world.obstructed(ray.ray,length)){this.wallImpact(ray.ray,length,a.charge,world);remove=true;}
   if(remove){a.mesh.removeFromParent();this.arrows.splice(i,1);}else{a.mesh.position.add(travel);a.mesh.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),a.velocity.clone().normalize());}
  }
 }
 wallImpact(ray,distance,charge,world){let low=0,high=distance;for(let i=0;i<8;i++){const mid=(low+high)/2;if(world.obstructed(ray,mid))high=mid;else low=mid;}this.onWallHit?.(ray.at(low,new T.Vector3()),charge);}
 fire(camera,charge,world=null){
 camera.updateMatrixWorld();this.root.updateMatrixWorld(true);for(const m of this.combatTargets??[])m.userData.enemy.root.updateMatrixWorld(true);
 const forward=new T.Vector3();camera.getWorldDirection(forward);const ray=new T.Raycaster(camera.position,forward,0,40),targets=[...this.targets,...(this.combatTargets??[]).filter(m=>!m.userData.enemy.dead&&m.userData.enemy.root.visible)];
 let distance=ray.intersectObjects(targets,false)[0]?.distance??40;
 if(world?.obstructed(ray.ray,distance)){let low=0,high=distance;for(let i=0;i<10;i++){const mid=(low+high)/2;if(world.obstructed(ray.ray,mid))high=mid;else low=mid;}distance=Math.max(.1,low);}
 const aim=ray.ray.at(distance,new T.Vector3()),origin=bowMuzzle(camera,charge),muzzleTravel=origin.clone().sub(camera.position);
 if(world?.obstructed(new T.Ray(camera.position,muzzleTravel.clone().normalize()),muzzleTravel.length()))origin.copy(camera.position).addScaledVector(forward,.06);
 const speed=BOWS[this.state.bow??0].speed*(.55+.45*charge),velocity=ballisticVelocity(origin,aim,speed),mesh=new T.Mesh(this.geometry,this.material);
 const head=new T.Mesh(this.headGeometry,this.arrowTrim);head.rotation.x=Math.PI/2;head.position.z=-.04;mesh.add(head);for(const angle of [0,Math.PI*2/3,Math.PI*4/3]){const feather=new T.Mesh(this.featherGeometry,this.arrowTrim);feather.rotation.z=angle;feather.position.z=-.59;mesh.add(feather);}
 mesh.position.copy(origin);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),velocity.clone().normalize());this.scene.add(mesh);this.arrows.push({mesh,velocity,charge,source:camera.position.clone(),damage:arrowDamage(this.state,charge),life:2});this.cooldown=.22;this.onFire(charge);
 }
}

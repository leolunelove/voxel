import * as T from '../../vendor/three.module.js';
import {BLOCKS,collect} from './rules.js?v=63.1';
// Pending ore reserves capacity. The snapshot includes it so reloads never lose a haul.
export class Pickups{
 constructor(scene,materials){this.scene=scene;this.pending=[];this.geometry=new T.BoxGeometry(.12,.12,.12);this.materials=materials??BLOCKS.map(b=>new T.MeshStandardMaterial({color:b.color,roughness:.55,emissive:b.color,emissiveIntensity:.12}));}
 get count(){return this.pending.length;}
 spawn(position,type){const mesh=new T.Mesh(this.geometry,this.materials[type]);mesh.position.copy(position);mesh.rotation.set(.4,.6,.2);this.scene.add(mesh);this.pending.push({mesh,type,age:0,v:new T.Vector3((Math.random()-.5)*1.5,2.4,(Math.random()-.5)*1.5)});}
 snapshot(state){const s=structuredClone(state);for(const d of this.pending)s.inventory[d.type]++;return s;}
 take(index,state,onCollect){const [d]=this.pending.splice(index,1);this.scene.remove(d.mesh);if(!collect(state,d.type))throw new Error('Reserved pickup capacity was lost');onCollect?.(d.type);}
 flush(state,onCollect){while(this.pending.length)this.take(0,state,onCollect);}
 update(dt,player,state,onCollect,reduced=false){const destination=player.clone().add(new T.Vector3(0,-.65,0));for(let i=this.pending.length-1;i>=0;i--){const d=this.pending[i];d.age+=dt;
 if(d.age<.20&&!reduced){d.v.y-=8*dt;d.mesh.position.addScaledVector(d.v,dt);}
 else{const delta=destination.clone().sub(d.mesh.position),distance=delta.length(),travel=(5+Math.max(0,d.age-.2)*22)*dt;if(distance<travel+.28){this.take(i,state,onCollect);continue;}d.mesh.position.addScaledVector(delta,travel/distance);d.mesh.scale.setScalar(Math.max(.35,Math.min(1,distance*1.5)));}
 d.mesh.rotation.x+=dt*2;d.mesh.rotation.y+=dt*4;
 }}
}

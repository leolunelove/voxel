import * as T from '../../vendor/three.module.js';
import {arrowImpact} from './arrow-impact.js?v=73.2';
export function clearArrows(enemy){while(enemy.embeddedArrows?.length)removeOldest(enemy);enemy.embeddedArrows=[];}
function removeOldest(enemy){const a=enemy.embeddedArrows.shift();if(!a)return;a.root.removeFromParent();a.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}
export function embedArrow(enemy,host,point,velocity,charge=1){
 if(enemy.dead||velocity.lengthSq()<1e-10)return;enemy.embeddedArrows??=[];while(enemy.embeddedArrows.length>=6)removeOldest(enemy);
 const root=new T.Group(),shaft=new T.Group(),direction=velocity.clone().normalize(),impact=arrowImpact(charge);root.name='embedded-arrow';shaft.name='lodged-shaft';root.add(shaft);
 const part=(size,z,color)=>{const mesh=new T.Mesh(new T.BoxGeometry(...size),new T.MeshLambertMaterial({color,transparent:true}));mesh.position.z=z;shaft.add(mesh);return mesh;};
 part([.035,.035,.65],impact.penetration-.325,0xb99760);part([.055,.055,.10],impact.penetration-.05,0x768b90);part([.14,.016,.15],impact.penetration-.59,0xe8d9ae);part([.016,.14,.15],impact.penetration-.59,0xe8d9ae);
 // The pivot is exactly the surface contact. Only the shaft vibrates around it.
 root.position.copy(point);root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),direction);
 host.updateWorldMatrix(true,false);const local=new T.Matrix4().copy(host.matrixWorld).invert().multiply(new T.Matrix4().compose(root.position,root.quaternion,root.scale));local.decompose(root.position,root.quaternion,root.scale);host.add(root);
 enemy.embeddedArrows.push({root,shaft,age:0,life:10,wobble:impact.wobble});
}
export function updateArrows(enemy,dt,reduced=false){
 for(const a of enemy.embeddedArrows??[]){a.life-=dt;a.age+=dt;const ring=reduced?0:Math.sin(a.age*75)*Math.exp(-a.age*12)*a.wobble;a.shaft.rotation.set(ring,ring*.45,0);const opacity=Math.min(1,Math.max(0,a.life));a.shaft.children.forEach(m=>m.material.opacity=opacity);}
 while(enemy.embeddedArrows?.length&&(enemy.embeddedArrows[0].life<=0||!enemy.root.visible))removeOldest(enemy);
}

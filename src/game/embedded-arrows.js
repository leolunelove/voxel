import * as T from '../../vendor/three.module.js';
export function clearArrows(enemy){for(const a of enemy.embeddedArrows??[]){a.root.removeFromParent();a.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}enemy.embeddedArrows=[];}
function removeOldest(enemy){const a=enemy.embeddedArrows.shift();if(!a)return;a.root.removeFromParent();a.root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}
export function embedArrow(enemy,host,point,velocity){
 if(enemy.dead)return;enemy.embeddedArrows??=[];while(enemy.embeddedArrows.length>=6)removeOldest(enemy);
 const root=new T.Group(),direction=velocity.clone().normalize();root.name='embedded-arrow';
 const part=(size,z,color)=>{const mesh=new T.Mesh(new T.BoxGeometry(...size),new T.MeshLambertMaterial({color}));mesh.position.z=z;root.add(mesh);return mesh;};
 part([.038,.038,.68],0,0xb99760);part([.065,.065,.12],.29,0x768b90);part([.14,.018,.16],-.25,0xe8d9ae);part([.018,.14,.16],-.25,0xe8d9ae);
 root.position.copy(point).addScaledVector(direction,-.26);root.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),direction);
 // Convert the world-space contact into the struck limb local space.
 host.updateWorldMatrix(true,false);const local=new T.Matrix4().copy(host.matrixWorld).invert().multiply(new T.Matrix4().compose(root.position,root.quaternion,root.scale));local.decompose(root.position,root.quaternion,root.scale);host.add(root);
 enemy.embeddedArrows.push({root,life:8});
}
export function updateArrows(enemy,dt){for(const a of enemy.embeddedArrows??[])a.life-=dt;while(enemy.embeddedArrows?.length&&(enemy.embeddedArrows[0].life<=0||!enemy.root.visible))removeOldest(enemy);}

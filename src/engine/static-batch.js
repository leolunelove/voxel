import * as T from '../../vendor/three.module.js';
// Immutable scenery only. Gameplay meshes, moving gates, lamps and plot roots are excluded.
export function batchScenery(root,geometry,excluded=[]){
 const skip=new Set(excluded),groups=new Map(),p=new T.Vector3();root.updateMatrixWorld(true);
 function visit(o){if(skip.has(o))return;if(o.isMesh&&!o.isInstancedMesh&&o.geometry===geometry&&!o.children.length&&!o.userData.key&&!o.userData.prisonBulb&&!Array.isArray(o.material)&&!o.material.transparent){o.getWorldPosition(p);const key=[o.material.uuid,o.castShadow,o.receiveShadow,Math.floor(p.x/12),Math.floor(p.z/12)].join(':');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);}for(const c of o.children)visit(c);}visit(root);
 let objects=0,batches=0;const inverse=root.matrixWorld.clone().invert(),matrix=new T.Matrix4();
 for(const meshes of groups.values()){if(meshes.length<3)continue;const first=meshes[0],batch=new T.InstancedMesh(geometry,first.material,meshes.length);batch.name='Batched static scenery';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;meshes.forEach((m,i)=>{matrix.multiplyMatrices(inverse,m.matrixWorld);batch.setMatrixAt(i,matrix);m.removeFromParent();});batch.computeBoundingSphere();batch.matrixAutoUpdate=false;root.add(batch);objects+=meshes.length;batches++;}
 return {objects,batches};
}

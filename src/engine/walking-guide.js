import * as T from '../../vendor/three.module.js';
export class WalkingGuide{
 constructor(scene){
  const s=new T.Shape();s.moveTo(-.22,-.09);s.lineTo(0,.12);s.lineTo(.22,-.09);s.lineTo(.22,.055);s.lineTo(0,.27);s.lineTo(-.22,.055);s.closePath();
  const geometry=new T.ShapeGeometry(s);geometry.rotateX(-Math.PI/2);
  this.material=new T.MeshBasicMaterial({color:0xedc084,transparent:true,opacity:.66,depthWrite:false,side:T.DoubleSide});
  this.marks=new T.InstancedMesh(geometry,this.material,5);this.marks.name='Duty walking indicators';this.marks.frustumCulled=false;scene.add(this.marks);this.pose=new T.Object3D();
  this.panel=document.createElement('div');this.panel.id='walking-guide';this.panel.hidden=true;this.panel.setAttribute('aria-label','Walking directions');
  this.panel.innerHTML='<svg class="walk-person" viewBox="0 0 24 24" aria-hidden="true"><circle cx="14" cy="4" r="2"/><path d="m12 8-3 5-4 1m6-3 5 3 4-1m-8 0-2 5-4 3m7-6 3 3 1 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg><div><small>NEXT CHECKPOINT</small><strong></strong></div><span></span><i aria-hidden="true">↑</i>';
  this.label=this.panel.querySelector('strong');this.distance=this.panel.querySelector('span');this.arrow=this.panel.querySelector('i');document.body.append(this.panel);
 }
 update(dt,p,yaw,target,world,visible,reduced=false){
  const distance=target?Math.hypot(target.x-p.x,target.z-p.z):0,show=!!(visible&&target&&distance>.85);
  this.panel.hidden=!show;this.marks.visible=show;if(!show)return;
  if(this.label.textContent!==target.name)this.label.textContent=target.name;
  const label=Math.max(1,Math.round(distance))+' m';if(this.distance.textContent!==label)this.distance.textContent=label;
  const dx=(target.x-p.x)/distance,dz=(target.z-p.z)/distance,bearing=Math.atan2(-dx,-dz),delta=Math.atan2(Math.sin(bearing-yaw),Math.cos(bearing-yaw));
  this.arrow.style.transform='rotate('+(-delta)+'rad)';
  const count=Math.max(0,Math.min(5,Math.floor((distance-.3)/.8)));this.marks.count=count;
  for(let i=0;i<count;i++){
   const along=1+i*.8;if(along>distance-.15){this.marks.count=i;break;}
   const x=p.x+dx*along,z=p.z+dz*along;
   this.pose.position.set(x,world.stepHeight(x,z)+.028,z);this.pose.rotation.set(0,bearing,0);this.pose.scale.setScalar(.8+i*.04);this.pose.updateMatrix();this.marks.setMatrixAt(i,this.pose.matrix);
  }
  this.marks.instanceMatrix.needsUpdate=true;
 }
}

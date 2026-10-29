import {BlockFracture} from './block-fracture.js?v=78.3';
import * as T from '../../vendor/three.module.js';
import {createPickaxe,createAxe,createSword,createBow,SWORD_TIP,BOW_SCALE,heldPose,TOOL_SCALE,AXE_TIP,CONTACT_TIP,contactPivot} from './pickaxe.js?v=78.3';
import {PICKS} from '../game/rules.js?v=78.3';
import {bowRig,applyBowRig} from './bow-motion.js?v=78.3';
import {createShield} from './shield.js?v=78.3';
export class Feedback{
 constructor(scene){
 this.scene=scene;this.particles=[];this.geometry=new T.BoxGeometry(1,1,1);this.materials=new Map();this.reduced=false;this.phase=0;this.swinging=false;this.time=0;this.kick=0;this.equip=0;this.tier=-1;
 this.view=new T.Scene();this.camera=new T.PerspectiveCamera(48,1,.01,10);
 this.view.add(new T.HemisphereLight(0xe8f3f2,0x576657,1.5));const key=new T.DirectionalLight(0xffe2b0,1.8);key.position.set(-2,3,4);this.view.add(key);const rim=new T.DirectionalLight(0xb1dded,.8);rim.position.set(3,1,-2);this.view.add(rim);
 this.pivot=new T.Group();this.view.add(this.pivot);this.setTier(0);
 this.outline=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.006,1.006,1.006)),new T.LineBasicMaterial({color:0xf4dea6,transparent:true,opacity:.7}));scene.add(this.outline);this.outline.visible=false;
 this.fracture=new BlockFracture(scene);
 }

 setTier(tier,kind='pick'){if(tier===this.tier&&kind===this.kind)return;if(this.tool){this.pivot.remove(this.tool);const mats=new Set();this.tool.traverse(o=>{o.geometry?.dispose();if(o.material)mats.add(o.material);});mats.forEach(m=>m.dispose());}this.tier=tier;this.kind=kind;this.tool=kind==='bow'?createBow(tier):kind==='sword'?createSword(tier):kind==='axe'?createAxe(tier):createPickaxe(tier);this.tool.scale.setScalar(kind==='bow'?BOW_SCALE:TOOL_SCALE);this.pivot.add(this.tool);this.equip=1;}
 updateShield(dt,enabled,guard,tier=0){
 if(this.shieldTier!==tier){if(this.shield){this.shield.removeFromParent();const mats=new Set();this.shield.traverse(o=>{o.geometry?.dispose();if(o.material)mats.add(o.material);});mats.forEach(m=>m.dispose());}this.shield=createShield(tier);this.shield.scale.setScalar(.60);this.view.add(this.shield);this.shieldTier=tier;}
 this.shield.visible=enabled;if(!enabled)return;this.shieldRaise=(this.shieldRaise??0)+(Number(guard.held)-(this.shieldRaise??0))*(1-Math.exp(-dt*18));const up=this.shieldRaise,kick=this.reduced?0:Math.sin(Math.min(1,guard.flash/.24)*Math.PI)*.09;
 this.shield.position.set(-.55+up*.15,-.40+up*.25,-1.15+up*.12+kick);this.shield.rotation.set(.06-up*.12,.35-up*.22,-.18+up*.13);if(guard.event==='broken'&&guard.flash>0&&!this.reduced)this.shield.rotation.z-=.2;}
 target(mesh,progress=0){
 this.outline.visible=!!mesh;if(mesh){mesh.updateWorldMatrix(true,false);this.outline.matrixAutoUpdate=false;this.outline.matrix.copy(mesh.matrixWorld);this.outline.matrixWorldNeedsUpdate=true;}
 this.fracture.target(progress>0?mesh:null);
 }
 blockImpact(mesh,point,normal,color,progress,broken=false){
 if(!broken)this.fracture.hit(mesh,point,normal,progress,{tier:this.tier,exposure:mesh.userData.exposure??0});
 const n=normal.clone().normalize(),tangent=new T.Vector3().crossVectors(n,Math.abs(n.y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0)).normalize(),bitangent=new T.Vector3().crossVectors(n,tangent);
 const count=this.reduced?(broken?6:2):(broken?22:5),wood=mesh.userData.type===8;
 for(let i=0;i<count&&this.particles.length<160;i++){
  const tint=i%3===0?color:wood?0x947047:i%2?0x566465:0x89918b;
  let material=this.materials.get(tint);if(!material){material=new T.MeshStandardMaterial({color:tint,roughness:1});this.materials.set(tint,material);}
  const m=new T.Mesh(this.geometry,material),size=(broken?.065:.025)+Math.random()*(broken?.065:.035),spread=broken?.20:.055;
  m.scale.set(size,size*(wood?.35:.55),size*(.5+Math.random()*.5));m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
  m.position.copy(point).addScaledVector(n,.025).addScaledVector(tangent,(Math.random()-.5)*spread).addScaledVector(bitangent,(Math.random()-.5)*spread);
  const v=n.clone().multiplyScalar((broken?1.8:1.2)+Math.random()*1.8).addScaledVector(tangent,(Math.random()-.5)*(broken?3.2:1.5)).addScaledVector(bitangent,(Math.random()-.5)*1.6);v.y+=.55;
  const life=this.reduced?.18:(broken?.42:.24)+Math.random()*.16;this.scene.add(m);this.particles.push({m,v,life,maxLife:life,initial:m.scale.clone(),spin:new T.Vector3((Math.random()-.5)*15,(Math.random()-.5)*15,(Math.random()-.5)*15)});
 }
 // Recoil belongs to the held tool; movement and the world camera stay free.
 this.kick=this.reduced?0:broken?.65:.32;
 }

 burst(position,color,small=false){
 let mat=this.materials.get(color);if(!mat){mat=new T.MeshStandardMaterial({color,roughness:.95});this.materials.set(color,mat);}
 const count=this.reduced?2:small?2:12;
 for(let i=0;i<count&&this.particles.length<160;i++){const m=new T.Mesh(this.geometry,mat),size=small?.025+Math.random()*.035:.04+Math.random()*.1;m.scale.set(size,size*(.5+Math.random()),size);m.position.copy(position);m.position.add(new T.Vector3((Math.random()-.5)*.35,(Math.random()-.5)*.35,(Math.random()-.5)*.35));m.rotation.set(Math.random()*3,Math.random()*3,0);this.scene.add(m);this.particles.push({m,v:new T.Vector3((Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3),life:small?.22:.45+Math.random()*.25});}
 if(!small)this.kick=1;
 }
 arrowImpact(point,velocity,charge=1,armored=false){
 const color=armored?0xffd48a:0xc7b38b;let mat=this.materials.get(color);if(!mat){mat=new T.MeshStandardMaterial({color,roughness:.65,emissive:color,emissiveIntensity:armored?.8:.15});this.materials.set(color,mat);}
 const count=this.reduced?2:Math.round(4+charge*7),out=velocity.clone().normalize().multiplyScalar(-1);
 for(let i=0;i<count&&this.particles.length<160;i++){
  const m=new T.Mesh(this.geometry,mat),size=.018+Math.random()*.025;m.scale.set(size,size*(armored?3:1.3),size);m.position.copy(point).addScaledVector(out,.025);m.rotation.set(Math.random()*3,Math.random()*3,0);this.scene.add(m);
  const v=out.clone().multiplyScalar(.7+charge*1.5).add(new T.Vector3((Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2)),life=this.reduced?.12:.14+Math.random()*.12;
  this.particles.push({m,v,life,maxLife:life,initial:m.scale.clone(),spin:new T.Vector3(6,9,3)});
 }
 }
 treeBreak(tree){
 tree.visual.updateWorldMatrix(true,false);
 const leaves=tree.visual.children.filter(m=>m.userData.canopy),count=this.reduced?3:15;
 for(let i=0;i<count&&this.particles.length<160;i++){
  const leaf=leaves[i%leaves.length];if(!leaf)break;const color=leaf.material.color.getHex();let mat=this.materials.get(color);if(!mat){mat=new T.MeshStandardMaterial({color,roughness:1});this.materials.set(color,mat);}
  const m=new T.Mesh(this.geometry,mat),size=.10+Math.random()*.12;m.scale.set(size,size*.45,size);m.position.copy(leaf.getWorldPosition(new T.Vector3())).add(new T.Vector3((Math.random()-.5)*2,(Math.random()-.5)*.7,(Math.random()-.5)*2));m.rotation.set(Math.random()*3,Math.random()*3,0);this.scene.add(m);
  const life=this.reduced?.2:.5+Math.random()*.25;this.particles.push({m,v:new T.Vector3((Math.random()-.5)*3,.3+Math.random(),(Math.random()-.5)*3),life,maxLife:life,initial:m.scale.clone(),spin:new T.Vector3(4,6,3)});
 }
 }
 releaseBow(charge=1){this.bowRecoil=charge;this.bowReleaseAge=0;this.releasedCharge=charge;this.nockDelay=.24;}
 confirmHit(){this.contactStop=this.reduced?0:.035;this.kick=this.reduced?0:.65;}
 update(dt,active,tier,moving=false,aim=null,kind='pick',power=PICKS[tier]?.power??1){
 this.setTier(tier,kind);this.bowReleaseAge=(this.bowReleaseAge??Infinity)+dt;this.bowRecoil=Math.max(0,(this.bowRecoil??0)-dt*8);this.nockDelay=Math.max(0,(this.nockDelay??0)-dt);this.time+=dt;this.equip=Math.max(0,this.equip-dt*2.8);this.kick=Math.max(0,this.kick-dt*9);let impact=false;
 if(active&&!this.swinging){this.swinging=true;this.phase=0;}
 if(this.swinging){const before=this.phase;const step=this.contactStop>0?0:dt;this.contactStop=Math.max(0,(this.contactStop??0)-dt);this.phase+=step/(kind==='sword'?.50:Math.max(.30,.42/Math.pow(power,.18)));impact=(before<.30&&this.phase>=.30)||this.phase>=1.30;if(this.phase>=1){this.phase=active?this.phase%1:0;this.swinging=active;}}
 const rig=kind==='bow'?bowRig(this.bowDraw??0,this.bowReleaseAge,this.releasedCharge,this.reduced):null;
 const renderPhase=impact?.30:this.phase,motion=this.reduced?.13:1,pose=heldPose(renderPhase,this.camera.aspect,motion,kind,rig?.stance??this.bowDraw??0,this.reduced?0:this.bowRecoil),bob=moving&&!this.reduced?Math.sin(this.time*10)*.004:0;
 this.pivot.position.fromArray(pose.position);this.pivot.position.y+=(kind==='bow'?bob*(1-(this.bowDraw??0)):bob)-(kind==='bow'?0:this.equip*.22);this.pivot.position.z+=this.kick*.012;
 if(kind==='bow'){applyBowRig(this.tool,rig);this.pivot.position.z+=rig.follow;if(!this.reduced&&this.bowDraw>=.999)this.pivot.position.y+=Math.sin(this.time*32)*.002;}
 this.pivot.rotation.fromArray([...pose.rotation,'XYZ']);if(kind!=='bow')this.pivot.rotation.z-=this.equip*.04;
 if(aim?.point&&this.swinging){
 const smooth=(a,b,x)=>{let t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
 const contact=smooth(.16,.30,renderPhase)*(1-smooth(.34,.48,renderPhase));
 const solved=contactPivot(aim.point,aim.camera,this.camera,this.pivot.rotation,TOOL_SCALE,kind==='sword'?SWORD_TIP:kind==='axe'?AXE_TIP:CONTACT_TIP);
 const correction=solved.sub(this.pivot.position);correction.z=0;correction.clampLength(0,.055);
 this.pivot.position.addScaledVector(correction,contact*(this.reduced?.13:1));
 }
 // Gentle viewmodel lag only; locomotion and the camera never wait for a swing.
 if(aim?.camera){const yaw=aim.camera.rotation.y,pitch=aim.camera.rotation.x;
 const dy=Math.max(-.1,Math.min(.1,(this.lastYaw??yaw)-yaw)),dp=Math.max(-.1,Math.min(.1,(this.lastPitch??pitch)-pitch));
 this.lastYaw=yaw;this.lastPitch=pitch;
 if(!this.reduced&&!impact&&kind!=='bow'){this.pivot.position.x+=dy*.05;this.pivot.position.y-=dp*.035;}
 }
 for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.scene.remove(p.m);this.particles.splice(i,1);continue;}p.v.y-=(p.maxLife?12:8)*dt;p.m.position.addScaledVector(p.v,dt);
 if(p.maxLife){p.m.rotation.x+=p.spin.x*dt;p.m.rotation.y+=p.spin.y*dt;p.m.rotation.z+=p.spin.z*dt;p.m.scale.copy(p.initial).multiplyScalar(Math.min(1,p.life/p.maxLife*2));}
 else{p.m.rotation.x+=dt*5;p.m.scale.multiplyScalar(Math.exp(-dt*1.6));}}return impact&&active;
 }
 render(renderer,visible){if(!visible)return;renderer.autoClear=false;renderer.clearDepth();renderer.render(this.view,this.camera);renderer.autoClear=true;}
 resize(aspect){this.camera.aspect=aspect;this.camera.updateProjectionMatrix();}
}

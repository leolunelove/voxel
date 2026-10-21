import * as T from '../../vendor/three.module.js';
import {createPickaxe,createAxe,createSword,createBow,SWORD_TIP,BOW_SCALE,heldPose,TOOL_SCALE,AXE_TIP,CONTACT_TIP,contactPivot} from './pickaxe.js?v=58';
import {PICKS} from '../game/rules.js?v=58';
import {bowRig,applyBowRig} from './bow-motion.js?v=58';
import {createShield} from './shield.js?v=58';
export class Feedback{
 constructor(scene){
 this.scene=scene;this.particles=[];this.geometry=new T.BoxGeometry(1,1,1);this.materials=new Map();this.reduced=false;this.phase=0;this.swinging=false;this.time=0;this.kick=0;this.equip=0;this.tier=-1;
 this.view=new T.Scene();this.camera=new T.PerspectiveCamera(48,1,.01,10);
 this.view.add(new T.HemisphereLight(0xe8f3f2,0x576657,2.4));const key=new T.DirectionalLight(0xffe2b0,3);key.position.set(-2,3,4);this.view.add(key);const rim=new T.DirectionalLight(0xb1dded,1.5);rim.position.set(3,1,-2);this.view.add(rim);
 this.pivot=new T.Group();this.view.add(this.pivot);this.setTier(0);
 this.outline=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.006,1.006,1.006)),new T.LineBasicMaterial({color:0xf4dea6,transparent:true,opacity:.7}));scene.add(this.outline);this.outline.visible=false;
 const c=document.createElement('canvas');c.width=c.height=128;this.ctx=c.getContext('2d');this.texture=new T.CanvasTexture(c);this.texture.magFilter=T.NearestFilter;
 this.cracks=new T.Mesh(new T.BoxGeometry(1.009,1.009,1.009),new T.MeshBasicMaterial({map:this.texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));scene.add(this.cracks);this.cracks.visible=false;this.stage=-1;
 }
 setTier(tier,kind='pick'){if(tier===this.tier&&kind===this.kind)return;if(this.tool){this.pivot.remove(this.tool);const mats=new Set();this.tool.traverse(o=>{o.geometry?.dispose();if(o.material)mats.add(o.material);});mats.forEach(m=>m.dispose());}this.tier=tier;this.kind=kind;this.tool=kind==='bow'?createBow(tier):kind==='sword'?createSword(tier):kind==='axe'?createAxe(tier):createPickaxe(tier);this.tool.scale.setScalar(kind==='bow'?BOW_SCALE:TOOL_SCALE);this.pivot.add(this.tool);this.equip=1;}
 updateShield(dt,enabled,guard,tier=0){
 if(this.shieldTier!==tier){if(this.shield){this.shield.removeFromParent();const mats=new Set();this.shield.traverse(o=>{o.geometry?.dispose();if(o.material)mats.add(o.material);});mats.forEach(m=>m.dispose());}this.shield=createShield(tier);this.shield.scale.setScalar(.60);this.view.add(this.shield);this.shieldTier=tier;}
 this.shield.visible=enabled;if(!enabled)return;this.shieldRaise=(this.shieldRaise??0)+(Number(guard.held)-(this.shieldRaise??0))*(1-Math.exp(-dt*18));const up=this.shieldRaise,kick=this.reduced?0:Math.sin(Math.min(1,guard.flash/.24)*Math.PI)*.09;
 this.shield.position.set(-.55+up*.15,-.40+up*.25,-1.15+up*.12+kick);this.shield.rotation.set(.06-up*.12,.35-up*.22,-.18+up*.13);if(guard.event==='broken'&&guard.flash>0&&!this.reduced)this.shield.rotation.z-=.2;}
 target(mesh,progress){this.outline.visible=!!mesh;this.cracks.visible=!!mesh&&progress>0;if(!mesh)return;mesh.getWorldPosition(this.outline.position);this.cracks.position.copy(this.outline.position);const stage=Math.min(9,Math.floor(progress*10));if(stage===this.stage)return;this.stage=stage;
 const ctx=this.ctx;ctx.clearRect(0,0,128,128);let seed=57;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<10;i++){const angle=i*2.399,reach=24+rand()*40,branch=(rand()-.5)*35;const pts=[[63,61],[63+Math.cos(angle)*reach*.4+(rand()-.5)*16,61+Math.sin(angle)*reach*.4],[63+Math.cos(angle)*reach,61+Math.sin(angle)*reach]];if(i>stage)continue;
 for(const [color,width]of [['rgba(228,230,208,.4)',5],['rgba(15,25,23,.92)',2+stage*.18]]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();pts.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
 if(stage>3){ctx.strokeStyle='#17241f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(...pts[1]);ctx.lineTo(pts[1][0]+branch,pts[1][1]+branch*.7);ctx.stroke();}}
 this.texture.needsUpdate=true;
 }
 burst(position,color,small=false){
 let mat=this.materials.get(color);if(!mat){mat=new T.MeshStandardMaterial({color,roughness:.95});this.materials.set(color,mat);}
 const count=this.reduced?2:small?2:12;
 for(let i=0;i<count&&this.particles.length<160;i++){const m=new T.Mesh(this.geometry,mat),size=small?.025+Math.random()*.035:.04+Math.random()*.1;m.scale.set(size,size*(.5+Math.random()),size);m.position.copy(position);m.position.add(new T.Vector3((Math.random()-.5)*.35,(Math.random()-.5)*.35,(Math.random()-.5)*.35));m.rotation.set(Math.random()*3,Math.random()*3,0);this.scene.add(m);this.particles.push({m,v:new T.Vector3((Math.random()-.5)*3,1+Math.random()*2,(Math.random()-.5)*3),life:small?.22:.45+Math.random()*.25});}
 if(!small)this.kick=1;
 }
 releaseBow(charge=1){this.bowRecoil=charge;this.bowReleaseAge=0;this.releasedCharge=charge;this.nockDelay=.24;}
 confirmHit(){this.contactStop=this.reduced?0:.035;this.kick=this.reduced?0:.65;}
 update(dt,active,tier,moving=false,aim=null,kind='pick',power=PICKS[tier]?.power??1){
 this.setTier(tier,kind);this.bowReleaseAge=(this.bowReleaseAge??Infinity)+dt;this.bowRecoil=Math.max(0,(this.bowRecoil??0)-dt*8);this.nockDelay=Math.max(0,(this.nockDelay??0)-dt);this.time+=dt;this.equip=Math.max(0,this.equip-dt*2.8);this.kick=Math.max(0,this.kick-dt*9);let impact=false;
 if(active&&!this.swinging){this.swinging=true;this.phase=0;}
 if(this.swinging){const before=this.phase;const step=this.contactStop>0?0:dt;this.contactStop=Math.max(0,(this.contactStop??0)-dt);this.phase+=step/(kind==='sword'?.50:Math.max(.30,.42/Math.pow(power,.18)));impact=(before<.30&&this.phase>=.30)||this.phase>=1.30;if(this.phase>=1){this.phase=active?this.phase%1:0;this.swinging=active;}}
 const renderPhase=impact?.30:this.phase,motion=this.reduced?.13:1,pose=heldPose(renderPhase,this.camera.aspect,motion,kind,this.bowDraw??0,this.reduced?0:this.bowRecoil),bob=moving&&!this.reduced?Math.sin(this.time*10)*.004:0;
 this.pivot.position.fromArray(pose.position);this.pivot.position.y+=(kind==='bow'?bob*(1-(this.bowDraw??0)):bob)-this.equip*.22;this.pivot.position.z+=this.kick*.012;
 if(kind==='bow'){const rig=bowRig(this.bowDraw??0,this.bowReleaseAge,this.releasedCharge,this.reduced);applyBowRig(this.tool,rig);this.pivot.position.z+=rig.follow;}
 this.pivot.rotation.fromArray([...pose.rotation,'XYZ']);this.pivot.rotation.z-=this.equip*.04;
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
 for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.scene.remove(p.m);this.particles.splice(i,1);continue;}p.v.y-=8*dt;p.m.position.addScaledVector(p.v,dt);p.m.rotation.x+=dt*5;p.m.scale.multiplyScalar(Math.exp(-dt*1.6));}return impact&&active;
 }
 render(renderer,visible){if(!visible)return;renderer.autoClear=false;renderer.clearDepth();renderer.render(this.view,this.camera);renderer.autoClear=true;}
 resize(aspect){this.camera.aspect=aspect;this.camera.updateProjectionMatrix();}
}

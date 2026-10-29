import {impactRecoil} from './arrow-impact.js?v=79.1';
import * as T from '../../vendor/three.module.js';
// Presentation is independent of damage and reward rules.
export function dressWarden(root,arms){
 const steel=new T.MeshStandardMaterial({color:0x343845,metalness:.65,roughness:.4}),gold=new T.MeshStandardMaterial({color:0xbb9560,metalness:.7,roughness:.35}),dark=new T.MeshLambertMaterial({color:0x171e28}),glow=new T.MeshBasicMaterial({color:0xffcb79});
 const box=(parent,w,h,d,x,y,z,mat)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);parent.add(o);return o;};
 box(root,.96,.7,.76,0,.94,0,steel);box(root,.12,.65,.05,0,.98,.41,gold);box(root,.56,.12,.06,0,1.55,.32,dark);box(root,.52,.045,.07,0,1.57,.36,glow);box(root,.8,.18,.7,0,1.8,0,steel);
 for(const side of [-1,1]){box(root,.42,.28,.85,side*.58,1.23,0,steel);box(root,.45,.07,.9,side*.58,1.38,0,gold);box(root,.33,.38,.4,side*.25,.22,.05,steel);box(root,.15,.34,.18,side*.35,1.97,0,gold);}
 box(root,.14,.46,.18,0,2.03,0,gold);box(root,.55,.62,.12,0,.58,-.43,dark);
 const hammer=new T.Group();hammer.name='warden-hammer';arms[1].add(hammer);box(hammer,.12,1.15,.12,0,-.35,.05,dark);box(hammer,.62,.42,.55,0,-.9,.05,steel);box(hammer,.67,.12,.58,0,-.9,.05,gold);
 const shock=new T.Mesh(new T.RingGeometry(.92,1,40),new T.MeshBasicMaterial({color:0xffce83,side:T.DoubleSide,transparent:true,opacity:0,depthWrite:false}));shock.rotation.x=-Math.PI/2;shock.position.y=.035;root.add(shock);shock.userData.effect=true;
 return {shock,gold,steel};
}
export function animateWarden(e,reduced){const v=e.warden;if(!v)return;const charge=Math.max(0,Math.min(1,1-e.windup/e.stats.windup));
 if(e.dead){v.shock.visible=false;return;}
 if(!reduced){if(e.windup>0){e.arms[1].rotation.x=-charge*2.65;e.arms[0].rotation.x=-charge*.8;e.root.rotation.x=-charge*.12;}else if(e.lunge>0){e.arms[1].rotation.x=.9;e.root.rotation.x=.22;}else{e.arms[1].rotation.x=.08;}
 e.body.rotation.z=impactRecoil(e.hit,e.hitDuration)*.09;e.root.rotation.x-=impactRecoil(e.hit,e.hitDuration)*.1;}
 v.steel.emissive.setHex(e.hit>0?0x6e3421:0x000000);v.steel.emissiveIntensity=Math.min(1,e.hit/(e.hitDuration??.18));
 v.shock.visible=e.lunge>0;v.shock.scale.setScalar(reduced?e.stats.reach:e.stats.reach*(1-e.lunge/.4));v.shock.material.opacity=Math.max(0,e.lunge/.4)*.8;
}

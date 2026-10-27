import {impactRecoil} from './arrow-impact.js?v=73.2';
import * as T from '../../vendor/three.module.js';
export function dressMonster(root,body,head,arms,type){
 const armor=new T.MeshStandardMaterial({color:type===1?0x515c66:0x3c533a,roughness:.8,metalness:type===1?.4:.05}),bone=new T.MeshLambertMaterial({color:0xc9be95}),dark=new T.MeshLambertMaterial({color:0x242d2a});
 const box=(parent,s,p,mat)=>{const o=new T.Mesh(new T.BoxGeometry(...s),mat);o.position.set(...p);parent.add(o);return o;};
 if(type===0){box(body,[.96,.55,.35],[0,.15,-.35],armor);for(const x of [-.3,0,.3])box(body,[.1,.25,.13],[x,.46,-.27],bone);box(head,[.72,.15,.65],[0,-.19,.04],dark);for(const x of [-.23,.23])box(head,[.09,.18,.1],[x,-.2,.34],bone);for(const arm of arms)for(const x of [-.065,.065])box(arm,[.05,.22,.1],[x,-.36,.1],bone);}
 else{box(head,[.8,.25,.68],[0,.25,0],armor);box(head,[.12,.5,.7],[0,.05,0],armor);for(const side of [-1,1]){box(root,[.47,.32,.82],[side*.58,1.18,0],armor);box(arms[side===-1?0:1],[.31,.3,.34],[0,-.2,0],armor);}for(const y of [-.2,0,.2])box(body,[.86,.075,.04],[0,y,.35],bone);}
 const bar=new T.Group();bar.position.set(0,2.15,0);const back=box(bar,[.86,.075,.025],[0,0,0],dark),fill=box(bar,[.80,.045,.03],[0,0,.02],new T.MeshBasicMaterial({color:0xe8bc71}));bar.traverse(o=>o.userData.effect=true);root.add(bar);bar.visible=false;
 return {head,armor,bar,fill,time:0};
}
export function animateMonster(e,dt,reduced,distance){const v=e.look;if(!v)return;v.time+=dt;const hit=Math.max(0,Math.min(1,e.hit/(e.hitDuration??.26))),recoil=impactRecoil(e.hit,e.hitDuration)*(e.impactStrength??1),charge=e.windup>0?1-e.windup/(e.stats.windup??.7):0,moving=distance>1.35&&distance<12&&e.windup<=0&&e.stagger<=0&&e.lunge===0;
 v.hitTime=e.hit>0?1.5:Math.max(0,(v.hitTime??0)-dt);v.bar.visible=e.hp<e.maxHp&&v.hitTime>0;v.fill.scale.x=Math.max(.001,e.hp/e.maxHp);v.fill.position.x=-(1-e.hp/e.maxHp)*.4;v.bar.rotation.y=0;
 v.armor.emissive.setHex(e.hit>0?0xc38348:0);v.armor.emissiveIntensity=hit*1.1;
 if(reduced){v.head.rotation.set(0,0,0);e.body.rotation.set(0,0,0);e.root.position.y=1;e.legs.forEach(l=>l.rotation.x=0);return;}
 const crawl=e.type===0;e.root.position.y=1+(moving?Math.abs(Math.sin(e.timer))*(crawl?.055:.025):Math.sin(v.time*2)*.012);
 v.head.rotation.x=-recoil*.34+(e.windup>0?-charge*.22:e.lunge>0?.2:0);e.body.rotation.z=recoil*(crawl?.22:.13);e.body.rotation.x=(crawl?.1:0)-recoil*.12;
 if(e.stagger>0){e.arms.forEach((a,i)=>{a.rotation.x=.65*recoil;a.rotation.z=(i===0?-1:1)*recoil*.3;});}
 else if(e.windup>0){e.arms.forEach((a,i)=>{a.rotation.x=-charge*(crawl?1.4:2.1);a.rotation.z=(i===0?-1:1)*charge*(crawl?.65:.16);});}
 else{e.arms.forEach((a,i)=>{a.rotation.z=0;if(moving)a.rotation.x=Math.sin(e.timer+i*Math.PI)*(crawl?.45:.24);});}
 if(!moving)e.legs.forEach(l=>l.rotation.x*=Math.exp(-dt*15));
}

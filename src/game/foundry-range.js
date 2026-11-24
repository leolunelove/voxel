import * as T from '../../vendor/three.module.js';
import {RANGE_WING as C,RANGE_TARGETS} from './foundry-range-layout.js?v=91';
export function buildFoundryRange(w,{a,box:B,wall:W,roof:R,lamp:L,sign:S}){
 const iron=0x435751,brass=0xb99a60,wood=0x8c6745;
 for(const [x1,x2,z1,z2] of [...C.passages,C.bounds])a.surface((x1+x2)/2,.92,(z1+z2)/2,x2-x1,.16,z2-z1,0x96998a,'ground');
 // The approach turns twice: targets are revealed only at the rear apron.
 for(const [x,z,width,depth] of [[25.75,27,16.5,.3],[23.75,31,12.5,.3],[34,30.5,.3,7],[30,34.5,.3,7],[35,38,10,.3],[37,34,6,.3]])W(x,z,width,depth,3.4);
 R(25.75,29,16.8,4.3,4.55);R(32,34.5,4.3,7.3,4.55);R(36,36,8.3,4.3,4.55);
 for(const [x,z]of [[20,29],[28,29],[32,34],[38,36]])L(x,4.25,z,24);
 for(let x=17;x<32;x++)B(x,1.027,29,.65,.018,.09,brass);
 for(let z=29;z<36;z++)B(32,1.027,z,.09,.018,.65,brass);
 for(let x=32;x<44;x++)B(x,1.027,36,.65,.018,.09,brass);
 S(['04 / BOW QUALIFICATION','CLEARANCE 4 / CONTROLLED ISSUE'],17.8,3.65,29,3.5,.65,-Math.PI/2);
 S(['ARMOURY PASSAGE →','FOLLOW THE BRASS LINE'],33.8,3.25,29,3,.55,-Math.PI/2);
 S(['LONG ROOM →','KEEP WEAPONS DOWN IN PASSAGE'],32,3.35,37.79,3,.5,Math.PI);
 // Tall, narrow longitudinal room, with a lowered rear issue bay and full backstop.
 for(const [x,z,width,depth]of [[57,22,34,.4],[57,38,34,.4],[74,30,.5,16],[40,28,.35,12]])W(x,z,width,depth,5.3);
 R(58,30,32.5,16.5,6.45);R(42.5,28,5.4,12,4.6);
 for(const x of [46.8,54,62,70,73.7]){B(x,6.12,30,.23,.25,16,iron);for(const z of [22.3,37.7])B(x,3.55,z,.22,5.1,.22,iron,true);}
 for(const x of [49,57,65,72])for(const z of [25,35]){const l=L(x,5.75,z,40);l.distance=13;l.userData.alwaysOn=true;}
 for(const z of [25,30,35]){const l=L(44.5,4.28,z,20);l.userData.alwaysOn=true;}
 // Wood baffles give every lane its own sightline, clear of the travelling targets.
 for(const z of [27.5,32.5]){B(59,1.45,z,26,.9,.18,wood,true);for(const x of [48,56,64,72]){B(x,3.5,z,.15,5,.15,iron,true);B(x,5.35,z,1.1,1.45,.24,wood,true);}}
 for(const t of RANGE_TARGETS){
  B(73.6,2.7,t.z,.35,3.3,4.5,wood,true);for(let z=t.z-1.8;z<t.z+2;z+=.4)B(73.36,2.7,z,.08,3.2,.055,0x684f38);
  B(t.x,4.25,t.z,.14,.16,4,iron);for(const dz of [-1.9,1.9])B(t.x,3.15,t.z+dz,.12,2.2,.12,iron);
  S([t.name],48,4.45,t.z,3.8,.4,-Math.PI/2);
  for(let x=47;x<73;x+=2)B(x,1.025,t.z,.9,.015,.06,brass);
  for(const x of [46.6,54,62,70])B(x,1.03,t.z,.09,.02,3.7,x===46.6?brass:0xb3b5a4);
 }
 S(['BOW QUALIFICATION','REGISTERED SHOTS / STAND BEHIND GOLD LINE'],73.7,5.45,30,11,.65,-Math.PI/2);
 S(['EXIT / YARD ←'],40.22,3.65,36,3,.4,Math.PI/2);
 // Bow racks and supervised issue window occupy the back wall, away from walking.
 B(40.3,2.2,25,.25,1.8,3.2,iron);for(const z of [24,25,26]){B(40.52,2.3,z,.12,1.2,.15,wood);B(40.58,2.9,z,.18,.12,.4,brass);}
 S(['ISSUE / RETURN','ARROWS SUPPLIED'],40.57,3.45,25,2.6,.5,Math.PI/2);
 B(40.35,2.9,31,.2,1.5,2,0x273e38);for(const z of [30.3,30.7,31.1,31.5])B(40.5,2.9,z,.08,1.5,.06,iron);
 S(['RANGE CONTROL'],40.55,3.85,31,2.8,.3,Math.PI/2);
 const bars=new T.Group();bars.name='Bow Qualification / clearance 4';bars.position.set(18,0,29);w.scene.add(bars);
 for(let z=-1.8;z<=1.81;z+=.4){const m=new T.Mesh(w.geometry,w.mat(iron));m.position.set(0,3,z);m.scale.set(.15,4,.085);bars.add(m);}
 for(const y of [1.1,4.9]){const m=new T.Mesh(w.geometry,w.mat(brass));m.position.set(0,y,0);m.scale.set(.2,.13,4);bars.add(m);}
 B(18,4.2,29,.4,.65,4.2,iron,true);
 const beacon=B(17.78,3.6,30.65,.15,.24,.18,brass);beacon.material=beacon.material.clone();
 w.trainingGates.push({wing:C,bars,bounds:new T.Box3(new T.Vector3(17.8,1,27),new T.Vector3(18.2,5.2,31)),beacon,open:false,lift:0});
}

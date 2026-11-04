import * as T from '../../vendor/three.module.js';
import {CONTAINMENT as C} from './foundry-layout.js?v=87';
// One compact holding hall behind the courtyard's south-east checkpoint.
export function buildFoundryContainment(w,{a,box:B,wall:W,roof:R,lamp:L,sign:S}){
 const iron=0x435751,rust=0x88553d;
 for(const [x1,x2,z1,z2] of [...C.passages,C.bounds])a.surface((x1+x2)/2,.92,(z1+z2)/2,x2-x1,.16,z2-z1,0x8d9084,'ground');
 // Dogleg screens the holding cells until the last doorway.
 for(const [x,z,width,depth]of [[12.5,33,.3,6],[16.5,31,.3,2],[21.75,32,10.5,.3],[17.75,36,10.5,.3],[27,36,.3,8],[23,37.5,.3,3]])W(x,z,width,depth,3.5);
 R(14.5,33,4.3,6.4,4.65);R(21,34,12.5,4.3,4.65);R(25,37,4.3,6.4,4.65);
 for(const [x,z]of [[14.5,31],[20,34],[25,37]]){L(x,4.3,z,26);B(x,1.025,z,.14,.02,1.2,rust);}
 for(const [x,z,width,depth]of [[20,46,.35,14],[36,46,.35,14],[28,53,16,.35],[21.5,39,3,.35],[31.5,39,9,.35]])W(x,z,width,depth,4.7);
 R(28,46,16.5,14.5,5.85);
 for(const z of [40,46,52]){B(28,5.55,z,16,.22,.18,iron);for(const x of [20.4,35.6])B(x,3.25,z,.18,4.5,.18,iron,true);}
 for(const x of [22,34])for(const z of [42,49]){const light=L(x,5.25,z,42);light.distance=11;light.userData.alwaysOn=true;}
 // Recessed barred bays flank a clear fighting floor; nothing blocks backsteps.
 for(const x of [20.3,35.7])for(const z of [43,49]){B(x,2.8,z,.13,2.8,3.8,0x263b37);for(let dz=-1.5;dz<=1.51;dz+=.5)B(x+(x<28?.10:-.10),2.8,z+dz,.07,2.8,.065,iron);B(x,4.24,z,.2,.14,4,rust);}
 S(['03 / CONTAINMENT','CLEARANCE 3 / LIVE QUARRY'],14.5,4.05,29.78,3.3,.55,Math.PI);
 S(['HOLDING HALL →','WEAPONS ISSUED BEYOND CHECKPOINT'],14.5,3.4,35.78,3,.55,Math.PI);
 S(['CONTAINMENT DETAIL','ELIMINATE. RECOVER. REPORT.'],28,4.6,52.78,9,.7);
 S(['YARD / BANK LOOT ↑'],25,3.6,39.22,3.2,.35);
 S(['CONTAINMENT ↘','CLEARANCE 3'],16.5,3.1,29.78,2,.5,Math.PI);
 for(let x=8;x<15;x+=1)B(x,1.025,28,.55,.02,.09,rust);for(let z=28;z<32;z+=.8)B(14.5,1.025,z,.09,.02,.48,rust);
 const bars=new T.Group();bars.name='Containment / clearance 3';bars.position.set(14.5,0,30);w.scene.add(bars);
 for(let x=-1.8;x<=1.81;x+=.4){const m=new T.Mesh(w.geometry,w.mat(iron));m.position.set(x,3,0);m.scale.set(.085,4,.15);bars.add(m);}
 for(const y of [1.1,4.9]){const m=new T.Mesh(w.geometry,w.mat(rust));m.position.set(0,y,0);m.scale.set(4,.13,.2);bars.add(m);}
 B(14.5,4.18,30,4.1,.6,.35,iron,true);
 const beacon=B(16.35,3.6,29.8,.18,.24,.15,rust);beacon.material=beacon.material.clone();
 w.trainingGates.push({wing:C,bars,bounds:new T.Box3(new T.Vector3(12.5,1,29.8),new T.Vector3(16.5,5.2,30.2)),beacon,open:false,lift:0});
}

import * as T from '../../vendor/three.module.js';
import {TIMBER_FLOORS} from './foundry-timber-layout.js?v=82.3';
export function buildFoundryTimber(w,{root,box,wall,roof,sign,lamp,guard,stone,iron,rust,wood,trim}){
 box(42,-3.5,-7,48,9,50,0x625e59);
 // The L: a long east-west saw works caps a north-south outdoor felling arm.
 for(const [a,b,c,d]of TIMBER_FLOORS)box((a+b)/2,.5,(c+d)/2,b-a,1,d-c,0x797060);
 // A lower, staffed weighing house at the yard checkpoint.
 for(const [x,z,a,c]of [[20,7,.4,2],[20,14,.4,4],[32,11,.4,10],[26,16,12,.4],[29,6,6,.4]])wall(x,z,a,c,5.5);
 roof(26,11,13,11,6.7);box(29.5,1.9,12,2,1.8,5,wood,true);guard(30,14);lamp(24,5.9,10,55);
 sign(['TIMBER DETAIL / CLEARANCE 2','20 BLOCKS MINED / REGISTERED LABOUR'],19.73,5,10,7,1,-Math.PI/2);
 sign(['WEIGHING / TOOL CONTROL','SAW WORKS STRAIGHT AHEAD'],26,4.8,15.75,7,1,Math.PI);
 // Narrow western access arm conceals the outdoor court and leads into the saw works.
 wall(20.75,-10,.5,32,6);wall(26.25,-6,.5,24,6);roof(23.5,-10,6,32,7.2);
 for(const z of [2,-6,-14,-23]){lamp(23.5,6.4,z,40);box(23.5,1.035,z,.15,.03,2,0xbb955b);}
 sign(['SAW WORKS →','NO UNREGISTERED TIMBER'],23.5,4.4,-29.65,4,.9);
 // Long production hall: supported north roof, stacked beams, cutting bed, dispatch bays.
 wall(42.5,-30,43,.6,8);wall(64,-24,.6,12,8);wall(21,-28,.5,4,8);
 roof(42.5,-24,44,13,9.2);for(const x of [28,36,44,52,60]){box(x,8.9,-24,.24,.35,12,iron);for(const z of [-29.6,-18.4])box(x,4.9,z,.24,7.8,.24,iron);lamp(x,8.5,-24,60);}
 // The southern facade opens only at the offset dispatch threshold, revealing the yard.
 wall(32,-18,12,.5,6.5);wall(54,-18,20,.5,6.5);box(42,7.5,-18,6,.5,.6,iron);
 sign(['FELLING YARD ↓','STAY WITHIN YOUR ALLOCATION'],42,6.5,-18.35,6,1,Math.PI);
 for(const x of [31,36,51,57]){box(x,1.5,-27,3.8,1,1.8,wood,true);box(x,2.1,-27,3.8,.15,1.8,trim);box(x,2.25,-27,.13,.15,1.9,iron);}
 box(55,1.7,-22,7,1.4,1.5,iron,true);box(55,2.5,-22,7.5,.2,1.8,wood);const saw=new T.Mesh(new T.CylinderGeometry(.7,.7,.12,12),w.mat(0x8d9294));saw.rotation.z=Math.PI/2;saw.position.set(55,2.7,-22);root.add(saw);
 sign(['SUPPORT TIMBER / DEEPWELL','CUT. STACK. REPORT.'],48,6.7,-29.65,15,1.2);
 // Open-sky logging arm. Its future eastern plots are fenced, not enclosed in another room.
 wall(27.75,-7,.5,22,7.5);wall(60.25,-7,.5,22,7.5);wall(44,4.25,32,.5,7.5);
 for(const x of [29,58])for(const z of [-14,1]){box(x,5,z,.2,8,.2,iron,true);lamp(x,9,z,65);}
 for(const z of [-15,-9,-3,2]){box(28.4,6.5,z,.7,.25,1.5,iron);box(28.4,7.3,z,.08,1.6,.08,iron);}box(28.4,8.2,-7,1.3,.2,22,iron);
 sign(['TIMBER DETAIL / OUTDOOR LABOUR','LOGS BECOME MINE SUPPORTS · ALL OUTPUT IS PRISON PROPERTY'],44,6.4,3.92,25,1.4,Math.PI);
 sign(['RETURN VIA SAW WORKS ↑'],39,4,-17.65,6,.7);
 // The entry portcullis is separate from every intake gate.
 const bars=new T.Group();bars.position.set(18,0,10);bars.name='Timber Detail / level 2 checkpoint';w.scene.add(bars);for(let z=-1.8;z<=1.81;z+=.4){const m=new T.Mesh(w.geometry,w.mat(iron));m.position.set(0,3,z);m.scale.set(.15,4,.09);bars.add(m);}for(const y of [1.1,4.9]){const m=new T.Mesh(w.geometry,w.mat(trim));m.position.set(0,y,0);m.scale.set(.2,.15,4);bars.add(m);}w.gate=bars;w.gateLift=0;
}

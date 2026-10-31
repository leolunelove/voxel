import {buildArrivalCampus,buildCompactCells,arrivalLocal} from './arrival-campus.js?v=84';
import {buildFoundryTimber} from './foundry-timber.js?v=84';
import {buildWorkCourt,buildDeepwell} from './work-court.js?v=84';
import * as T from '../../vendor/three.module.js';
import {batchScenery} from '../engine/static-batch.js?v=84';
import {CAMPUS_FLOORS,PIT,inBox,terraceFloor,ARRIVAL_SCALE,ARRIVAL_Y} from './foundry-layout.js?v=84';
export function buildFoundryPrison(w){
 const root=new T.Group();root.name='Block 07 / compact working court';w.scene.add(root);w.foundry=root;
 w.skyLight=new T.HemisphereLight(0xdde3e4,0x706553,1.45);w.sun=new T.DirectionalLight(0xffdfae,3.1);w.sun.position.set(-22,32,18);w.sun.castShadow=true;w.sun.shadow.autoUpdate=false;w.sun.shadow.needsUpdate=true;w.sun.shadow.mapSize.set(2048,2048);Object.assign(w.sun.shadow.camera,{left:-75,right:75,top:100,bottom:-80,near:1,far:220});w.sun.shadow.bias=-.0003;w.sun.shadow.normalBias=.025;w.yardFill=new T.HemisphereLight(0xe8d3af,0x534b44,.35);w.scene.add(w.skyLight,w.sun,w.yardFill);
 buildArrivalCampus(w);const a=w.arrival,start=a.blockers.length;
 const box=(x,y,z,width,height,depth,color=0xc6c5b7,solid=false)=>a.box(x,y,z,width,height,depth,color,({[0xc6c5b7]:'brick',[0x435751]:'metal',[0x88553d]:'metal',[0x8c6745]:'wood',[0xb2a385]:'stone',[0x797060]:'ground'})[color]??'',solid);
 const wall=(x,z,width,depth,h=4.5)=>a.surface(x,1+h/2,z,width,h,depth,0xc6c5b7,'brick',true);
 const roof=(x,z,width,depth,y=5.65)=>a.surface(x,y,z,width,.24,depth,0x65716a,'stone',true);
 const lamp=(x,y,z,power=28)=>{const l=a.lamp(x,y,z,power,10);l.userData.workLight=true;return l;};
 const guard=(x,z,angle=0)=>{const p=arrivalLocal(x,z),g=a.officer(p.x,p.z,angle);g.scale.set(1/ARRIVAL_SCALE,1/ARRIVAL_Y,1/ARRIVAL_SCALE);a.contact(x,z,1.1,.8,.25,1.015);return g;};
 const sign=(...args)=>a.sign(...args);
 // The only level ground is the actual campus footprint; no giant false walkable slab.
 for(const [x1,x2,z1,z2]of CAMPUS_FLOORS){if([-24,7.8,-32.5,-20].includes(x1))continue;const start=x1===12?18:x1;a.surface((start+x2)/2,.932,(z1+z2)/2,x2-start,.16,z2-z1,0xc9c1ab,'ground');}
 for(let x=-24;x<10;x++)for(let z=-36;z< -8;z++){const h=inBox(x+.5,z+.5,PIT)?terraceFloor(x+.5,z+.5):1;a.box(x+.5,(h-6)/2,z+.5,1,h+6,1,0xa8a496,'stone');}
 buildWorkCourt(w,{a,box,wall,roof,lamp,guard,sign});buildDeepwell(w,{a,box,wall,roof,lamp,guard,sign});
 buildCompactCells(w);
 // Retain the existing L-shaped Timber Detail and its allocation/progression rules.
 buildFoundryTimber(w,{root,box,wall,roof,sign,lamp,guard,stone:0xc6c5b7,iron:0x435751,rust:0x88553d,wood:0x8c6745,trim:0xb2a385});
 // Contain the already unlocked timber yard without distant, oversized prison walls.
 for(const [x,z,width,depth]of [[47,18,38,.5],[66,-7,.5,50],[47,-32,38,.5]])wall(x,z,width,depth,6.5);
 w.blockers.push(...a.blockers.slice(start));w.floorMat=a.material(0xc9c1ab,'ground');w.trainingGates=[];w.motes=new T.InstancedMesh(w.geometry,new T.MeshBasicMaterial({visible:false}),32);w.matrix=new T.Matrix4();
 w.courtStats=batchScenery(w.scene,a.geometry,[a.dynamic,w.issuedPick,w.gate,...w.intakeGates.map(g=>g.bars),w.forestRoot,w.fenceRoot,w.mineRoot]);
}

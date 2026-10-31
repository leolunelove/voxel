import {buildArrivalCampus,buildCompactCells} from './arrival-campus.js?v=83.2';
import {buildFoundryTimber} from './foundry-timber.js?v=83.2';
import * as T from '../../vendor/three.module.js';
import {surfaceTexture} from '../engine/surface-textures.js?v=83.2';
import {createPickaxe} from '../engine/pickaxe.js?v=83.2';
import {CAMPUS_FLOORS,PIT,inBox,terraceFloor} from './foundry-layout.js?v=83.2';
export function buildFoundryPrison(w){
 const root=new T.Group();root.name='NEW BLOCK 07 / intake, H-cellblock, terraced Deepwell';w.scene.add(root);w.foundry=root;const stone=0x535258,iron=0x30343b,rust=0x884633,trim=0x9a8b77,wood=0x745239;
 const box=(x,y,z,a,b,c,color=stone,solid=false)=>w.box(x,y,z,a,b,c,color,solid,root);
 const sign=(lines,x,y,z,a=5,b=1,angle=0)=>w.sign(lines,x,y,z,a,b,angle,root);
 const lamp=(x,y,z,power=45)=>{box(x,y+.12,z,.7,.2,.6,iron);const bulb=box(x,y,z,.45,.1,.35,0xffc28b);bulb.material=new T.MeshBasicMaterial({color:0xffc28b});bulb.userData.prisonBulb=true;const l=new T.PointLight(0xffbb7b,power,13,2);l.position.set(x,y-.3,z);l.userData.workLight=true;root.add(l);};
 const wall=(x,z,a,c,h=7)=>box(x,1+h/2,z,a,h,c,stone,true);
 const roof=(x,z,a,c,y=8.2)=>box(x,y,z,a,.3,c,iron,true);
 const guard=(x,z,angle=0)=>{const g=new T.Group();for(const [y,a,b,c,color]of [[.6,.5,1.1,.45,iron],[1.45,.7,.8,.5,0x596363],[2.1,.5,.5,.5,0xae8b6c],[2.42,.65,.15,.6,iron]]){const m=new T.Mesh(w.geometry,w.mat(color));m.position.y=y;m.scale.set(a,b,c);g.add(m);}g.position.set(x,1,z);g.rotation.y=angle;root.add(g);};
 w.floorMat=new T.MeshStandardMaterial({map:surfaceTexture('paving'),roughness:.97});w.skyLight=new T.HemisphereLight(0xcbd9e8,0x69584b,1.8);w.sun=new T.DirectionalLight(0xffdfb3,2);w.sun.position.set(-15,30,10);w.sun.castShadow=true;w.sun.shadow.autoUpdate=false;w.sun.shadow.needsUpdate=true;w.sun.shadow.mapSize.set(2048,2048);Object.assign(w.sun.shadow.camera,{left:-75,right:75,top:100,bottom:-80,near:1,far:220});w.sun.shadow.bias=-.001;w.sun.shadow.normalBias=.035;w.yardFill=new T.HemisphereLight(0xe8d3af,0x534b44,.4);w.scene.add(w.skyLight,w.sun,w.yardFill);
 // Perimeter encloses the new first-shift campus; the foundation continues below the quarry.
 box(-10,-8,15,84,2,116,0x454448);
 for(const [a,b,c,d]of [[-50,-42,-40,82],[-18,28,-40,82],[-42,-18,-40,-32],[-42,-18,-10,82]])box((a+b)/2,-3.5,(c+d)/2,b-a,9,d-c,0x625e59);wall(-50,21,1,122,13);wall(28,50,1,64,13);wall(28,-36,1,8,13);wall(47,18,38,1,13);wall(66,-7,1,50,13);wall(47,-32,38,1,13);for(const z of [-40,92])wall(-11,z,79,1,13);for(const x of [-49,27])for(const z of [-39,81]){box(x,13,z,3,5,3,iron);roof(x,z,4.5,4.5,15.7);}
 // Floors follow the NEW footprints. No old yard, trees or combat court is constructed.
 for(const [a,b,c,d]of CAMPUS_FLOORS){if(a===-46)continue;box((a+b)/2,.5,(c+d)/2,b-a,1,d-c,0x797269);}
 for(let x=-46;x< -12;x++)for(let z=-36;z< -8;z++){const h=inBox(x+.5,z+.5,PIT)?terraceFloor(x+.5,z+.5):1;box(x+.5,h-1,z+.5,1,2,1,0x66615b);}
 buildArrivalCampus(w);
 // Compact roll-call court: residence west, pay south-east, industrial route north-west.
 for(const [x,z,a,c]of [[-8,8.9,.6,5.8],[-8,23,.6,14],[18,18,.6,12],[5,30,6,.6]])wall(x,z,a,c,7);
 wall(18,6,.6,4,7);box(18,7.3,10,.6,2,4,iron,true);
 for(const [x,z]of [[-5,8],[15,8],[-5,27]]){box(x,4,z,.18,6,.18,iron,true);lamp(x,7,z,65);}
 sign(['ROLL CALL / 07','REPORT. WORK. RETURN.'],3,5.6,4.3,8,1);for(const z of [12,16,20])box(3,1.035,z,12,.03,.1,0xbfa777);
 // Pay office is a complete small occupied room, off the everyday return route.
 for(const [x,z,a,c]of [[22,29,.5,10],[17.5,34,9,.5],[20,24,4,.5]])wall(x,z,a,c,5.5);roof(16,29,13,11,6.8);box(16,1.9,32,8,1.8,1.2,wood,true);guard(16,33);lamp(16,6,28,65);sign(['PAY OFFICE / FORGE','E / WEIGH YOUR HAUL'],14,5.5,24.3,6,1);
 buildCompactCells(w);
 // Industrial loading hall changes direction before opening onto the excavation.
 wall(-25,-2,14,.5,7);wall(-2,-2,20,.5,7);
 for(const x of [-18,-12])wall(x,-6,.4,10,6);roof(-15,-5,6.5,12,7.2);sign(['DEEPWELL / EXTRACTION','FOLLOW RAMP · KEEP WALKWAYS CLEAR'],-15,6.4,.65,8,1);
 for(const [x,z,a,c]of [[-46,-22,.6,28],[-29,-36,34,.6],[-12,-26,.6,20]])wall(x,z,a,c,10);
 for(const [x,z]of [[-44,-12],[-44,-33],[-15,-33]]){box(x,6,z,.35,10,.35,iron,true);lamp(x,11,z,95);}
 for(const x of [-32,-22])box(x,9,-10,.45,16,.45,iron);box(-27,16,-10,11,.5,.5,iron);const wheel=new T.Mesh(new T.TorusGeometry(1,.14,4,12),w.mat(iron));wheel.position.set(-27,15,-10);root.add(wheel);
 sign(['DEEPWELL / TERRACED WORKS','UPPER BENCH → LOWER SEAMS'], -31,7,-35.6,15,1.4);
 for(let z=-12;z> -24;z-=1){const y=terraceFloor(-19,z-.5);box(-19,y-.15,z-.5,2,.3,1,trim);box(-18.1,y+1,z-.5,.1,1.9,.1,iron);}
 // Sealed work orders reserve the future districts without recreating any old wing.
 for(const [x,z,label,angle]of [[-30,-2,'CONTAINMENT / SEALED',0],[18,20,'BOW QUALIFICATION / SEALED',-Math.PI/2]]){sign([label,'THIS SECTOR IS NOT YET COMMISSIONED'],x,5,z,7,1,angle);}
 // Painted first-shift route: residence first, then the north-west work entrance.
 for(const [x,z,a,c]of [[10,34,.12,8],[7,30,6,.12],[4,15,.12,30],[-12.5,1,33,.12],[-26,11,.12,20],[-22,1,14,.12],[-15,-5,.12,12]])box(x,1.035,z,a,.025,c,0xbf995c);
 sign(['CELLBLOCK A ←','FIRST: REPORT TO CELL 07'],3,4,29.6,5,1,Math.PI);sign(['← CELLBLOCK A / DEEPWELL →'], -25,3.2,1.5,7,.8);
 buildFoundryTimber(w,{root,box,wall,roof,sign,lamp,guard,stone,iron,rust,wood,trim});w.trainingGates=[];w.motes=new T.InstancedMesh(w.geometry,new T.MeshBasicMaterial({visible:false}),32);w.matrix=new T.Matrix4();
}

import {buildFoundryTimber} from './foundry-timber.js?v=82.3';
import * as T from '../../vendor/three.module.js';
import {surfaceTexture} from '../engine/surface-textures.js?v=82.3';
import {createPickaxe} from '../engine/pickaxe.js?v=82.3';
import {CAMPUS_FLOORS,PIT,inBox,terraceFloor} from './foundry-layout.js?v=82.3';
export function buildFoundryPrison(w){
 const root=new T.Group();root.name='NEW BLOCK 07 / intake, H-cellblock, terraced Deepwell';w.scene.add(root);w.foundry=root;const stone=0x535258,iron=0x30343b,rust=0x884633,trim=0x9a8b77,wood=0x745239;
 const box=(x,y,z,a,b,c,color=stone,solid=false)=>w.box(x,y,z,a,b,c,color,solid,root);
 const sign=(lines,x,y,z,a=5,b=1,angle=0)=>w.sign(lines,x,y,z,a,b,angle,root);
 const lamp=(x,y,z,power=45)=>{box(x,y+.12,z,.7,.2,.6,iron);const bulb=box(x,y,z,.45,.1,.35,0xffc28b);bulb.material=new T.MeshBasicMaterial({color:0xffc28b});bulb.userData.prisonBulb=true;const l=new T.PointLight(0xffbb7b,power,13,2);l.position.set(x,y-.3,z);l.userData.workLight=true;root.add(l);};
 const wall=(x,z,a,c,h=7)=>box(x,1+h/2,z,a,h,c,stone,true);
 const roof=(x,z,a,c,y=8.2)=>box(x,y,z,a,.3,c,iron,true);
 const guard=(x,z,angle=0)=>{const g=new T.Group();for(const [y,a,b,c,color]of [[.6,.5,1.1,.45,iron],[1.45,.7,.8,.5,0x596363],[2.1,.5,.5,.5,0xae8b6c],[2.42,.65,.15,.6,iron]]){const m=new T.Mesh(w.geometry,w.mat(color));m.position.y=y;m.scale.set(a,b,c);g.add(m);}g.position.set(x,1,z);g.rotation.y=angle;root.add(g);};
 w.floorMat=new T.MeshStandardMaterial({map:surfaceTexture('paving'),roughness:.97});w.skyLight=new T.HemisphereLight(0xcbd9e8,0x69584b,1.8);w.sun=new T.DirectionalLight(0xffdfb3,2);w.sun.position.set(-15,30,10);w.sun.castShadow=true;w.sun.shadow.autoUpdate=false;w.sun.shadow.needsUpdate=true;w.sun.shadow.mapSize.set(1024,1024);Object.assign(w.sun.shadow.camera,{left:-55,right:35,top:65,bottom:-45,near:1,far:120});w.sun.shadow.bias=-.001;w.sun.shadow.normalBias=.035;w.yardFill=new T.HemisphereLight(0xe8d3af,0x534b44,.4);w.scene.add(w.skyLight,w.sun,w.yardFill);
 // Perimeter encloses the new first-shift campus; the foundation continues below the quarry.
 box(-10,-8,15,84,2,116,0x454448);
 for(const [a,b,c,d]of [[-50,-42,-40,82],[-18,28,-40,82],[-42,-18,-40,-32],[-42,-18,-10,82]])box((a+b)/2,-3.5,(c+d)/2,b-a,9,d-c,0x625e59);wall(-50,21,1,122,13);wall(28,50,1,64,13);wall(28,-36,1,8,13);wall(47,18,38,1,13);wall(66,-7,1,50,13);wall(47,-32,38,1,13);for(const z of [-40,82])wall(-11,z,79,1,13);for(const x of [-49,27])for(const z of [-39,81]){box(x,13,z,3,5,3,iron);roof(x,z,4.5,4.5,15.7);}
 // Floors follow the NEW footprints. No old yard, trees or combat court is constructed.
 for(const [a,b,c,d]of CAMPUS_FLOORS){if(a===-46)continue;box((a+b)/2,.5,(c+d)/2,b-a,1,d-c,0x797269);}
 for(let x=-46;x< -12;x++)for(let z=-36;z< -8;z++){const h=inBox(x+.5,z+.5,PIT)?terraceFloor(x+.5,z+.5):1;box(x+.5,h-1,z+.5,1,2,1,0x66615b);}
 // Arrival court and transport: arrival starts outside reception, facing a staffed entrance.
 box(1,2.5,76,3.2,3,5.2,0x394144,true);box(1,4.1,76,3.3,.25,5.4,iron);for(const z of [74.3,77.7])for(const x of [-.7,2.7])box(x,1.1,z,.35,1.2,.9,iron);box(2.64,3,75,.08,1,2,0x151c22);for(const z of [74.4,74.9,75.4,75.9])box(2.7,3,z,.08,1,.06,trim);sign(['PRISON TRANSPORT','BLOCK 07'],2.73,2.3,76.3,2,.55,Math.PI/2);
 for(const x of [1.8,6.2])box(x,3,66.7,.18,4,1.6,iron);guard(7,67,Math.PI);sign(['RECEPTION ↑','FOLLOW THE AMBER LINE'],8.5,4.5,68,4.3,.9,0);for(const z of [78,75,72,69,64,61,58])box(4,1.035,z,.16,.025,1.7,0xbf995c);lamp(7,6,68,70);
 // Southern reception is a dogleg of separate processing rooms, not a long intake tube.
 wall(-.3,55,.6,22);wall(8.3,61,.6,2);wall(8.3,47,.6,2);wall(1,66,2,.6);wall(7,66,2,.6);box(4,7.3,66,4,1,.6,iron,true);wall(4,46,9,.6);roof(4,55,9,22);
 wall(15,60,14,.6);wall(22.3,49,.6,22);wall(8,42,.6,8);wall(15,38,6,.6);wall(20,38,4,.6);roof(15,49,15,22);
 // Physical processing counters and ledger landmarks.
 sign(['PROPERTY / RECEIPTS'],.8,4.6,53,4,.7,Math.PI/2);box(2,3.05,56,.55,.1,.8,0xc7b58c);box(19.1,2.88,53,.7,.1,.8,0xc7b58c);box(19,2.9,54,.18,.2,.18,iron);
 // Records/tool partition with a clear central doorway.
 wall(10,48,4,.5,5.7);wall(20,48,4,.5,5.7);box(15,7.3,48,6,1,.6,iron,true);
 for(const x of [8,12])wall(x,34,.4,8,5.5);roof(10,34,4.5,8,6.7);
 sign(['BLOCK 07 / RECEPTION','SEARCH · REGISTER · TOOL ISSUE'],4,6.7,66.4,8,1.2,0);
 sign(['01 / SEARCH','E / REPORT ON THE MARKER'],4,4.9,59,5,1,Math.PI);box(4,1.035,56,3,.03,2,0xb29261);guard(1.4,56);box(1.6,2,56,1.3,2,3,iron,true);
 for(const z of [50,52,54])box(1,2.4,z,1,2.8,1.2,iron,true);
 box(20,1.9,53,3,1.8,5,wood,true);guard(20,55);sign(['02 / RECORDS','E / REGISTER · CELL 07'],21.95,5,53,6,1,-Math.PI/2);
 box(20,1.9,43,3,1.8,5,wood,true);for(let z=40.7;z<=45;z+=.4)box(21.6,3.8,z,.08,2.2,.08,iron);sign(['03 / TOOL ISSUE','E / REGISTERED PICKAXE'],21.95,5,43,6,1,-Math.PI/2);
 const pick=createPickaxe(0);pick.position.set(19,3.4,43);pick.rotation.set(0,Math.PI/2,-.7);pick.scale.setScalar(.65);root.add(pick);w.issuedPick=pick;
 w.intakeGates=[];for(const [x,z,axis,stage]of [[8,53,'x',1],[15,48,'z',2],[10,38,'z',3]]){const bars=new T.Group();bars.position.set(x,0,z);w.scene.add(bars);const span=stage===2?5.5:stage===1?14:3.5;for(let n=-span/2;n<=span/2;n+=.4){const m=new T.Mesh(w.geometry,w.mat(iron));m.scale.set(axis==='x'?.16:.09,4,axis==='x'?.09:.16);m.position.set(axis==='x'?0:n,3,axis==='x'?n:0);bars.add(m);}w.intakeGates.push({bars,stage,bounds:new T.Box3(new T.Vector3(x-(axis==='x'?.2:span/2),1,z-(axis==='x'?span/2:.2)),new T.Vector3(x+(axis==='x'?.2:span/2),5,z+(axis==='x'?span/2:.2)))});}
 for(const [x,z]of [[4,61],[4,51],[15,55],[15,43],[10,34]])lamp(x,6.5,z);
 sign(['PROCESSING COMPLETE','REPORT TO CELLBLOCK A / AMBER LINE'],10,5.5,37.7,5,1,Math.PI);
 // Compact roll-call court: residence west, pay south-east, industrial route north-west.
 for(const [x,z,a,c]of [[-8,18,.6,24],[18,18,.6,12],[5,30,6,.6]])wall(x,z,a,c,7);
 wall(18,6,.6,4,7);box(18,7.3,10,.6,2,4,iron,true);
 for(const [x,z]of [[-5,8],[15,8],[-5,27]]){box(x,4,z,.18,6,.18,iron,true);lamp(x,7,z,65);}
 sign(['ROLL CALL / 07','REPORT. WORK. RETURN.'],3,5.6,4.3,8,1);for(const z of [12,16,20])box(3,1.035,z,12,.03,.1,0xbfa777);
 // Pay office is a complete small occupied room, off the everyday return route.
 for(const [x,z,a,c]of [[22,29,.5,10],[17.5,34,9,.5],[20,24,4,.5]])wall(x,z,a,c,5.5);roof(16,29,13,11,6.8);box(16,1.9,32,8,1.8,1.2,wood,true);guard(16,33);lamp(16,6,28,65);sign(['PAY OFFICE / FORGE','E / WEIGH YOUR HAUL'],14,5.5,24.3,6,1);
 // H-shaped cellblock: two deep cell rows around a real dayroom, north entrance.
 for(const x of [-42,-16])wall(x,17,.6,26,8.5);wall(-29,30,26,.6,8.5);roof(-29,17,27,27,9.8);
 for(const [x,a]of [[-37,10],[-20,8]])wall(x,4,a,.6,8.5);box(-29,8.7,4,6,2,.6,iron,true);
 sign(['CELLBLOCK A','CELL 07 / WEST ROW'], -29,7.7,3.6,8,1,Math.PI);
 for(const z of [10,17,24]){for(const x of [-38.5,-19.5]){wall(x,z-3.3,7,.3,5);box(x,1.5,z,2.1,1,3.8,iron,true);box(x,2.05,z,2,.15,3.6,0xc6ba9d);box(x,2.2,z+1,1.7,.15,.7,0xd8c9af);}for(const [x,angle]of [[-35,Math.PI/2],[-23,-Math.PI/2]]){box(x,3,z-2.3,.2,4,1.4,rust,true);box(x,3,z+2.3,.2,4,1.4,rust,true);for(const dz of [-2.6,-2.2,-1.8,1.8,2.2,2.6])box(x,3.3,z+dz,.12,1,.07,iron);sign([x===-35&&z===24?'CELL 07 / ASSIGNED':'CELL '+(z+x+60),'PRISON PROPERTY'],x+(x===-35?.13:-.13),4.8,z,3.8,.7,angle);}}
 // The assigned bed's interaction position is beside it, never inside collision geometry.
 box(-40,1.7,22,1,1.4,1.1,wood,true);sign(['CELL 07 / E TO REST','REPORT FOR DUTY AFTER ROLL CALL'],-41.65,4.1,24,5,1,Math.PI/2);
 box(-26.5,1.8,17,2,1.6,2,wood,true);for(const z of [8,16,24])lamp(-29,8.8,z,70);
 box(-24,6.4,17,1.4,.25,24,iron,true);for(const z of [7,12,18,24,28])box(-24.7,7,z,.08,1.2,.08,iron);box(-24.7,7.6,17,.08,.1,24,iron);
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
 for(const [x,z,a,c]of [[10,34,.12,8],[7,30,6,.12],[4,15,.12,30],[-12.5,1,33,.12],[-29,13,.12,24],[-22,1,14,.12],[-15,-5,.12,12]])box(x,1.035,z,a,.025,c,0xbf995c);
 sign(['CELLBLOCK A ←','FIRST: REPORT TO CELL 07'],3,4,29.6,5,1,Math.PI);sign(['← CELLBLOCK A / DEEPWELL →'], -25,4,1.5,7,.8);
 buildFoundryTimber(w,{root,box,wall,roof,sign,lamp,guard,stone,iron,rust,wood,trim});w.trainingGates=[];w.motes=new T.InstancedMesh(w.geometry,new T.MeshBasicMaterial({visible:false}),32);w.matrix=new T.Matrix4();
}

import * as T from '../../vendor/three.module.js';
import {ArrivalWorld} from './prison-arrival.js?v=86';
import {groundHeight,inPreview} from './arrival-layout.js?v=86';
import {ARRIVAL_SCALE as S,ARRIVAL_Y as Y,ARRIVAL_Z as Z} from './foundry-layout.js?v=86';
import {batchScenery} from '../engine/static-batch.js?v=86';
import {createPickaxe} from '../engine/pickaxe.js?v=86';
export const arrivalLocal=(x,z)=>({x:x/S,z:(z-Z)/S});
export const insideArrival=(x,z)=>{const p=arrivalLocal(x,z);return inPreview(p.x,p.z);};
export const arrivalFloor=(x,z)=>{const p=arrivalLocal(x,z);return 1+Y*groundHeight(p.x,p.z);};
export function buildArrivalCampus(w){
 const staging=new T.Scene(),art=new ArrivalWorld(staging,{integrated:true,lighting:false});
 const transform=new T.Matrix4().makeScale(S,Y,S);transform.setPosition(0,1,Z);
 for(const child of [...staging.children]){child.applyMatrix4(transform);w.scene.add(child);}
 for(const b of art.blockers)w.blockers.push(b.clone().applyMatrix4(transform));
 // Architecture is compressed around the player; people retain adult proportions.
 for(const officer of art.officers)officer.scale.set(1/S,1/Y,1/S);
 art.scene=w.scene;w.arrival=art;const originalBlockers=art.blockers.length;
 w.scene.traverse(o=>{if(o.isPointLight&&o.parent===w.scene){o.userData.alwaysOn=true;o.intensity*=.68;o.distance*=.85;}});
 const B=(...a)=>art.box(...a),F=(...a)=>art.surface(...a);
 // A real doorway connects Reception to a compact, staffed tool-control room.
 const top=4.05;
 F(9.36,.932,46.4,3.2,.16,9.2,0xc9c1ab,'ground');
 for(const x of [7.7,11.02])F(x,2.5,46.4,.22,3,9.2,0xc6c5b7,'brick',true);
 F(9.36,top,46.4,3.5,.22,9.2,0xa7aa98,'stone',true);
 for(const x of [8.12,10.6])B(x,2.1,50.65,.14,2.2,.45,0x4a5b56,'metal',true);
 B(9.36,3.27,50.65,2.62,.18,.45,0x4a5b56,'metal');
 const issueDoor=new T.Group();issueDoor.position.set(9.36,0,50.65);w.scene.add(issueDoor);
 B(0,2.1,0,2.32,2.2,.14,0x88553d,'metal',false,issueDoor);B(0,2.5,.085,1.1,.45,.03,0x2b4440,'',false,issueDoor);
 const exitDoor=new T.Group();exitDoor.position.set(9.36,0,42);w.scene.add(exitDoor);B(0,1.45,0,2.7,.9,.14,0x495e57,'metal',false,exitDoor);for(let x=-1.2;x<=1.2;x+=.3)B(x,2.55,0,.065,1.3,.1,0x4a5e55,'metal',false,exitDoor);B(0,3.2,0,2.7,.12,.14,0x4a5e55,'metal',false,exitDoor);
 // Shutters retract into a housing above the lintel, never float above the roof.
 F(9.36,4.7,42,3.15,2.1,.5,0x526159,'metal');
 w.intakeGates=[{bars:issueDoor,stage:2,bounds:new T.Box3(new T.Vector3(8.16,1,50.4),new T.Vector3(10.56,3.4,50.9))},{bars:exitDoor,stage:3,bounds:new T.Box3(new T.Vector3(7.9,1,41.8),new T.Vector3(10.85,3.4,42.2))}];
 // The waist-height cage counter is to the left of a clear walk-through lane.
 F(8.2,1.5,46.4,.85,1,2.1,0x526159,'metal',true);F(8.2,2.07,46.4,1,.14,2.2,0xb2a385,'wood',true);
 art.sign(['TOOL CONTROL'],9.36,3.53,50.45,2,.28,Math.PI);
 art.sign(['REGISTERED ISSUE'],8.72,1.65,46.4,1.5,.25,Math.PI/2,true);
 art.sign(['YARD / CELLBLOCK A'],9.36,3.46,42.14,2.2,.28);
 for(const z of [44,48.5]){const l=art.lamp(9.36,3.82,z,24,6);l.userData.alwaysOn=true;}
 const pick=createPickaxe(0);pick.position.set(8.28,2.66,46.4);pick.rotation.set(.08,-Math.PI/2,-.45);pick.scale.setScalar(.36);w.scene.add(pick);w.issuedPick=pick;
 const local=arrivalLocal(8.05,44.6),officer=art.officer(local.x,local.z,-Math.PI/2);officer.scale.set(1/S,1/Y,1/S);
 // A small property tray and paper receipt give the first action a physical location.
 B(.288,2.12,53.5,.52,.05,.48,0x445b52,'metal');B(.288,2.15,53.5,.38,.02,.32,0xcabb9a);
 art.sign(['PROPERTY'],.288,1.58,53.65,.85,.18,0,true);
 // Short supervised release passage. Openings align with both the counter and yard.
 F(9.36,.932,36,3.2,.16,12,0xc9c1ab,'ground');
 for(const x of [7.7,11.02])F(x,2.5,36,.22,3,12,0xc6c5b7,'brick',true);
 F(9.36,4.05,36,3.5,.22,12,0xa7aa98,'stone',true);
 for(const z of [33,38]){const l=art.lamp(9.36,3.82,z,20,6);l.userData.alwaysOn=true;}
 for(let z=31;z<42;z+=1.2)B(9.4,1.017,z,.07,.015,.6,0xb99a60);
 art.sign(['CELLBLOCK A  ←','DEEPWELL / FIRST SHIFT'],9.36,3.35,30,2.3,.45);
 // New surfaces use the same cached materials as the approved scene.
 w.blockers.push(...art.blockers.slice(originalBlockers));
 w.arrivalStats=batchScenery(w.scene,art.geometry,[art.dynamic,issueDoor,exitDoor,pick]);
}
export function buildCompactCells(w){
 const a=w.arrival,start=a.blockers.length,B=(...x)=>a.box(...x),F=(...x)=>a.surface(...x),stone=0xc6c5b7,steel=0x435751;
 const wall=(x,z,width,depth,h=3.5)=>F(x,1+h/2,z,width,h,depth,stone,'brick',true);
 // One storey of believable occupied cells around a four-metre inspection aisle.
 F(-26,.952,14.5,13,.12,19,0xc9c1ab,'ground');
 wall(-32.5,14.5,.3,19);wall(-19.5,8.5,.3,7);wall(-19.5,20,.3,8);B(-19.5,4.2,14,.3,.6,4,0x8d9789,'stone',true);
 wall(-26,24,13,.3);wall(-30.3,5,4.4,.3);wall(-26,5,4,.3);wall(-21.7,5,4.4,.3);F(-26,4.18,5,4,.65,.4,0x8d9789,'stone',true);
 F(-26,4.58,14.5,13.6,.24,19.6,0x65716a,'stone',true);B(-26,4.78,14.5,13.8,.12,19.8,steel,'metal');
 a.sign(['CELLBLOCK A'], -26,3.65,4.8,3.3,.42,Math.PI);
 a.sign(['07 / WEST ROW'], -25,2.7,7.3,1.3,.22,Math.PI);
 for(const [i,z]of [8.4,13.8,19.4].entries()){
  for(const side of [-1,1]){
   const outer=side<0?-30.2:-21.8,front=side<0?-28:-24,assigned=side<0&&i===2;if(side>0&&i===1){a.sign(['INSPECTION / CELLBLOCK A'],-24.1,3.2,14,2.7,.3,Math.PI/2);continue;}
   wall(outer,z-2.55,4.3,.18,3.15);
   // Clear 1.25 m door in an iron frontage, without a collision strip across the opening.
   for(const dz of [-1.65,1.65]){B(front,2.1,z+dz,.12,2.2,1.7,0x825b44,'metal',true);for(const d of [-.5,0,.5])B(front+(side<0?.075:-.075),2.7,z+dz+d,.06,.52,.06,steel,'metal');}
   B(front,3.36,z,.15,.2,5.1,steel,'metal',true);
   if(!assigned){B(front,2.1,z,.13,2.2,1.25,0x825b44,'metal',true);for(const d of [-.38,0,.38])B(front,2.68,z+d,.15,.55,.055,steel,'metal');}
   else B(front-.78,2.1,z+.7,1.5,2.2,.12,0x825b44,'metal',true);
   const n=assigned?'07':String(side<0?i+1:i+4).padStart(2,'0');
   a.sign(['CELL '+n],front+(side<0?.09:-.09),3.03,z,.9,.22,side<0?Math.PI/2:-Math.PI/2,true);
   B(outer,1.24,z,.94,.46,2.05,steel,'metal',true);B(outer,1.52,z,.91,.12,2,0xbbb49e);B(outer,1.61,z+.7,.78,.13,.45,0xd4ccb5);
   // Narrow barred daylight slot, locker and writing shelf.
   B(side<0?-32.33:-19.67,3.07,z,.1,.7,1.2,0x334b48,'metal');for(const d of [-.4,0,.4])B(side<0?-32.23:-19.77,3.07,z+d,.08,.7,.05,0x748477,'metal');
   B(outer,1.8,z-1.65,.7,1.6,.55,0x637366,'metal',true);B(outer,1.86,z+1.7,.85,.1,.55,0xa18159,'wood',true);
   if(assigned){a.sign(['ASSIGNED / 07'],outer,2.56,z+2.42,1.35,.2,Math.PI,true);B(outer,1.92,z+1.7,.36,.015,.28,0xd1c2a0);}
   a.contact(outer,z,2.8,4,.2,1.015);const roomLight=a.lamp(outer,3.88,z,15,5.5,0xffd7a0);roomLight.userData.alwaysOn=true;
  }
  const l=a.lamp(-26,4.25,z,24,7,0xffd4a0);l.userData.alwaysOn=true;
 }
 // Direct supervised passage from roll call, replacing the long detour around the block.
 F(-13.75,.932,14,11.5,.16,4,0xc9c1ab,'ground');
 for(const z of [11.85,16.15]){wall(-13.6,z,11.8,.22,2.7);B(-13.6,3.9,z,11.8,.14,.35,steel,'metal');}
 F(-13.6,4.05,14,11.8,.2,4.5,0x8d9789,'stone',true);
 for(const x of [-11,-17]){const l=a.lamp(x,3.8,14,22,6);l.userData.alwaysOn=true;}
 a.sign(['CELLBLOCK A'], -7.83,3.15,14,2.5,.35,Math.PI/2);
 a.sign(['CELL 07 / WEST ROW'], -27.8,2.85,14,2.4,.3,Math.PI/2,true);
 a.sign(['CELL 07','YOUR ASSIGNED QUARTERS'],-29.6,2.7,23.82,2.5,.36,Math.PI,true);
 w.blockers.push(...a.blockers.slice(start));
 w.cellStats=batchScenery(w.scene,a.geometry,[a.dynamic,...w.intakeGates.map(g=>g.bars),w.issuedPick]);
}

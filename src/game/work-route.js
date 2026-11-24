import {intakeInteraction} from './foundry-arrival.js?v=92';
import {arrivalRoute} from './foundry-layout.js?v=92';
import {containmentInside} from './foundry-layout.js?v=92';
import {rangeInside} from './foundry-range-layout.js?v=92';
import {timberInside} from './foundry-timber-layout.js?v=92';
// Ordered, physical portals. Project onto the nearest segment so passing a doorway
// advances the route even when the player is off-centre or overshoots a turn.
export function followRoute(p,points){
 let best=null;
 for(let i=0;i<points.length-1;i++){
  const a=points[i],b=points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],length=dx*dx+dz*dz;
  const t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(length||1))),distance=Math.hypot(p.x-a[0]-dx*t,p.z-a[1]-dz*t);
  if(!best||distance<best.distance-.01||(Math.abs(distance-best.distance)<.01&&i>best.i))best={i,t,distance};
 }
 if(!best)return null;
 let next=best.i+1;
 // Only consume a turn after reaching it, never cut a corner through its wall.
 while(next<points.length-1&&Math.hypot(p.x-points[next][0],p.z-points[next][1])<.12)next++;
 const q=points[next];return {x:q[0],z:q[1],name:q[2]};
}
const cellEntry=[[-7,14,'Cellblock A / west passage'],[-26,14,'Inspection aisle / turn left'],[-26,19.4,'Cell 07 / lit doorway'],[-27,19.4,'E / Register Cell 07']];
const mineEntry=[[7,16,'Amber line / Deepwell'],[7,4,'Deepwell entrance'],[7,-8.8,'Through the work passage'],[7,-12,'Work landing / turn left'],[3,-12,'Amber ramp / ore on your left'],[3,-17,'Starter face / hold left click']];
const payEntry=[[7,16,'Return to the yard'],[7,22,'Pay Office / turn east'],[10.8,22,'Pay Office doorway'],[13,22,'Enter the Pay Office'],[17.5,22,'E / Sell at the counter']];
export const DUTY_ROUTES={
 cell:cellEntry,mine:mineEntry,pay:payEntry,
 timber:[[7,22,'Leave Pay Office approach'],[7,14,'Work yard'],[15,14,'Timber checkpoint approach'],[15,10,'Timber Detail / clearance 2'],[23.5,10,'Weighing house'],[23.5,-24,'Saw Works / turn right'],[42,-24,'Logging yard entrance'],[42,-12,'Felling yard']],
 attack:[[7,16,'Work yard'],[7,28,'Containment approach'],[14.5,28,'Containment / clearance 3'],[14.5,34,'Holding passage / turn left'],[25,34,'Holding hall approach'],[25,41,'Containment Detail']],
 archery:[[7,16,'Work yard'],[7,28,'Eastern wing approach'],[16,28,'Bow checkpoint approach'],[16,29,'Bow Qualification / clearance 4'],[32,29,'Armoury passage / turn right'],[32,36,'Long Room / turn left'],[43,36,'Range apron'],[44.5,30,'Bow Qualification / firing line']]
};
function exitToYard(p){
 if(p.x< -19&&p.z>5){if(p.x< -28)return {x:-26,z:19.4,name:'Leave Cell 07 through its door'};return followRoute(p,[[ -26,22,'Inspection aisle'],[-26,14,'East passage to yard'],[-7,14,'Return to yard'],[7,14,'Work yard']]);}
 if(p.x< -7&&p.z>5)return {x:-7,z:14,name:'East passage to yard'};
 if(p.x>7.5&&p.x<22&&p.z>17&&p.z<27)return followRoute(p,[[20,22,'Pay counter'],[13,22,'Pay Office doorway'],[10.8,22,'Leave the Pay Office'],[7,22,'Work yard']]);
 if(p.z<4&&p.x<19){
  if(p.y<2.4&&p.z< -12){if(Math.abs(p.x-3)>.6)return {x:3,z:Math.max(-25,p.z),name:'Reach the permanent amber ramp'};return {x:3,z:-11.5,name:'Climb the amber ramp'};}
  return followRoute(p,[[3,-25,'Permanent ramp'],[3,-12,'Ramp landing'],[7,-12,'Yard exit / turn right'],[7,4,'Through Deepwell entrance'],[7,14,'Return to yard']]);
 }
 if(rangeInside(p))return followRoute(p,[...DUTY_ROUTES.archery].reverse());
 if(containmentInside(p))return followRoute(p,[...DUTY_ROUTES.attack].reverse());
 if(timberInside(p))return followRoute(p,[...DUTY_ROUTES.timber].reverse());
 if(p.x>11&&p.z>=27&&p.z<32)return {x:7,z:28,name:'Return along the checkpoint approach'};
 if(p.x>11&&p.z<17)return {x:10.8,z:Math.max(10,p.z),name:'Return to the west side of Pay Office'};
 return null;
}
export function workRoute(p,stage,haul=false,destination=null){
 if(stage<3){
  if(intakeInteraction(stage,p)?.ready)return null;
  if(stage===2)return followRoute(p,[[2.88,56,'Tool Control / right-hand doorway'],[9.36,54,'Tool Issue / authorised entry'],[9.36,49.1,'Collect your assigned pickaxe'],[9.36,46.4,'E / collect pickaxe']]);
  if(p.z<60)return {x:2.88,z:56.3,name:stage===0?'Reception / belongings register':'Reception / duty officer'};
  return followRoute(p,arrivalRoute.map((q,i)=>[...q,['Transport aisle','Front-right exit','Step down to the bay','Reception portico','Reception doors / walk forward','Reception counter'][i]]));
 }
 const goal=stage===3?'cell':stage===4?(haul?'pay':'mine'):destination;
 if(!goal||!DUTY_ROUTES[goal])return null;
 if(p.z>37&&p.x>=7&&p.x<=11)return {x:9.36,z:27,name:'Release passage / enter yard'};
 const inCell=p.x< -7&&p.z>5,inMine=p.z<4&&p.x<19,inPay=p.x>7&&p.x<22&&p.z>17&&p.z<27;
 const own=(goal==='cell'&&inCell)||(goal==='mine'&&inMine)||(goal==='pay'&&inPay)||(goal==='timber'&&(timberInside(p)||(p.x>=10&&p.z>=6&&p.z<17)))||(goal==='attack'&&(containmentInside(p)||(p.x>=7&&p.x<=16.5&&p.z>=27&&p.z<32)))||(goal==='archery'&&(rangeInside(p)||(p.x>=7&&p.x<=18&&p.z>=27&&p.z<31)));
 if(!own){const exit=exitToYard(p);if(exit)return exit;}
 if(goal==='pay'&&p.x<12.5&&p.x>9&&p.z<27&&Math.abs(p.z-22)>.4)return {x:10.8,z:22,name:'Pay Office / align with doorway'};
 if(goal==='cell'&&p.x> -7&&Math.abs(p.z-14)>.8)return {x:4,z:14,name:'Cellblock A / west passage'};
 return followRoute(p,DUTY_ROUTES[goal]);
}
export function routeHint(p,yaw,target){if(!target)return '';const dx=target.x-p.x,dz=target.z-p.z,bearing=Math.atan2(-dx,-dz),delta=Math.atan2(Math.sin(bearing-yaw),Math.cos(bearing-yaw));const arrow=Math.abs(delta)<.5?'↑':Math.abs(delta)>2.4?'↓':delta>0?'←':'→';return arrow+' '+target.name+' · '+Math.max(1,Math.round(Math.hypot(dx,dz)))+' m';}

// Waypoints follow real doors/passages; never point through the cell wall or across the pit.
export function workRoute(p,stage,haul=false){
 const target=(x,z,name)=>({x,z,name});
 if(stage===3){if(p.z>30)return target(9.36,27,'Enter the yard');if(p.x> -8)return target(-7,14,'Cellblock A / west passage');if(p.x> -24)return target(-26,14,'Cellblock A');if(p.z<18.5)return target(-26,19.4,'Cell 07 / left side');return target(-27,19.4,'Cell 07');}
 if(stage!==4)return null;
 if(p.x< -19&&p.z>5){if(p.x< -28)return target(-26,19.4,'Leave Cell 07');if(Math.abs(p.z-14)>1)return target(-26,14,'East passage to yard');return target(-7,14,'Return to the yard');}
 if(p.x< -7&&p.z>5)return target(-7,14,'Return to the yard');
 if(haul){
  if(p.z< -12&&p.y<2.4){if(Math.abs(p.x-3)>.6)return target(3,p.z< -24?-25:p.z,'Reach the amber ramp');return target(3,-11.5,'Climb the amber ramp');}
  if(p.z< -10){if(p.x<5)return target(7,-12,'Yard exit');return target(7,14,'Return to the yard');}
  if(p.x<11.6&&Math.abs(p.z-22)>.8)return target(10.8,22,'Pay Office / east entrance');if(p.x<12.5)return target(13,22,'Enter the Pay Office');return target(17.5,22,'Pay Office counter');
 }
 if(p.x>12&&p.z>17&&p.z<27)return target(10.8,22,'Leave the Pay Office');if(p.z> -10){if(p.z>8||Math.abs(p.x-7)>.8)return target(7,7,'Deepwell / amber line');return target(7,-10,'Enter Deepwell');}if(p.z> -11.7)return target(7,-12,'Work landing / straight ahead');if(p.x>4)return target(3,-12,'Work face / turn left');return target(1,-17,'Ore face / hold to mine');
}
export function routeHint(p,yaw,target){if(!target)return '';const dx=target.x-p.x,dz=target.z-p.z,bearing=Math.atan2(-dx,-dz),delta=Math.atan2(Math.sin(bearing-yaw),Math.cos(bearing-yaw));const arrow=Math.abs(delta)<.5?'↑':Math.abs(delta)>2.4?'↓':delta>0?'←':'→';return arrow+' '+target.name+' · '+Math.max(1,Math.round(Math.hypot(dx,dz)))+' m';}

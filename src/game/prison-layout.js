// Shared coordinates for geometry, collision, wayfinding and tests.
export const PRISON_SPAWN=[.5,2.65,32];
export const WINGS=[{x:-30,z:4},{x:-30,z:-32},{x:-30,z:-69},{x:30,z:-69}];
export const TIMBER_UNLOCK=20;
export const prisonLevel=s=>s.mined>=TIMBER_UNLOCK?2:1;
export const gateOpen=(s,index)=>index===4?prisonLevel(s)>=2:index<=s.rank;
export const PATHS=[[-14,14,8,41],[-4,4,-61,12],[-33,4,13,19],[-33,-27,11,16],[-33,4,-23,-17],[-33,-27,-25,-20],[-33,33,-60,-54],[-33,-27,-62,-57],[27,33,-62,-57],[12,20,15,21],[18,43,4,34],[-7,7,39,49]];
export function onPath(x,z){return PATHS.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);}
export function wingAt(x,z){return WINGS.findIndex((p,i)=>x>=p.x-[10,11,12,12][i]&&x<p.x+[11,12,13,13][i]&&z>=p.z-[18,21,22,23][i]&&z<p.z+9);}
export function areaAt(x,z){const i=wingAt(x,z);if(i>=0)return i;if(x>=18&&z>=4&&z<=34)return 4;return -1;}
export const GATES=WINGS.map((p,i)=>({index:i,x:p.x+.5,z:p.z+8.6,axis:'z'})).concat({index:4,x:16,z:18,axis:'x'});

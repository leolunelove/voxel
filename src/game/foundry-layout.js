export const PRISON_SPAWN=[4,2.65,16],CELL_WAKE=[-36.2,2.65,24];
export const inBox=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const atBed=p=>Math.hypot(p.x+36.2,p.z-24)<2.4;
export const atPayOffice=p=>Math.hypot(p.x-14,p.z-27)<4;
export const inIntake=p=>p.z>=37;
export const inHunt=()=>false,inRange=()=>false,atDungeonGate=()=>false,prisonDepth=()=>0,trainingGateNear=()=>null,LABOUR_WINGS=[];
export const HUNT_OPTIONS={spawns:[],active:()=>false},RANGE_OFFSET={x:200,z:200};
export const CAMPUS_FLOORS=[[0,8,46,69.5],[-3,11,66,81.5],[8,22,48,60],[8,22,38,48],[8,12,29,39],[-8,18,4,30],[10,22,24,34],[-32,8,-2,6],[-32,-26,3,14],[-42,-16,4,30],[-18,-12,-12,1],[-46,-12,-36,-8]];
export const PIT=[-42,-18,-32,-10];
// Broad permanent terraces descend around an excavated centre. Ore is separate.
export function terraceFloor(x,z){if(x>=-26&&x< -18&&z>=-26&&z< -24)return -5;if(x>=-20&&x< -18&&z>=-24&&z< -12)return 1-Math.ceil((-z-12)*2)/4;
 const d=Math.min(x+42,-18-x,z+32,-10-z);return d<2?1:d<4?-1:d<6?-3:-5;}
export const arrivalRoute=[[4,69],[4,53],[16,53],[16,43],[10,43],[10,32],[4,16]];
export const cellRoute=[[4,16],[4,1],[-29,1],[-29,16],[-29,24],[-36.2,24]];
export const mineRoute=[[4,16],[4,1],[-15,1],[-15,-12],[-19,-12],[-19,-25],[-26,-25]];

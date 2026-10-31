export const PRISON_SPAWN=[7,2.65,16],CELL_WAKE=[-29.3,2.65,19.4];
export const inBox=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const atBed=p=>Math.hypot(p.x+29.3,p.z-19.4)<1.7;
export const atPayOffice=p=>Math.hypot(p.x-17.5,p.z-22)<2;
export const inIntake=p=>p.z>=37;
export const inHunt=()=>false,inRange=()=>false,atDungeonGate=()=>false,prisonDepth=()=>0,trainingGateNear=()=>null,LABOUR_WINGS=[];
export const HUNT_OPTIONS={spawns:[],active:()=>false},RANGE_OFFSET={x:200,z:200};
export const CAMPUS_FLOORS=[[-20,-7,12,16],[7.8,11,29,51.2],[-8,18,4,30],[12,22,17,27],[-32.5,-19.5,5,24],[4,10,-12,4],[-24,10,-36,-8]];
// Ore retains canonical coordinates for generation, exposure and excavation identity.
export const MINE_OFFSET=22,PIT=[-20,4,-32,-10];
// Broad permanent terraces descend around an excavated centre. Ore is separate.
export function terraceFloor(x,z){x-=MINE_OFFSET;if(x>=-26&&x< -18&&z>=-26&&z< -24)return -5;if(x>=-20&&x< -18&&z>=-24&&z< -12)return 1-Math.ceil((-z-12)*2)/4;
 const d=Math.min(x+42,-18-x,z+32,-10-z);return d<2?1:d<4?-1:d<6?-3:-5;}
export const cellRoute=[[4,16],[4,14],[-26,14],[-26,19.4],[-29.3,19.4]];
export const mineRoute=[[7,16],[7,-12],[3,-12],[3,-25],[-4,-25]];

export const ARRIVAL_SCALE=.72,ARRIVAL_Y=.9,ARRIVAL_Z=70;
export const arrivalPoint=(x,z)=>[x*ARRIVAL_SCALE,ARRIVAL_Z+z*ARRIVAL_SCALE];
export const arrivalRoute=[[0,78.5],[0,74.75],[3.9,74.75],[3.9,64.9],[2.88,60.64],[2.88,54.448]];

export const PRISON_SPAWN=[7,2.65,16],CELL_WAKE=[-29.3,2.65,19.4];
export const inBox=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const atBed=p=>Math.hypot(p.x+29.3,p.z-19.4)<1.7;
export const atPayOffice=p=>Math.hypot(p.x-17.5,p.z-22)<2;
export const inIntake=p=>p.z>=37;
export const CONTAINMENT={key:'attack',name:'CONTAINMENT DETAIL',level:3,blocks:60,gate:[14.5,30],axis:'z',bounds:[20,36,39,53],passages:[[12.5,16.5,29,36],[12.5,27,32,36],[23,27,32,40]]};
export const containmentInside=p=>inBox(p.x,p.z,CONTAINMENT.bounds)||CONTAINMENT.passages.some(b=>inBox(p.x,p.z,b));
export const containmentAccess=(state,hunt={})=>state.mined>=60||(hunt.xp??0)>0;
export const containmentRoute=[[7,26],[7,28],[14.5,28],[14.5,34],[25,34],[25,41]];
export const inHunt=p=>inBox(p.x,p.z,CONTAINMENT.bounds),inRange=()=>false,atDungeonGate=()=>false,prisonDepth=()=>0,trainingGateNear=p=>Math.abs(p.x-14.5)<2.5&&Math.abs(p.z-30)<2.5?CONTAINMENT:null,LABOUR_WINGS=[CONTAINMENT];
export const HUNT_OPTIONS={spawns:[[0,24,44,0],[1,32,44,0],[2,28,50,1]],bounds:[20.8,35.2,39.8,52.2],canAct:(e,p)=>e.hp<e.maxHp||Math.hypot(e.root.position.x-p.x,e.root.position.z-p.z)<5.2,active:inHunt},RANGE_OFFSET={x:200,z:200};
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

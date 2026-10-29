import {entryFloor,entryDepth,atUnderblockSeal} from './underblock-entry-rules.js?v=79.1';
export const PRISON_SPAWN=[0,2.65,9];
export const CELL_WAKE=[-15.6,2.65,27.2];
export const CELL_OFFSET={x:-28,z:11};
export const inBox=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const atBed=p=>p.x>-16.7&&p.x< -13.2&&p.z>26.8&&p.z<30.1;
export const atPayOffice=p=>Math.hypot(p.x-15,p.z-27)<5;
export const inCells=p=>inBox(p.x,p.z,[-23,-9,20,36]);
export const LABOUR_WINGS=[
 {key:'attack',name:'CONTAINMENT DETAIL',skill:'ATTACK',level:3,blocks:60,area:5,passage:10,color:'#e5a380',gate:[-20,8],axis:'x',bounds:[-48.5,-31.5,5,19.5],passages:[[-26,-19.5,6,10],[-27,-23,0,10],[-42,-23,0,4],[-42,-38,0,6]],route:[[-17,8],[-25,8],[-25,2],[-40,2],[-40,7]]},
 {key:'archery',name:'BOW QUALIFICATION',skill:'ARCHERY',level:4,blocks:120,area:6,passage:11,color:'#e5c38a',gate:[20,8],axis:'x',bounds:[32,50,5,16],passages:[[19.5,27,6,10],[23,27,0,10],[23,32,0,4],[28,32,0,12],[28,33,8,12]],route:[[17,8],[25,8],[25,2],[30,2],[30,10],[35,10]]}
];
export const inHunt=p=>inBox(p.x,p.z,LABOUR_WINGS[0].bounds);
export const inRange=p=>inBox(p.x,p.z,LABOUR_WINGS[1].bounds);
export const dutyWing=p=>LABOUR_WINGS.find(w=>inBox(p.x,p.z,w.bounds));
export const dutyPassage=p=>LABOUR_WINGS.find(w=>w.passages.some(b=>inBox(p.x,p.z,b)));
export const trainingGateNear=p=>LABOUR_WINGS.find(w=>Math.abs(p.x-w.gate[0])<3&&Math.abs(p.z-w.gate[1])<2.5);
export const HUNT_OPTIONS={bounds:[-47.5,-32.5,6.5,18.5],spawns:[[0,-44,11.5,0],[1,-36,12.5,0],[2,-40,16.5,1]],active:inHunt};
export const RANGE_OFFSET={x:11.5,z:1.5};
export const intakeFloor=(x,z)=>inBox(x,z,[-7,7,37,65])||inBox(x,z,[-4,4,63,69])||inBox(x,z,[-3,3,15.5,38]);
export const inIntake=p=>intakeFloor(p.x,p.z);
export const yardFloor=(x,z)=>inBox(x,z,[-19.5,19.5,-5,16])||inBox(x,z,[-23,-9,20,36])||inBox(x,z,[-18,-12,15,22])||inBox(x,z,[9,23,23,34])||inBox(x,z,[12,18,15,25]);
export const lowerFootprint=(x,z)=>inBox(x,z,[-6,6,-49,-29]);
export const lowerPassage=(x,z)=>inBox(x,z,[-.6,2.8,-30,-5]);
export const lowerFloor=(x,z)=>entryFloor(z+10,8-x);
export const atDungeonGate=p=>atUnderblockSeal({x:p.z+10,y:p.y,z:8-p.x});
export const prisonDepth=p=>entryDepth({x:p.z+10,y:p.y,z:8-p.x});

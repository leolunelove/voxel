import {INTAKE_REACH} from './rules.js?v=91';
export const SEARCH=[.288,54.448],CHECKIN=[2.88,54.448],TOOL_ISSUE=[9.36,46.4],CELL_CHECK=[-27,19.4];
export const INTAKE_SPAWNS=[[0,3.415,78.496],[.288,2.65,55.6],[9.36,2.65,53],[9.36,2.65,40]];
const inReach=(p,b)=>p.x>=b[0]&&p.x<=b[1]&&p.z>=b[2]&&p.z<=b[3]&&p.y>=INTAKE_REACH.eye[0]&&p.y<=INTAKE_REACH.eye[1];
export const intakeNear=(p,q)=>q===SEARCH||q===CHECKIN?inReach(p,INTAKE_REACH.counter):q===TOOL_ISSUE?inReach(p,INTAKE_REACH.issue):Math.hypot(p.x-q[0],p.z-q[1])<1.85;
// One source for the visible prompt and E action. No aim/pixel hotspot needed.
export function intakeInteraction(stage,p){
 const actions=['search','checkin','issue','cell'],labels=['Log belongings','Check in with duty officer','Collect assigned pickaxe','Read duty slip'];
 if(stage<0||stage>3)return null;
 const station=[SEARCH,CHECKIN,TOOL_ISSUE,CELL_CHECK][stage],ready=intakeNear(p,station);
 const hint=stage===0?(p.z>72?'Front-right transport door · step down into the bay':p.z>60?'Reception / through the illuminated doors ahead':'Approach the front of the Reception counter'):
 stage===1?'Approach the front of the Reception counter':stage===2?(p.z>50?'Tool Issue / through the door on your right':'Approach the issue counter on your left'):'Enter Cell 07 / assigned west-row quarters';
 return {action:actions[stage],label:labels[stage],ready,hint};
}
export function loadIntake(raw,work,hunt={}){if(raw?.version===3&&Number.isInteger(raw.stage)&&raw.stage>=0&&raw.stage<=5)return {version:3,stage:raw.stage};if(raw?.version===2)return {version:3,stage:raw.stage===4?5:Math.min(3,raw.stage??0)};return {version:3,stage:work.mined>0||work.money>0||hunt.xp>0?5:0};}
export function advanceIntake(s,action){if(['search','checkin','issue','cell','sell'][s.stage]!==action)return false;s.stage++;return true;}
export const intakeInstruction=s=>['Report to Reception','Register with the duty officer','Collect your pickaxe at Tool Issue','Report to Cell 07 · west of the yard','Mine your first haul · Deepwell, across the yard'][s.stage]??'';

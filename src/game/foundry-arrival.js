export const SEARCH=[.288,54.448],CHECKIN=[2.88,54.448],TOOL_ISSUE=[9.36,46.4],CELL_CHECK=[-27,19.4];
export const INTAKE_SPAWNS=[[0,3.415,78.496],[.288,2.65,55.6],[9.36,2.65,53],[9.36,2.65,40]];
export const intakeNear=(p,q)=>Math.hypot(p.x-q[0],p.z-q[1])<1.85;
export function loadIntake(raw,work,hunt={}){if(raw?.version===3&&Number.isInteger(raw.stage)&&raw.stage>=0&&raw.stage<=5)return {version:3,stage:raw.stage};if(raw?.version===2)return {version:3,stage:raw.stage===4?5:Math.min(3,raw.stage??0)};return {version:3,stage:work.mined>0||work.money>0||hunt.xp>0?5:0};}
export function advanceIntake(s,action){if(['search','checkin','issue','cell','sell'][s.stage]!==action)return false;s.stage++;return true;}
export const intakeInstruction=s=>['Report to Reception','Register with the duty officer','Collect your pickaxe at Tool Issue','Report to Cell 07 · west of the yard','Mine your first haul · Deepwell, across the yard'][s.stage]??'';

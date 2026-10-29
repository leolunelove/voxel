export const SEARCH=[4,56],CHECKIN=[16,53],TOOL_ISSUE=[16,43],CELL_CHECK=[-34,24];
export const INTAKE_SPAWNS=[[4,2.65,69],[11,2.65,53],[16,2.65,46],[10,2.65,36]];
export const intakeNear=(p,q)=>Math.hypot(p.x-q[0],p.z-q[1])<2.65;
export function loadIntake(raw,work,hunt={}){if(raw?.version===3&&Number.isInteger(raw.stage)&&raw.stage>=0&&raw.stage<=5)return {version:3,stage:raw.stage};if(raw?.version===2)return {version:3,stage:raw.stage===4?5:Math.min(3,raw.stage??0)};return {version:3,stage:work.mined>0||work.money>0||hunt.xp>0?5:0};}
export function advanceIntake(s,action){if(['search','checkin','issue','cell','sell'][s.stage]!==action)return false;s.stage++;return true;}
export const intakeInstruction=s=>['SEARCH / E on the property marker','RECORDS / E at the registration counter','TOOL ISSUE / E to collect your registered pickaxe','CELL 07 / Report to your assigned door in Cellblock A','FIRST SHIFT / Mine Deepwell · report haul at the Pay Office'][s.stage]??'';

// Search, registration, tool issue and first payment. No renderer owns progress.
export const SEARCH=[0,57],CHECKIN=[-3,50],TOOL_ISSUE=[3,43];
export const INTAKE_SPAWNS=[[0,2.65,67],[0,2.65,53],[0,2.65,46],[0,2.65,39]];
export function loadIntake(raw,work,hunt={}){if(raw?.version===2&&Number.isInteger(raw.stage)&&raw.stage>=0&&raw.stage<=4)return {version:2,stage:raw.stage};if(Number.isInteger(raw?.stage)&&raw.stage>=0&&raw.stage<=3)return {version:2,stage:raw.stage+1};return {version:2,stage:work.mined>0||work.money>0||work.chopped>0||hunt.xp>0||hunt.archeryXP>0?4:0};}
export const intakeNear=(p,point)=>Math.hypot(p.x-point[0],p.z-point[1])<2.65;
export function advanceIntake(s,action){if(['search','checkin','issue','sell'][s.stage]!==action)return false;s.stage++;return true;}
export const intakeInstruction=s=>['INTAKE / Stand on the search marker · E to report','RECORDS / E at the registration hatch · receive Cell 07 assignment','TOOL ISSUE / E at the cage · collect your registered pickaxe','FIRST ASSIGNMENT / Mine Deepwell · report your haul to the Pay Office'][s.stage]??'';

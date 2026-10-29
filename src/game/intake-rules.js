// An idempotent opening quest. Equipment is issued once, never bought twice.
export const INTAKE_SPAWNS=[[-54,2.65,-10],[-43,2.65,-10],[-34,2.65,-10]];
export const CHECKIN=[-46,-10],TOOL_ISSUE=[-35,-10];
export function loadIntake(raw,work,hunt={}){if(Number.isInteger(raw?.stage)&&raw.stage>=0&&raw.stage<=3)return {stage:raw.stage};if(work.mined>0||work.money>0||work.chopped>0||hunt.xp>0||hunt.archeryXP>0)return {stage:3};return {stage:0};}
export const intakeNear=(p,point)=>Math.hypot(p.x-point[0],p.z-point[1])<2.8;
export function advanceIntake(state,action){if((state.stage===0&&action==='checkin')||(state.stage===1&&action==='issue')||(state.stage===2&&action==='sell')){state.stage++;return true;}return false;}
export const intakeInstruction=s=>s.stage===0?'ARRIVAL / Walk to Records · E to check in':s.stage===1?'TOOL ISSUE / Follow the amber line · E to collect your pickaxe':s.stage===2?'FIRST SHIFT / Mine a block in Deepwell, then sell your haul at the Exchange':'';
export const intakeFloor=(x,z)=>(x>=-58&&x< -29&&z>=-14&&z< -6)||(x>=-33&&x< -27&&z>=-14&&z<2)||(x>=-33&&x< -19.5&&z>=-3&&z<2);
export const inIntake=p=>intakeFloor(p.x,p.z);
export const campusYard=(x,z)=>(x>=-19.5&&x<19.5&&z>=-5&&z<15.5)||(x>=15.5&&x<19.5&&z>=15&&z<29.5);

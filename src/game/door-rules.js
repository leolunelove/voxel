import {PRISON_DOORS} from './rules.js?v=92';
// Hysteresis keeps a door open while someone passes or pauses in its threshold.
export function tickDoor(state,dt,distance,allowed=true,reduced=false){
 const wasOpen=state.open;
 state.open=allowed&&distance<(wasOpen?PRISON_DOORS.closeDistance:PRISON_DOORS.openDistance);
 const target=state.open?1:0;
 state.amount=reduced?target:state.amount+(target-state.amount)*(1-Math.exp(-Math.max(0,dt)*PRISON_DOORS.speed));
 if(Math.abs(state.amount-target)<.001)state.amount=target;
 return wasOpen!==state.open;
}

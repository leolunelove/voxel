import {ARCHERY_CONTACT as A} from './rules.js?v=88';
import {bowPower} from './bow-rules.js?v=88';
// Charge controls the weight of contact, independently of gear damage and rewards.
export function arrowImpact(charge=1,heavy=false,boss=false){
 const power=bowPower(charge),full=charge>=.999;
 return {power,full,duration:A.duration,strength:A.strength+power*A.fullStrength,
  stagger:boss?0:(A.stagger+power*A.fullStagger)*(heavy?.78:1),
  push:(A.push+power*A.fullPush)*(boss?.10:heavy?.62:1),
  penetration:.04+power*.09,wobble:.025+power*.055};
}
export function impactRecoil(remaining,duration=.30){
 if(remaining<=0)return 0;const age=Math.max(0,duration-remaining);
 return Math.sin(Math.min(1,(age+.012)/.045)*Math.PI/2)*Math.exp(-age*11);
}
// Exact exponential displacement keeps knockback consistent across frame rates.
export const pushDistance=dt=>(1-Math.exp(-10*dt))/10;

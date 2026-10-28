import {bowPower} from './bow-rules.js?v=76.1';
// Charge controls the weight of contact, independently of gear damage and rewards.
export function arrowImpact(charge=1,heavy=false,boss=false){
 const power=bowPower(charge),full=charge>=.999;
 return {power,full,duration:.30,strength:.35+power*.95,
  stagger:boss?0:(.10+power*.24)*(heavy?.78:1),
  push:(2+power*6.5)*(boss?.12:heavy?.62:1),
  penetration:.04+power*.09,wobble:.025+power*.055};
}
export function impactRecoil(remaining,duration=.30){
 if(remaining<=0)return 0;const age=Math.max(0,duration-remaining);
 return Math.sin(Math.min(1,(age+.012)/.045)*Math.PI/2)*Math.exp(-age*11);
}
// Exact exponential displacement keeps knockback consistent across frame rates.
export const pushDistance=dt=>(1-Math.exp(-10*dt))/10;

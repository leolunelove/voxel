import {MELEE} from './rules.js?v=87';
export const swordCadence=(tier=0)=>MELEE.cadence-Math.max(0,Math.min(3,tier))*MELEE.tierSpeed;
export function meleeImpact(tier=0,heavy=false,boss=false){
 const weight=1+Math.max(0,Math.min(3,tier))*.06;
 return {duration:.24,strength:(heavy?.95:1.2)*weight,
  stagger:boss?0:heavy?.17:.24,push:(boss?.55:heavy?3.6:6)*weight};
}
// First a hard recoil, then a weighted collapse; shrink only after the body falls.
export function deathPose(progress,boss=false){
 const p=Math.max(0,Math.min(1,progress)),fall=Math.max(0,Math.min(1,(p-.10)/.66)),ease=fall*fall*(3-2*fall);
 return {collapse:ease,slide:ease*(boss?.24:.62),sink:ease*.55,
  scale:1-Math.max(0,(p-.72)/.28)*.98,kick:Math.sin(Math.min(1,p/.20)*Math.PI)*.09};
}

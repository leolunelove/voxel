// Shared draw/flight rules. Visual tension never awards damage or XP.
export const ARROW_GRAVITY=14;
export const MIN_BOW_POWER=.1;
export const BOW_RECOVERY=.16;
export const bowPower=draw=>{const t=Math.max(0,Math.min(1,Number.isFinite(draw)?draw:0));return (t*t+2*t)/3;};
export const bowMoveSpeed=(drawing,sprint)=>drawing?1.3:sprint?5.8:4.3;

// The old west training wing is reused; no increase to the yard footprint.
export const ENTRY_STEPS=8;
export const ENTRY_STEP_RUN=.75;
export const ENTRY_STEP_RISE=.375;
export function entryFloor(x,z){
 if(x>=-24||x<=-37.5||z<=5.8||z>=10.2)return 1;
 if(x<=-30)return -2;
 return 1-Math.min(ENTRY_STEPS,Math.ceil((-24-x)/ENTRY_STEP_RUN))*ENTRY_STEP_RISE;
}
export const atUnderblockSeal=p=>p.x< -32&&p.x> -36.3&&Math.abs(p.z-8)<1.65&&Math.abs(p.y+.35)<.8;
export const entryDepth=p=>Math.abs(p.z-8)<2.2?Math.max(0,Math.min(1,(-p.x-24)/8)):0;

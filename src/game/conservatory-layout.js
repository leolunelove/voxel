// Physical skill expansion; coordinates are independent of renderer and saves.
export const FOREST_OFFSET={x:20,z:-8};
export const CONSERVATORY_BOUNDS=[21,40,-33,-12];
export const CONSERVATORY_GATE=[8,-5.3];
export const CONSERVATORY_ROUTE=[[8,-3],[8,-10],[28,-10],[28,-13],[28,-16]];
const within=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const inConservatory=p=>within(p.x,p.z,CONSERVATORY_BOUNDS);
export const inServicePassage=p=>within(p.x,p.z,[6,10,-12,-5])||within(p.x,p.z,[6,30,-12,-8]);
export const inServiceFootprint=(x,z)=>within(x,z,[3,40,-33,-5]);
export const conservatoryFloor=(x,z)=>inConservatory({x,z})||inServicePassage({x,z});

export const atConservatoryGate=p=>Math.abs(p.x-8)<2.5&&p.z>-5.1&&p.z< -1.5;

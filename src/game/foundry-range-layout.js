// A new eastern wing: inspection dogleg, rear firing apron, three unequal lanes.
export const RANGE_WING={key:'archery',name:'BOW QUALIFICATION',level:4,blocks:120,area:6,passage:11,gate:[18,29],axis:'x',bounds:[40,74,22,38],passages:[[17.5,34,27,31],[30,34,27,38],[30,42,34,38]]};
const inside=(p,b)=>p.x>=b[0]&&p.x<b[1]&&p.z>=b[2]&&p.z<b[3];
export const rangeInside=p=>inside(p,RANGE_WING.bounds)||RANGE_WING.passages.some(b=>inside(p,b));
export const rangeHall=p=>inside(p,RANGE_WING.bounds);
export const rangeAccess=(state,hunt={})=>state.mined>=120||(hunt.archeryXP??0)>0;
export const rangeFiringPosition=p=>inside(p,[40.4,46.6,22.4,37.6]);
export const RANGE_ROUTE=[[7,26],[7,28],[16,28],[16,29],[32,29],[32,36],[43,36],[44.5,25]];
export const RANGE_TARGETS=[
 {name:'01 / FOUNDATION',x:54,y:2.8,z:25,amplitude:0,speed:0,phase:0},
 {name:'02 / TRACKING',x:62,y:2.8,z:30,amplitude:1.2,speed:.8,phase:0},
 {name:'03 / QUALIFICATION',x:70,y:2.8,z:35,amplitude:1.2,speed:1.15,phase:Math.PI/2}
];
export const targetOffset=(spec,time)=>Math.sin(time*spec.speed+spec.phase)*spec.amplitude;

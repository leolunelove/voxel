// Shared physical coordinates for architecture, collision, AI and targeting.
export const ATTACK_OFFSET={x:6,z:16};
export const ARCHERY_OFFSET={x:12,z:18};
export const TRAINING_WINGS=[
 {key:'attack',name:'CONTAINMENT DETAIL',skill:'ATTACK',level:3,blocks:60,area:5,passage:10,color:'#e9a480',motto:'Earn your place. Leave on your feet.',gate:[0,16],axis:'z',bounds:[-2.5,14.5,32.5,47],passages:[[-2,2,15.5,24],[-2,8,20,24],[4,8,20,33]],route:[[0,13],[0,22],[6,22],[6,35]],offset:ATTACK_OFFSET},
 {key:'archery',name:'BOW RANGE',skill:'ARCHERY',level:4,blocks:120,area:6,passage:11,color:'#efd296',motto:'A quiet breath. A clean release.',gate:[20,8],axis:'x',bounds:[32.5,50.5,21.5,32.5],passages:[[19.5,30,6,10],[26,30,6,28],[26,33,24,28]],route:[[17,8],[28,8],[28,26],[36,26]],offset:ARCHERY_OFFSET}
];
export const withinTraining=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export const trainingWingAt=p=>TRAINING_WINGS.find(w=>withinTraining(p.x,p.z,w.bounds));
export const trainingPassageAt=p=>TRAINING_WINGS.find(w=>w.passages.some(b=>withinTraining(p.x,p.z,b)));
export const trainingFootprint=(x,z)=> (x>-3&&x<15.5&&z>15.5&&z<48)||(x>19.5&&x<51.5&&z>3&&z<33.5);
export const trainingAccess=(state,hunt,wing)=>state.mined>=wing.blocks||(wing.key==='attack'?(hunt?.xp??0)>0:(hunt?.archeryXP??0)>0);
export const trainingGateNear=p=>TRAINING_WINGS.find(w=>Math.abs(p.x-w.gate[0])<(w.axis==='z'?2.5:3)&&Math.abs(p.z-w.gate[1])<(w.axis==='z'?3:2.5));
export const trainingLevel=s=>s.mined>=120?4:s.mined>=60?3:s.mined>=20?2:1;

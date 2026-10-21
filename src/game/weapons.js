export const SWORDS=[
 {name:'Yard sword',level:1,cost:0,multiplier:1,color:0xb9c8c4,trim:0xc8ad70},
 {name:'Tempered blade',level:2,cost:90,multiplier:1.4,color:0xe1e8df,trim:0x74939a},
 {name:'Jade longsword',level:4,cost:340,multiplier:2,color:0x65d5ad,trim:0x315e52},
 {name:'Gilded cleaver',level:7,cost:1100,multiplier:2.85,color:0xf0c66b,trim:0xa35b36}
];
export const BOWS=[
 {name:'Prison bow',level:1,cost:0,draw:.8,speed:42,damage:26,color:0x8f663b,trim:0xc8ad70},
 {name:'Steel recurve',level:2,cost:90,draw:.64,speed:54,damage:38,color:0x829a9c,trim:0xd1dfd7},
 {name:'Jade longbow',level:4,cost:340,draw:.50,speed:68,damage:56,color:0x347f66,trim:0x92e5bb},
 {name:'Gilded warbow',level:7,cost:1100,draw:.38,speed:84,damage:80,color:0x9e6b36,trim:0xf4d07c}
];
export function weaponReason(work,skills,kind){const list=kind==='bow'?BOWS:SWORDS,tier=skills[kind]??0,next=list[tier+1];if(!next)return 'Finest '+kind+' equipped';const xp=kind==='bow'?skills.archeryXP:skills.xp,level=1+Math.floor(Math.sqrt(Math.max(0,xp)/30));if(level<next.level)return 'Requires '+(kind==='bow'?'Archery':'Attack')+' level '+next.level;if(work.money<next.cost)return (next.cost-work.money)+' more credits';return '';}
export function forgeWeapon(work,skills,kind){if(!['sword','bow'].includes(kind)||weaponReason(work,skills,kind))return false;const list=kind==='bow'?BOWS:SWORDS,next=list[(skills[kind]??0)+1];work.money-=next.cost;skills[kind]=(skills[kind]??0)+1;return true;}
export const arrowDamage=(skills,charge)=>Math.round(BOWS[skills.bow??0].damage*(.35+.65*Math.max(0,Math.min(1,charge))));

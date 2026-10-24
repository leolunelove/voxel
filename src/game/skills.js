import {SHIELDS} from './shield-rules.js?v=67';
import {SWORDS,BOWS} from './weapons.js?v=67';
export function skillProgress(xp,cap=20){const level=Math.min(cap,1+Math.floor(Math.sqrt(Math.max(0,xp)/30))),base=30*(level-1)**2,next=30*level**2;return {xp,level,maxed:level===cap,next,remaining:Math.max(0,next-xp),progress:level===cap?1:Math.max(0,Math.min(1,(xp-base)/(next-base)))};}
export function skillLedger(work,hunt){return [
 {name:'Mining',symbol:'⛏',...skillProgress(work.mined*4),description:'4 XP per mined block. Better picks work faster.',detail:work.mined+' blocks mined'},
 {name:'Woodcutting',symbol:'♧',...skillProgress(work.chopped*12),description:'12 XP per felled tree. Break two trunk blocks.',detail:work.chopped+' trees felled'},
 {name:'Attack',symbol:'⚔',...skillProgress(hunt.xp,10),description:'Defeat monsters. Forge sword tiers at Attack levels 2, 4 and 7.',detail:SWORDS[hunt.sword??0].name+' / '+hunt.kills+' monsters defeated'},
 {name:'Archery',symbol:'➶',...skillProgress(hunt.archeryXP),description:'Bullseyes and bow kills earn XP. Forge bows at levels 2, 4 and 7.',detail:BOWS[hunt.bow??0].name+' / Q equips it in combat'},
 {name:'Dungeoneering',symbol:'◆',...skillProgress(hunt.dungeonXP),description:'Clear dungeons. Buckler upgrades at levels 3, 6 and 9.',detail:SHIELDS[hunt.shield??0].name+' / '+hunt.completions+(hunt.completions===1?' dungeon completed':' dungeons completed')}
];}

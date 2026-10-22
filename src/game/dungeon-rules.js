export const inRange=p=>p.x>20.5&&p.x<38.5&&p.z>3.5&&p.z<14.5;
import {atUnderblockSeal} from './underblock-entry-rules.js?v=61';
export const atDungeonGate=atUnderblockSeal;
export const skillLevel=xp=>Math.min(20,1+Math.floor(Math.sqrt(Math.max(0,xp)/30)));
export const shotXP=(charge,radius)=>charge<.18?0:radius<.22?6:radius<.5?4:2;
export const DIFFICULTIES=[{name:"Scavenger",health:1,damage:1,reward:1,bonus:80},{name:"Lockdown",health:1.55,damage:1.3,reward:2,bonus:220},{name:"Blacksite",health:2.2,damage:1.65,reward:3.5,bonus:500}];
export function generateDungeon(seed,difficulty=0){let n=seed>>>0;const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};const count=4+Math.floor(random()*2),rooms=[{x:100,z:100}],occupied=new Set(['0,0']);let gx=0,gz=0;
 for(let i=1;i<count;i++){const choices=[[1,0],[-1,0],[0,1],[0,-1]].filter(([x,z])=>!occupied.has((gx+x)+','+(gz+z)));const [dx,dz]=choices[Math.floor(random()*choices.length)]??[1,0];gx+=dx;gz+=dz;occupied.add(gx+','+gz);rooms.push({x:100+gx*12,z:100+gz*12});}
 const floor=new Set(),add=(x,z)=>floor.add(x+','+z);
 for(const r of rooms)for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++)add(r.x+x,r.z+z);
 for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i],dx=Math.sign(b.x-a.x),dz=Math.sign(b.z-a.z);for(let k=0;k<=12;k++)for(let w=-1;w<=1;w++)add(a.x+dx*k+(dz?w:0),a.z+dz*k+(dx?w:0));}
 const tier=Math.max(0,Math.min(2,Math.trunc(difficulty)||0)),rules=DIFFICULTIES[tier];rooms.forEach((r,i)=>r.style=i===0?"Intake":i===rooms.length-1?"Warden vault":["Cellblock","Overgrown cistern","Ember forge"][(i+seed)%3]);return {seed:seed>>>0,rooms,floor,difficulty:tier,rules,bonus:rules.bonus,xp:Math.round((80+count*20)*rules.reward)};
}
export function finishDungeon(run,skills){if(run.completed||!run.cleared||!run.atExit)return 0;run.completed=true;skills.dungeonXP+=run.xp;skills.completions++;skills.loot=(skills.loot??0)+(run.bonus??0);return run.xp;}

export const SHIELDS=[
 {name:'Scrap buckler',level:1,cost:0,guard:60,reduction:.65,color:0x786449},
 {name:'Iron buckler',level:3,cost:160,guard:80,reduction:.72,color:0x82969c},
 {name:'Jade ward',level:6,cost:500,guard:105,reduction:.80,color:0x56ac8b},
 {name:'Warden seal',level:9,cost:1400,guard:135,reduction:.85,color:0xd6b165}];
export const dungeonLevel=xp=>Math.min(20,1+Math.floor(Math.sqrt(Math.max(0,xp)/30)));
export function shieldReason(work,skills){const next=SHIELDS[(skills.shield??0)+1];if(!next)return 'Finest shield equipped';if(dungeonLevel(skills.dungeonXP)<next.level)return 'Requires Dungeoneering level '+next.level;if(work.money<next.cost)return (next.cost-work.money)+' more credits';return '';}
export function forgeShield(work,skills){if(shieldReason(work,skills))return false;work.money-=SHIELDS[(skills.shield??0)+1].cost;skills.shield=(skills.shield??0)+1;return true;}
export const freshGuard=tier=>({value:SHIELDS[tier??0].guard,held:false,age:0,lock:0,regenDelay:0,flash:0,event:''});
export function tickGuard(g,dt,wants,tier=0){g.flash=Math.max(0,g.flash-dt);g.lock=Math.max(0,g.lock-dt);g.regenDelay=Math.max(0,g.regenDelay-dt);const held=wants&&g.lock===0&&g.value>0;g.age=held?(g.held?g.age+dt:0):0;g.held=held;if(held){g.value=Math.max(0,g.value-dt*3);if(g.value===0){g.held=false;g.lock=1.1;g.event='broken';g.flash=.3;}}else if(g.lock===0&&g.regenDelay===0)g.value=Math.min(SHIELDS[tier].guard,g.value+dt*22);}
export function defend(g,damage,frontal,heavy=false,tier=0){if(!g.held||!frontal)return {damage,blocked:false,perfect:false,broken:false};const perfect=g.age<=.18&&!heavy,cost=perfect?8:heavy?SHIELDS[tier].guard:Math.max(12,damage*1.15),broken=g.value<cost||heavy;g.value=Math.max(0,g.value-cost);g.regenDelay=.8;g.flash=.24;g.event=broken?'broken':perfect?'perfect':'block';if(broken){g.lock=1.2;g.held=false;}return {damage:perfect?0:Math.ceil(damage*(broken?.65:1-SHIELDS[tier].reduction)),blocked:true,perfect,broken};}

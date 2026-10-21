export const BLOCKS=[
{id:'slate',name:'Slate',color:0x718382,toughness:.62,value:2},
{id:'copper',name:'Copper',color:0xc88758,toughness:.88,value:5},
{id:'jade',name:'Jade',color:0x69bca7,toughness:1.1,value:12},
{id:'iron',name:'Iron',color:0xc9c3ae,toughness:1.5,value:20},
{id:'silver',name:'Silver',color:0xb5d8e9,toughness:2,value:38},
{id:'gold',name:'Gold',color:0xf2c45e,toughness:2.6,value:65},
{id:'diamond',name:'Diamond',color:0x77e7f3,toughness:3.5,value:110},
{id:'ember',name:'Emberstone',color:0xff9264,toughness:4.5,value:190},
{id:'timber',name:'Timber',color:0xb38a58,toughness:1.1,value:4}];
export const DROP_COUNTS=[6,4,3,3,2,2,1,1,3];
export function dropCount(type){return DROP_COUNTS[type]??1;}
export const MINES=[
{id:'a',rank:'A',name:'The Deepwell',subtitle:'Reclamation wing',cost:0,pick:0,accent:0xd9a15d,sky:0x1d302a,ore:[[0,.7],[1,.23],[2,.07]],lore:'Where every miner starts. Worn iron, copper dust, and a little hope.'},
{id:'b',rank:'B',name:'Ironworks',subtitle:'Abandoned foundry',cost:450,pick:1,accent:0xb0c4d2,sky:0x28333c,ore:[[1,.20],[2,.20],[3,.45],[4,.15]],lore:'The company left the furnaces cold. The workers kept the steel.'},
{id:'c',rank:'C',name:'Gilded Fault',subtitle:'Sealed treasury seam',cost:1800,pick:2,accent:0xe4bd63,sky:0x343026,ore:[[3,.20],[4,.35],[5,.35],[6,.10]],lore:'A vault without a lock. Your pickaxe is the only key it needs.'},
{id:'d',rank:'D',name:'Ember Hollow',subtitle:'Below the old foundations',cost:6000,pick:3,accent:0xf5946b,sky:0x352924,ore:[[4,.10],[5,.25],[6,.40],[7,.25]],lore:'They stopped drawing maps down here. We kept digging.'}
];
export const PICKS=[
{name:'Worn iron',power:1,cost:0,color:0xaabbb8,rank:0},
{name:'Tempered steel',power:1.65,cost:90,color:0xdce8df,rank:0},
{name:'Jade-forged',power:2.6,cost:340,color:0x71e9bb,rank:0},
{name:'Foundry alloy',power:4.2,cost:950,color:0xadcddd,rank:1},
{name:'Gilded cutter',power:6.8,cost:2600,color:0xf2c45e,rank:2},
{name:'Ember drillpick',power:10.5,cost:7200,color:0xff9264,rank:3}];
export function freshState(){return {version:4,money:0,inventory:BLOCKS.map(()=>0),pick:0,bagLevel:0,mined:0,rank:0,mine:0,mineLevel:0,forestLevel:0,axe:0,chopped:0};}
export function capacity(s){return 96+s.bagLevel*48;}
export function bagCount(s){return s.inventory.reduce((a,b)=>a+b,0);}
export function bagValue(s){return s.inventory.reduce((a,n,i)=>a+n*BLOCKS[i].value,0);}
export function collect(s,type){if(!Number.isInteger(type)||!BLOCKS[type]||bagCount(s)>=capacity(s))return false;s.inventory[type]++;return true;}
export function sell(s){const v=bagValue(s);s.money+=v;s.inventory=BLOCKS.map(()=>0);return v;}
export function upgradePick(s){const n=PICKS[s.pick+1];if(!n||s.money<n.cost||s.rank<n.rank)return false;s.money-=n.cost;s.pick++;return true;}
export function bagCost(s){return 70*(s.bagLevel+1)*Math.max(1,s.bagLevel-1);}
export function upgradeBag(s){const cost=bagCost(s);if(s.bagLevel>=10||s.money<cost)return false;s.money-=cost;s.bagLevel++;return true;}
export function rankReason(s){const next=MINES[s.rank+1];if(!next)return 'All mine permits earned';if(s.pick<next.pick)return 'Requires '+PICKS[next.pick].name;if(s.money<next.cost)return (next.cost-s.money).toLocaleString()+' more credits needed';return '';}
export function unlockRank(s){const n=MINES[s.rank+1];if(!n||rankReason(s))return false;s.money-=n.cost;s.rank++;return true;}
export function travel(s,index){if(!Number.isInteger(index)||index<0||index>s.rank||index>=MINES.length||index===s.mine)return false;s.mine=index;return true;}
export function oreFor(mine,random){let sum=0;for(const [type,weight]of MINES[mine].ore){sum+=weight;if(random<sum)return type;}return MINES[mine].ore.at(-1)[0];}
export function validateSave(raw){
 const s=freshState(),int=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
 if(!raw||![1,2,3,4].includes(raw.version))return s;
 const legacy=raw.version===1;
 if(!int(raw.money,1e12)||!int(raw.pick,legacy?2:PICKS.length-1)||!int(raw.bagLevel,legacy?5:10)||!int(raw.mined,1e12)||!Array.isArray(raw.inventory)||raw.inventory.length!==(legacy?3:raw.version===2?8:BLOCKS.length)||!raw.inventory.every(n=>int(n,576)))return s;
 if(!legacy&&(!int(raw.rank,MINES.length-1)||!int(raw.mine,raw.rank)||PICKS[raw.pick].rank>raw.rank))return s;
 for(const key of ['money','pick','bagLevel','mined'])s[key]=raw[key];
 raw.inventory.forEach((n,i)=>s.inventory[i]=n);if(!legacy){s.rank=raw.rank;s.mine=raw.mine;}
 if(raw.version===4){if(!int(raw.mineLevel,2)||!int(raw.forestLevel,2)||!int(raw.axe,3)||!int(raw.chopped,1e12)||(raw.mined<20&&(raw.forestLevel>0||raw.axe>0)))return freshState();for(const key of ['mineLevel','forestLevel','axe','chopped'])s[key]=raw[key];}else{s.mineLevel=legacy?0:Math.min(2,raw.rank);}
 if(bagCount(s)>capacity(s))return freshState();return s;
}
export class Mining{
 constructor(){this.reset();}
 reset(){this.target=null;this.damage=0;}
 tick(dt,key,type,power,held,contact=true,toughness=BLOCKS[type]?.toughness??1){if(!held||key===null){this.reset();return {progress:0,broken:false};}if(this.target!==key){this.target=key;this.damage=0;}this.damage+=Math.max(0,Math.min(dt,.05))*power;const progress=this.damage/toughness;if(progress>=1&&contact){this.reset();return {progress:1,broken:true};}return {progress:Math.min(.98,progress),broken:false};}
}

import {PICKS,upgradePick} from './rules.js?v=74.2';
export const WORK_OFFSET=-6;
export const LEVEL_TWO=20;
export const campLevel=s=>s.mined>=LEVEL_TWO?2:1;
export const MINE_STAGES=[
 {name:'Starter seam',cost:0,bounds:[-13,-7,-14,-6],bottom:-2,ore:[[0,.72],[1,.25],[2,.03]],detail:'6 × 8 blocks · stone, copper and a little jade'},
 {name:'Expanded excavation',cost:260,bounds:[-16,-5,-18,-6],bottom:-3,ore:[[0,.35],[1,.25],[2,.1],[3,.25],[4,.05]],detail:'11 × 12 blocks · iron and silver seams'},
 {name:'Deepwell works',cost:1350,bounds:[-18,-3,-22,-6],bottom:-4,ore:[[0,.15],[3,.25],[4,.25],[5,.20],[6,.12],[7,.03]],detail:'15 × 16 blocks · deep ore, gold and rare crystals'}
];
export const FOREST_STAGES=[
 {name:'Seedling yard',cost:0,bounds:[5,12,-15,-6],trees:3,logs:9,regrow:24,detail:'3 trees · 9 timber per tree · 24s regrowth'},
 {name:'Timber garden',cost:220,bounds:[4,16,-18,-6],trees:6,logs:12,regrow:21,detail:'6 trees · 12 timber per tree · 21s regrowth'},
 {name:'Prison grove',cost:1100,bounds:[3,18,-22,-6],trees:10,logs:15,regrow:18,detail:'10 trees · 15 timber per tree · 18s regrowth'}
];
export const AXES=[{name:'Iron hatchet',power:1,cost:0},{name:'Steel axe',power:1.8,cost:85},{name:'Jade axe',power:3,cost:320},{name:'Gilded axe',power:4.8,cost:1100}];
export const TREE_LOGS=3;
export const TREE_TOUGHNESS=2.2;
export function expandPlot(s,kind){if(!['mine','forest'].includes(kind))return false;const key=kind+'Level',list=kind==='mine'?MINE_STAGES:FOREST_STAGES,n=list[s[key]+1];if(!n||s.money<n.cost||(kind==='forest'&&campLevel(s)<2))return false;s.money-=n.cost;s[key]++;if(kind==='mine')s.rank=Math.max(s.rank,s.mineLevel===2?3:1);return true;}
export function upgradeAxe(s){const n=AXES[s.axe+1];if(campLevel(s)<2||!n||s.money<n.cost)return false;s.money-=n.cost;s.axe++;return true;}
export function pickRequirement(s){const n=PICKS[s.pick+1];return n?Math.min(n.rank,2)>s.mineLevel?'Expand your mine to stage '+(Math.min(n.rank,2)+1):'':'Finest pickaxe equipped';}
export function forgePick(s){if(pickRequirement(s))return false;return upgradePick(s);}
export function treeLogYield(s){return FOREST_STAGES[s.forestLevel].logs/TREE_LOGS;}
export function treeYield(s){return FOREST_STAGES[s.forestLevel].logs;}
export function mineOre(level,random){let sum=0;for(const [type,weight]of MINE_STAGES[level].ore){sum+=weight;if(random<sum)return type;}return MINE_STAGES[level].ore.at(-1)[0];}
export const CAMP_SPAWN=[.5,2.65,8];
export const inside=(x,z,b)=>x>=b[0]&&x<b[1]&&z>=b[2]&&z<b[3];
export function stairTop(level,x,z){z-=WORK_OFFSET;const s=MINE_STAGES[level],n=(1-s.bottom)*2;if(x>=-11&&x< -9&&z>=-n&&z<0)return s.bottom+(Math.floor(z)+n+1)*.5;return null;}

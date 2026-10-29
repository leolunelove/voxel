import {trainingWingAt} from './training-layout.js?v=82.3';
import {SHIELDS,dungeonLevel} from './shield-rules.js?v=82.3';
import {SWORDS} from './weapons.js?v=82.3';
export const MAX_HP=100;
export const attackLevel=xp=>Math.min(10,1+Math.floor(Math.sqrt(Math.max(0,xp)/30)));
export const swordDamage=(xp,tier=0)=>Math.round((16+attackLevel(xp)*4)*SWORDS[tier].multiplier);
export const MONSTERS=[{name:'Yard crawler',hp:52,damage:14,xp:12,value:18,speed:1.6,color:0x677d4a},{name:'Ironback',hp:80,damage:23,xp:24,value:34,speed:1.1,color:0x7d6251},{name:"The Underwarden",hp:220,damage:30,xp:65,value:100,speed:1.35,color:0x575469,boss:true,windup:1.15,reach:3.1}];
export const freshHunt=()=>({hp:MAX_HP,xp:0,loot:0,kills:0,archeryXP:0,dungeonXP:0,completions:0,sword:0,bow:0,shield:0});
export function loadHunt(raw){const s=freshHunt();if(!raw)return s;for(const k of ['xp','kills','archeryXP','dungeonXP','completions'])if(Number.isSafeInteger(raw[k])&&raw[k]>=0&&raw[k]<=1e9)s[k]=raw[k];for(const kind of ['sword','bow']){const tier=raw[kind];if(Number.isInteger(tier)&&tier>=0&&tier<4&&[1,2,4,7][tier]<=attackLevel(kind==='bow'?s.archeryXP:s.xp))s[kind]=tier;}if(Number.isInteger(raw.shield)&&raw.shield>=0&&raw.shield<SHIELDS.length&&dungeonLevel(s.dungeonXP)>=SHIELDS[raw.shield].level)s.shield=raw.shield;return s;}
export function hurt(s,amount){s.hp=Math.max(0,s.hp-Math.max(0,amount));if(s.hp===0){const lost=s.loot;s.loot=0;return {defeated:true,lost};}return {defeated:false,lost:0};}
export function reward(s,type,skill='attack',stats=null){const m=stats??MONSTERS[type];if(!m||s.hp<=0)return false;if(skill==='archery')s.archeryXP+=m.xp;else s.xp+=m.xp;s.loot+=m.value;s.kills++;return true;}
export function bank(s){const value=s.loot;s.loot=0;return value;}
export function retreat(s){const lost=s.loot;s.loot=0;return lost;}
export const inHunt=p=>trainingWingAt(p)?.key==='attack';

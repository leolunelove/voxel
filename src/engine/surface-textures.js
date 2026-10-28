import * as T from '../../vendor/three.module.js';
import {BLOCKS} from '../game/rules.js?v=75.3';
const rgb=(v)=>'#'+v.toString(16).padStart(6,'0');
export function surfaceTexture(kind,type=0){
 const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');let seed=719+type*53;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 if(kind==='ore'){
  x.fillStyle='#777975';x.fillRect(0,0,64,64);for(let n=0;n<160;n++){const g=99+Math.floor(rand()*27);x.fillStyle=`rgb(${g},${g+2},${g})`;x.fillRect(Math.floor(rand()*32)*2,Math.floor(rand()*32)*2,2+Math.floor(rand()*3)*2,2+Math.floor(rand()*2)*2);}
  x.fillStyle='#555954';for(const [a,b,w]of [[4,19,17],[31,43,18],[19,59,12]]){x.fillRect(a,b,w,1);x.fillRect(a+w-1,b,1,3);}
  if(type>0){const base=new T.Color(BLOCKS[type].color),dark=base.clone().multiplyScalar(.46),light=base.clone().lerp(new T.Color(0xfff1cd),.48);for(let n=0;n<7;n++){const a=4+Math.floor(rand()*25)*2,b=4+Math.floor(rand()*25)*2,w=4+Math.floor(rand()*3)*2;x.fillStyle=rgb(dark.getHex());x.fillRect(a-1,b,w+2,7);x.fillStyle=rgb(base.getHex());x.fillRect(a,b,w,5);x.fillRect(a+2,b-2,w-2,3);x.fillStyle=rgb(light.getHex());x.fillRect(a+1,b,2,2);}}
  x.fillStyle='#5e625d';x.fillRect(0,63,64,1);x.fillRect(63,0,1,64);x.fillStyle='#92958d';x.fillRect(0,0,64,1);
 }else if(kind==='bark'){
  x.fillStyle='#735039';x.fillRect(0,0,64,64);for(let a=0;a<64;a+=4){x.fillStyle=a%3?'#866044':'#503c2e';x.fillRect(a,0,2,64);for(let n=0;n<4;n++){x.fillStyle=n%2?'#9b7653':'#60432f';x.fillRect(a,Math.floor(rand()*60),3,4+Math.floor(rand()*10));}}x.fillStyle='#4c3629';x.fillRect(27,24,9,14);x.fillStyle='#ab835a';x.fillRect(29,27,5,8);x.fillStyle='#63452e';x.fillRect(31,29,2,5);
 }else if(kind==='endgrain'){
  x.fillStyle='#65452e';x.fillRect(0,0,64,64);for(let n=0;n<8;n++){const inset=3+n*3;x.fillStyle=n%2?'#b88d5c':'#9d744b';x.fillRect(inset,inset,64-inset*2,64-inset*2);}x.fillStyle='#765335';x.fillRect(31,8,2,24);
 }else if(kind==='leaf'){
  x.fillStyle='#b4c59f';x.fillRect(0,0,64,64);for(let n=0;n<135;n++){x.fillStyle=['#99af86','#c5d2b1','#819a70'][n%3];const a=Math.floor(rand()*16)*4,b=Math.floor(rand()*16)*4;x.fillRect(a,b,4+Math.floor(rand()*2)*4,4);}
 }else{
  x.fillStyle='#aaa39a';x.fillRect(0,0,64,64);for(let n=0;n<260;n++){const g=155+Math.floor(rand()*20);x.fillStyle=`rgb(${g+6},${g+2},${g})`;x.fillRect(Math.floor(rand()*64),Math.floor(rand()*64),1+Math.floor(rand()*3),1);}x.fillStyle='#77746f';x.fillRect(0,63,64,1);x.fillRect(63,0,1,64);x.fillStyle='#bbb5ac';x.fillRect(0,0,63,1);x.fillStyle='#89857d';x.fillRect(8,41,10,1);x.fillRect(17,42,1,4);x.fillRect(18,45,5,1);
 }
 const texture=new T.CanvasTexture(c);texture.magFilter=T.NearestFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;return texture;
}

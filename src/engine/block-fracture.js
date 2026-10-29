import {fractureGraph,revealFracture,fractureSeed} from './fracture-pattern.js?v=78.3';
import * as T from '../../vendor/three.module.js';
// BoxGeometry material order. Coordinates are block-local, never camera-local.
export function faceUV(point,normal){
 const a=[Math.abs(normal.x),Math.abs(normal.y),Math.abs(normal.z)],axis=a.indexOf(Math.max(...a));
 if(axis===0)return {face:normal.x>0?0:1,u:.5+(normal.x>0?-point.z:point.z),v:.5+point.y};
 if(axis===1)return {face:normal.y>0?2:3,u:.5+point.x,v:.5+(normal.y>0?-point.z:point.z)};
 return {face:normal.z>0?4:5,u:.5+(normal.z>0?point.x:-point.x),v:.5+point.y};
}
export function fractureLines(key,face,stage,anchor={u:.5,v:.5},options={}){return revealFracture(fractureGraph({seed:key,face,anchor,...options}),stage/9);}
// Axe notches cut across the grain instead of making a stone impact star.
export function woodCutLines(key,stage,anchor={u:.5,v:.5}){
 if(stage<=0)return [];
 const x=anchor.u*128,y=(1-anchor.v)*128,reach=8+stage*4,depth=1+stage*.65,clamp=n=>Math.max(1,Math.min(127,Math.round(n/2)*2));
 const line=points=>points.map(([a,b])=>[clamp(a),clamp(b)]),lines=[line([[x-reach,y-depth],[x-4,y+depth*.4],[x+reach,y-depth*.5]]),line([[x-reach*.8,y+depth],[x+2,y+depth*1.5],[x+reach*.7,y+depth]])];
 if(stage>3)for(const sign of [-1,1])lines.push(line([[x+sign*reach*.7,y],[x+sign*reach*.75,y+depth*3],[x+sign*reach*.6,y+depth*4]]));
 return lines;
}
export class BlockFracture{
 constructor(scene){
  this.faces=Array.from({length:6},()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.NearestFilter;texture.generateMipmaps=false;return {ctx:canvas.getContext('2d'),texture,material:new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2})};});
  this.mesh=new T.Mesh(new T.BoxGeometry(1.012,1.012,1.012),this.faces.map(f=>f.material));this.mesh.matrixAutoUpdate=false;this.mesh.visible=false;this.mesh.renderOrder=2;scene.add(this.mesh);this.block=null;this.stage=0;
 }
 hit(block,point,normal,progress,context={}){
  block.updateWorldMatrix(true,false);
  if(this.block!==block){this.block=block;this.stage=0;this.key=block.userData.key??block.uuid;const local=block.worldToLocal(point.clone()),n=normal.clone().applyMatrix3(new T.Matrix3().getNormalMatrix(block.matrixWorld.clone().invert())).normalize();this.anchor=faceUV(local,n);this.impacts=[];this.seed=block.userData.fractureSeed??=fractureSeed(this.key+":"+Math.random());}
  const stage=Math.max(1,Math.min(9,Math.ceil(progress*9)));
  const local=block.worldToLocal(point.clone()),n=normal.clone().applyMatrix3(new T.Matrix3().getNormalMatrix(block.matrixWorld.clone().invert())).normalize(),contact=faceUV(local,n),previous=this.impacts.find(i=>i.face===contact.face&&Math.hypot(i.u-contact.u,i.v-contact.v)<.16);
  if(!previous&&this.impacts.length<4)this.impacts.push({...contact,born:this.impacts.length?Math.max(0,(stage-1)/9):0,energy:1+(context.tier??0)*.13,seed:this.seed+this.impacts.length*7919});
  this.stage=Math.max(this.stage,stage);
  this.faces.forEach((f,index)=>{
   const primary=index===this.anchor.face,origin=primary?this.anchor:{u:.5,v:.5},contacts=this.impacts.filter(i=>i.face===index),fallback={...origin,born:.22,energy:1,seed:this.seed},lines=block.userData.type===8?woodCutLines(this.seed,primary?stage:Math.max(0,stage-2),origin):(contacts.length?contacts:[fallback]).flatMap(i=>revealFracture(fractureGraph({seed:i.seed,type:block.userData.type??0,face:index,anchor:i,energy:i.energy,exposure:context.exposure??0}),Math.max(0,(this.stage/9-i.born)/(1-i.born)))),ctx=f.ctx;ctx.clearRect(0,0,128,128);ctx.lineJoin='miter';ctx.lineCap='square';
   for(const [color,width,offset] of [['rgba(8,13,15,.90)',4,0],['rgba(220,211,182,.36)',1.5,1],['rgba(13,18,20,.98)',3,0]]){
    ctx.strokeStyle=color;ctx.lineWidth=width;
    for(const line of lines){ctx.beginPath();line.forEach(([x,y],i)=>i?ctx.lineTo(x+offset,y+offset):ctx.moveTo(x+offset,y+offset));ctx.stroke();}
   }
   if(primary){const size=2+Math.floor(stage/3)*2;ctx.fillStyle='rgba(14,19,20,.95)';ctx.fillRect(Math.round(origin.u*128)-size/2,Math.round((1-origin.v)*128)-size/2,size,size);}
   f.texture.needsUpdate=true;
  });
 }
 target(block){
  if(block!==this.block){this.block=null;this.stage=0;this.mesh.visible=false;return;}
  this.mesh.visible=!!block&&this.stage>0;if(block){block.updateWorldMatrix(true,false);this.mesh.matrix.copy(block.matrixWorld);this.mesh.matrixWorldNeedsUpdate=true;}
 }
}

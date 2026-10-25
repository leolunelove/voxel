import * as T from '../../vendor/three.module.js';
// BoxGeometry material order. Coordinates are block-local, never camera-local.
export function faceUV(point,normal){
 const a=[Math.abs(normal.x),Math.abs(normal.y),Math.abs(normal.z)],axis=a.indexOf(Math.max(...a));
 if(axis===0)return {face:normal.x>0?0:1,u:.5+(normal.x>0?-point.z:point.z),v:.5+point.y};
 if(axis===1)return {face:normal.y>0?2:3,u:.5+point.x,v:.5+(normal.y>0?-point.z:point.z)};
 return {face:normal.z>0?4:5,u:.5+(normal.z>0?point.x:-point.x),v:.5+point.y};
}
function hash(key){let n=2166136261;for(const c of String(key))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
export function fractureLines(key,face,stage,anchor={u:.5,v:.5}){
 let seed=hash(key+':'+face);const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const snap=n=>Math.max(1,Math.min(127,Math.round(n/2)*2)),x=snap(anchor.u*128),y=snap((1-anchor.v)*128),lines=[];
 for(let i=0;i<9;i++){
  const angle=i*2.399+(rand()-.5)*.9,reach=36+rand()*48,bend=(rand()-.5)*18;
  const extent=Math.max(0,Math.min(1,(stage-(i%3)*1.2)/7));
  const points=[[x,y],[snap(x+Math.cos(angle)*reach*extent*.40+bend*extent),snap(y+Math.sin(angle)*reach*extent*.40)],[snap(x+Math.cos(angle)*reach*extent),snap(y+Math.sin(angle)*reach*extent)]];
  if(extent>0)lines.push(points);
  const fork=rand()>.45;if(fork&&stage>4)lines.push([points[1],[snap(points[1][0]+Math.cos(angle+.75)*reach*extent*.32),snap(points[1][1]+Math.sin(angle+.75)*reach*extent*.32)]]);
 }
 return lines;
}
export class BlockFracture{
 constructor(scene){
  this.faces=Array.from({length:6},()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const texture=new T.CanvasTexture(canvas);texture.magFilter=T.NearestFilter;texture.minFilter=T.NearestFilter;texture.generateMipmaps=false;return {ctx:canvas.getContext('2d'),texture,material:new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2})};});
  this.mesh=new T.Mesh(new T.BoxGeometry(1.012,1.012,1.012),this.faces.map(f=>f.material));this.mesh.matrixAutoUpdate=false;this.mesh.visible=false;this.mesh.renderOrder=2;scene.add(this.mesh);this.block=null;this.stage=0;
 }
 hit(block,point,normal,progress){
  block.updateWorldMatrix(true,false);
  if(this.block!==block){this.block=block;this.stage=0;this.key=block.userData.key??block.uuid;const local=block.worldToLocal(point.clone()),n=normal.clone().applyMatrix3(new T.Matrix3().getNormalMatrix(block.matrixWorld.clone().invert())).normalize();this.anchor=faceUV(local,n);}
  const stage=Math.max(1,Math.min(9,Math.ceil(progress*9)));
  if(stage<=this.stage)return;this.stage=stage;
  this.faces.forEach((f,index)=>{
   const primary=index===this.anchor.face,origin=primary?this.anchor:{u:.5,v:.5},lines=fractureLines(this.key,index,primary?stage:Math.max(0,stage-2),origin),ctx=f.ctx;ctx.clearRect(0,0,128,128);ctx.lineJoin='miter';ctx.lineCap='square';
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

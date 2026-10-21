import * as T from '../../vendor/three.module.js';
import {BLOCKS,oreFor} from './rules.js?v=57';
import {LAYOUTS,columnsFor,columnTop} from './layouts.js?v=57';
import {buildEnvironment,disposeEnvironment} from './environment.js?v=57';
export const keyOf=(x,y,z)=>x+','+y+','+z;
export class World{
 constructor(scene){this.scene=scene;this.mine=0;this.layout=LAYOUTS[0];this.blockers=[];this.blocks=new Map();this.meshes=[];this.geometry=new T.BoxGeometry(1,1,1);this.materials=BLOCKS.map((b,i)=>new T.MeshStandardMaterial({map:this.texture(i),roughness:.93,emissive:i===7?0x6f3521:0,emissiveIntensity:.12}));this.environmentsEnabled=true;this.generate();}
 texture(type){const c=document.createElement('canvas');c.width=c.height=32;const ctx=c.getContext('2d');ctx.fillStyle='#'+BLOCKS[0].color.toString(16);ctx.fillRect(0,0,32,32);
 let seed=211+type;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<130;i++){const v=Math.floor(85+rand()*65);ctx.fillStyle=`rgb(${v},${v+10},${v+9})`;ctx.fillRect(Math.floor(rand()*16)*2,Math.floor(rand()*16)*2,2+rand()*4,2);}
 if(type)for(let i=0;i<18;i++){ctx.fillStyle='#'+BLOCKS[type].color.toString(16);ctx.fillRect(Math.floor(rand()*14)*2,Math.floor(rand()*14)*2,3,3);}
 if(type===8){ctx.fillStyle='#89603e';ctx.fillRect(0,0,32,32);for(let x=1;x<32;x+=4){ctx.fillStyle=x%3?'#a47a4c':'#67482f';ctx.fillRect(x,0,2,32);ctx.fillRect(x+1,8+(x%4)*3,2,8);}ctx.fillStyle='#5b412e';ctx.fillRect(12,13,5,7);ctx.fillStyle='#be925a';ctx.fillRect(13,15,2,3);}
 ctx.strokeStyle='#334642';ctx.strokeRect(.5,.5,31,31);const texture=new T.CanvasTexture(c);texture.magFilter=T.NearestFilter;texture.colorSpace=T.SRGBColorSpace;return texture;}
 generate(index=this.mine){
 this.mine=index;this.layout=LAYOUTS[index];this.scene.background=new T.Color(this.layout.sky);if(this.scene.fog){this.scene.fog.color.setHex(this.layout.sky);this.scene.fog.density=this.layout.fog;}
 for(const mesh of this.meshes)this.scene.remove(mesh);this.meshes=[];this.blocks.clear();
 for(const {x,z,top}of columnsFor(index))for(let y=this.layout.bottom;y<=top;y++){
 const h=Math.abs(Math.sin(x*127.1+y*311.7+z*74.7+index*.37)*43758.5453)%1,type=oreFor(index,h),mesh=new T.Mesh(this.geometry,this.materials[type]);
 mesh.position.set(x+.5,y+.5,z+.5);mesh.userData={key:keyOf(x,y,z),type,x,y,z};this.blocks.set(mesh.userData.key,mesh);this.meshes.push(mesh);this.scene.add(mesh);
 }
 for(const mesh of this.meshes){const {x,y,z}=mesh.userData;mesh.visible=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].some(([dx,dy,dz])=>!World.prototype.solid.call(this,x+dx+.5,y+dy+.5,z+dz+.5));}
 if(this.environmentsEnabled){disposeEnvironment(this.environment);buildEnvironment(this);}
 }
 remove(mesh){const {x,y,z}=mesh.userData;this.blocks.delete(mesh.userData.key);this.scene.remove(mesh);const i=this.meshes.indexOf(mesh);if(i>=0)this.meshes.splice(i,1);for(const [dx,dy,dz]of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const neighbor=this.blocks.get(keyOf(x+dx,y+dy,z+dz));if(neighbor)neighbor.visible=true;}}
 solid(x,y,z){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),index=this.mine??0,L=this.layout??LAYOUTS[index],[xmin,xmax,zmin,zmax]=L.bounds;if(ix<xmin||ix>xmax||iz<zmin||iz>zmax)return true;const top=columnTop(index,ix,iz);if(top===null)return iy<1;if(iy<L.bottom)return true;return this.blocks.has(keyOf(ix,iy,iz));}
 obstructed(ray,distance){const point=new T.Vector3();return (this.blockers??[]).some(box=>ray.intersectBox(box,point)&&point.distanceTo(ray.origin)<distance-.02);}
 update(dt,reduced=false){if(!this.dust)return;this.environmentTime+=reduced?0:dt;const matrix=new T.Matrix4();this.ambientMotes.forEach((p,i)=>{const y=this.mine===3?1+(p.y+this.environmentTime*.14)%7:p.y+Math.sin(this.environmentTime*.3+i)*.12;matrix.makeTranslation(p.x+Math.sin(this.environmentTime*.15+i)*.12,y,p.z);this.dust.setMatrixAt(i,matrix);});this.dust.instanceMatrix.needsUpdate=true;}
}

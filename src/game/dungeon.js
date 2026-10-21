import * as T from '../../vendor/three.module.js';
import {generateDungeon} from './dungeon-rules.js?v=59';
import {MONSTERS} from './hunt-rules.js?v=59';
import {Hunt} from './hunt.js?v=59';
export class Dungeon{
 constructor(scene,state,seed,difficulty=0){Object.assign(this,generateDungeon(seed,difficulty));this.scene=scene;this.root=new T.Group();scene.add(this.root);this.completed=false;this.cleared=false;this.atExit=false;
  const geometry=new T.BoxGeometry(1,1,1),walls=new Set();for(const key of this.floor){const [x,z]=key.split(',').map(Number);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]])if(!this.floor.has((x+dx)+','+(z+dz)))walls.add((x+dx)+','+(z+dz));}
  const mesh=(cells,h,y,color)=>{const m=new T.InstancedMesh(geometry,new T.MeshStandardMaterial({color,roughness:.95}),cells.size),matrix=new T.Matrix4();let i=0;for(const key of cells){const [x,z]=key.split(',').map(Number);matrix.compose(new T.Vector3(x+.5,y,z+.5),new T.Quaternion(),new T.Vector3(1,h,1));m.setMatrixAt(i++,matrix);}this.root.add(m);};mesh(this.floor,1,.5,0x53645b);mesh(walls,4,3,0x34483f);
  const palettes={Intake:[0x60756b,0x8bc9ad],Cellblock:[0x505d68,0x9bbde0],"Overgrown cistern":[0x3d6452,0x7ee7a2],"Ember forge":[0x665047,0xffa14e],"Warden vault":[0x51465f,0xcf9bff]};
  const prop=(w,h,d,x,y,z,color,glow=false)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),glow?new T.MeshBasicMaterial({color}):new T.MeshStandardMaterial({color,roughness:.9}));o.position.set(x,y,z);this.root.add(o);return o;};
  for(const [i,r]of this.rooms.entries()){const [stone,light]=palettes[r.style],lamp=new T.PointLight(light,26,15);lamp.position.set(r.x+.5,4,r.z+.5);this.root.add(lamp);
   prop(7.8,.035,7.8,r.x+.5,1.02,r.z+.5,stone);prop(1.3,.04,1.3,r.x+.5,1.05,r.z+.5,light,true);
   for(const dx of [-3.8,3.8])for(const dz of [-3.8,3.8]){prop(.65,3.4,.65,r.x+.5+dx,2.7,r.z+.5+dz,stone);prop(.3,.4,.3,r.x+.5+dx,3.6,r.z+.5+dz,light,true);}
   for(const side of [-1,1])for(let k=-2;k<=2;k++){if(r.style==="Cellblock")prop(.12,2.6,.12,r.x+.5+side*4,2.3,r.z+.5+k*.6,0x83909b);if(r.style==="Overgrown cistern")prop(.12,1.1+(k+2)*.22,.5,r.x+.5+side*4,3.4,r.z+.5+k,0x547d45);if(r.style==="Ember forge")prop(.5,.035,.5,r.x+.5+side*3,1.05,r.z+.5+k,light,true);}
   if(i===this.rooms.length-1){for(const dx of [-2,2])prop(.35,.045,6,r.x+.5+dx,1.06,r.z+.5,light,true);}
  }
  const last=this.rooms.at(-1);this.exit=new T.Mesh(new T.BoxGeometry(1.6,2.6,.25),new T.MeshBasicMaterial({color:0x6c7462}));this.exit.position.set(last.x+.5,2.3,last.z+3);this.root.add(this.exit);
  const spawns=this.rooms.flatMap((r,i)=>i===0?[]:[[i,r.x+.5,r.z+.5,i===this.rooms.length-1?2:i%2]]);
  this.combat=new Hunt(scene,state,{spawns,statsFor:type=>{const m=MONSTERS[type];return {...m,hp:Math.round(m.hp*this.rules.health),damage:Math.round(m.damage*this.rules.damage),xp:Math.round(m.xp*this.rules.reward),value:Math.round(m.value*this.rules.reward)};},active:()=>true,respawn:false,bounds:[Math.min(...this.rooms.map(r=>r.x))-3,Math.max(...this.rooms.map(r=>r.x))+3,Math.min(...this.rooms.map(r=>r.z))-3,Math.max(...this.rooms.map(r=>r.z))+3],boundsFor:e=>[e.x-3.5,e.x+3.5,e.z-3.5,e.z+3.5],canAct:(e,p)=>this.roomAt(p)===this.roomAt(e.root.position)});
 }
 roomAt(p){return this.rooms.findIndex(r=>Math.abs(p.x-r.x-.5)<4.5&&Math.abs(p.z-r.z-.5)<4.5);}
 solid(x,y,z){return y<1||(!this.floor.has(Math.floor(x)+','+Math.floor(z))&&y<7);}
 blocked(ray,distance){for(let d=.1;d<distance;d+=.16){const p=ray.at(d,new T.Vector3());if(this.solid(p.x,p.y,p.z))return true;}return false;}
 update(position){this.cleared=this.combat.enemies.every(e=>e.dead);this.atExit=position.distanceTo(new T.Vector3(this.exit.position.x,2.65,this.exit.position.z))<1.9;this.exit.material.color.setHex(this.cleared?0xc8b36c:0x6c7462);}
 dispose(){this.combat.dispose();this.root.removeFromParent();const geometries=new Set(),materials=new Set();this.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);if(o.isInstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
}

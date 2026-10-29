import * as T from '../../vendor/three.module.js';
import {dressDungeon,ROOM_MOODS} from './dungeon-character.js?v=78.3';
import {generateDungeon} from './dungeon-rules.js?v=78.3';
import {MONSTERS} from './hunt-rules.js?v=78.3';
import {Hunt} from './hunt.js?v=78.3';
export class Dungeon{
 constructor(scene,state,seed,difficulty=0){Object.assign(this,generateDungeon(seed,difficulty));this.scene=scene;this.root=new T.Group();scene.add(this.root);this.completed=false;this.cleared=false;this.atExit=false;
  const geometry=new T.BoxGeometry(1,1,1),walls=new Set();for(const key of this.floor){const [x,z]=key.split(',').map(Number);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]])if(!this.floor.has((x+dx)+','+(z+dz)))walls.add((x+dx)+','+(z+dz));}
  const mesh=(cells,h,y,color)=>{const m=new T.InstancedMesh(geometry,new T.MeshStandardMaterial({color,roughness:.95}),cells.size),matrix=new T.Matrix4();let i=0;for(const key of cells){const [x,z]=key.split(',').map(Number);matrix.compose(new T.Vector3(x+.5,y,z+.5),new T.Quaternion(),new T.Vector3(1,h,1));m.setMatrixAt(i++,matrix);}this.root.add(m);};mesh(this.floor,1,.5,0x53645b);mesh(walls,5,3.5,0x34483f);mesh(this.floor,.25,6.1,0x26362f);
  dressDungeon(this);this.fogColor=new T.Color(0x263b32);
  const last=this.rooms.at(-1);this.exit=new T.Mesh(new T.BoxGeometry(1.6,2.6,.25),new T.MeshBasicMaterial({color:0x6c7462}));this.exit.position.set(last.x+.5,2.3,last.z+3);this.root.add(this.exit);
  const spawns=this.rooms.flatMap((r,i)=>i===0?[]:[[i,r.x+.5,r.z+.5,i===this.rooms.length-1?2:i%2]]);
  this.combat=new Hunt(scene,state,{spawns,statsFor:type=>{const m=MONSTERS[type];return {...m,hp:Math.round(m.hp*this.rules.health),damage:Math.round(m.damage*this.rules.damage),xp:Math.round(m.xp*this.rules.reward),value:Math.round(m.value*this.rules.reward)};},active:()=>true,respawn:false,bounds:[Math.min(...this.rooms.map(r=>r.x))-3,Math.max(...this.rooms.map(r=>r.x))+3,Math.min(...this.rooms.map(r=>r.z))-3,Math.max(...this.rooms.map(r=>r.z))+3],boundsFor:e=>[e.x-3.5,e.x+3.5,e.z-3.5,e.z+3.5],canAct:(e,p)=>this.roomAt(p)===this.roomAt(e.root.position)});
 }
 roomAt(p){return this.rooms.findIndex(r=>Math.abs(p.x-r.x-.5)<4.5&&Math.abs(p.z-r.z-.5)<4.5);}
 solid(x,y,z){return y<1||(!this.floor.has(Math.floor(x)+','+Math.floor(z))&&y<7);}
 blocked(ray,distance){for(let d=.1;d<distance;d+=.16){const p=ray.at(d,new T.Vector3());if(this.solid(p.x,p.y,p.z))return true;}return false;}
 atmosphere(world,scene,position,dt){const index=this.roomAt(position),m=ROOM_MOODS[this.rooms[index]?.style]??ROOM_MOODS.Intake;this.fogColor.lerp(m.fogColor,1-Math.exp(-dt*3));scene.background.copy(this.fogColor);scene.fog.color.copy(this.fogColor);scene.fog.density=.026;world.skyLight.intensity=m.ambient;world.sun.intensity=.16;}
 update(position){this.cleared=this.combat.enemies.every(e=>e.dead);this.atExit=position.distanceTo(new T.Vector3(this.exit.position.x,2.65,this.exit.position.z))<1.9;this.exit.material.color.setHex(this.cleared?0xc8b36c:0x6c7462);}
 dispose(){this.combat.dispose();this.root.removeFromParent();const geometries=new Set(),materials=new Set();this.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);if(o.isInstancedMesh)o.dispose();});geometries.forEach(g=>g.dispose());const textures=new Set();materials.forEach(m=>{if(m.map)textures.add(m.map);m.dispose();});textures.forEach(t=>t.dispose());}
}

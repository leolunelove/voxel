import * as T from '../../vendor/three.module.js';
import {tickDoor} from '../game/door-rules.js?v=92';
// Hinged leaves remain dynamic through every scenery batching pass.
export function buildPrisonDoor(world,art,{id,x,z,width,height,bottom=1,axis='x',double=false,stage=0}){
 world.doorRoot??=new T.Group();if(!world.doorRoot.parent)world.scene.add(world.doorRoot);
 world.doors??=[];world.doorSounds??=[];
 const root=new T.Group();root.name=id;root.position.set(x,bottom,z);root.rotation.y=axis==='z'?Math.PI/2:0;world.doorRoot.add(root);
 const leaves=[],bounds=[],leafWidth=width/(double?2:1);
 for(const side of double?[-1,1]:[-1]){
  const hinge=new T.Group();hinge.position.x=side*width/2;root.add(hinge);
  const cx=-side*leafWidth/2,B=(a,y,c,w,h,d,color,kind='metal')=>art.box(a,y,c,w,h,d,color,kind,false,hinge);
  const panel=B(cx,height/2,0,leafWidth-.035,height,.11,0x825b44);
  B(cx,height*.66,.066,leafWidth*.55,height*.22,.025,0x263c3a,'');
  for(const offset of [-.18,0,.18])B(cx+offset*leafWidth,height*.66,.09,.035,height*.23,.035,0x435751);
  B(cx,height*.14,.065,leafWidth*.84,height*.15,.025,0x526159);
  B(cx-side*leafWidth*.32,height*.42,.1,.06,.16,.07,0xd1b276);
  for(const y of [.15,height-.15])B(0,y,0,.10,.18,.16,0x435751);
  leaves.push({hinge,panel,side});bounds.push(new T.Box3());
 }
 const light=art.box(width/2+.16,height-.17,0,.09,.08,.14,0xd3a665,'',false,root);light.material=new T.MeshBasicMaterial({color:0xd3a665,toneMapped:false});
 const door={id,x,z,bottom,height,stage,root,leaves,bounds,light,open:false,amount:0};world.doors.push(door);updateDoor(door,0,null,world.intakeStage??0,true);return door;
}
function updateDoor(d,dt,p,stage,reduced){
 const sameFloor=p&&p.y>d.bottom+.4&&p.y<d.bottom+d.height+1;
 const distance=sameFloor?Math.hypot(p.x-d.x,p.z-d.z):Infinity;
 const changed=tickDoor(d,dt,distance,stage>=d.stage,reduced);
 for(const leaf of d.leaves)leaf.hinge.rotation.y=-leaf.side*d.amount*Math.PI*.53;
 d.light.material.color.setHex(stage<d.stage?0xba6950:d.open?0xb9d09a:0xd3a665);
 d.root.updateMatrixWorld(true);d.leaves.forEach((leaf,i)=>d.bounds[i].setFromObject(leaf.panel));
 return changed&&distance<6;
}
export function updatePrisonDoors(world,dt,p,reduced=false){
 for(const d of world.doors??[])if(updateDoor(d,dt,p,world.intakeStage??0,reduced))world.doorSounds.push(d.open?'door-open':'door-close');
}

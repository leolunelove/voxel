import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {Dungeon} from '../src/game/dungeon.js';
import {freshHunt} from '../src/game/hunt-rules.js';
import {Player} from '../src/game/player.js';
import {ROOM_MOODS} from '../src/game/dungeon-character.js';
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){},measureText:s=>({width:s.length*10})})})};

test('dungeon architecture leaves fighting squares, doorways and bow sightlines clear across generated layouts',()=>{
 for(const seed of [812,9871,7919,209,4096]){
  const d=new Dungeon(new T.Scene(),freshHunt(),seed),p=new Player(new T.PerspectiveCamera(),{keys:new Set(),yaw:0,pitch:0},{solid:(...a)=>d.solid(...a),blockers:[]});
  const mesh=d.architecture.getObjectByName('Instanced dungeon architecture'),matrix=new T.Matrix4(),base=new T.Box3(new T.Vector3(-.5,-.5,-.5),new T.Vector3(.5,.5,.5));
  for(const r of d.rooms){
   const cx=r.x+.5,cz=r.z+.5,arena=new T.Box3(new T.Vector3(cx-3.5,1.15,cz-3.5),new T.Vector3(cx+3.5,4.5,cz+3.5));
   for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);assert.equal(base.clone().applyMatrix4(matrix).intersectsBox(arena),false,r.style+' decoration entered combat space');}
   for(const x of [-3,0,3])for(const z of [-3,0,3]){
    assert.ok(p.fits(new T.Vector3(cx+x,2.65,cz+z)));
    const target=new T.Vector3(cx+x,2.5,cz+z),origin=new T.Vector3(cx,2.5,cz),distance=origin.distanceTo(target);
    if(distance)assert.equal(d.blocked(new T.Ray(origin,target.sub(origin).normalize()),distance),false);
   }
  }
  for(let i=1;i<d.rooms.length;i++){const a=d.rooms[i-1],b=d.rooms[i];for(let n=0;n<=60;n++)assert.ok(p.fits(new T.Vector3(a.x+.5+(b.x-a.x)*n/60,2.65,a.z+.5+(b.z-a.z)*n/60)));}
  d.dispose();
 }
});

test('room atmosphere remains readable and resets deterministically without changing combat state',()=>{
 const scene=new T.Scene();scene.background=new T.Color();scene.fog=new T.FogExp2(0,.035);
 const state=freshHunt(),d=new Dungeon(scene,state,812),world={skyLight:new T.HemisphereLight(),sun:new T.DirectionalLight()},before=JSON.stringify(state);
 for(const r of d.rooms){d.atmosphere(world,scene,new T.Vector3(r.x+.5,2.65,r.z+.5),1/60);assert.ok(world.skyLight.intensity>=.9);assert.ok(scene.fog.density<.03);assert.ok(ROOM_MOODS[r.style]);}
 assert.equal(JSON.stringify(state),before);
 assert.equal(new Set(d.roomArchitecture.map(r=>r.style)).size,new Set(d.rooms.map(r=>r.style)).size);
 d.dispose();
});

test('abandoning a dressed run disposes label textures and removes all room geometry',()=>{
 const scene=new T.Scene(),d=new Dungeon(scene,freshHunt(),812),textures=new Set(),geometries=new Set();
 d.root.traverse(o=>{if(o.material?.map)textures.add(o.material.map);if(o.geometry)geometries.add(o.geometry);});
 let disposedTextures=0,disposedGeometry=0;for(const t of textures)t.addEventListener('dispose',()=>disposedTextures++);for(const g of geometries)g.addEventListener('dispose',()=>disposedGeometry++);
 assert.ok(textures.size>=d.rooms.length);d.dispose();
 assert.equal(disposedTextures,textures.size);assert.equal(disposedGeometry,geometries.size);assert.equal(scene.children.includes(d.root),false);
});

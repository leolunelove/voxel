import * as T from '../../vendor/three.module.js';
import {MELEE} from '../game/rules.js?v=88';
const samples=[[0,0],[-.14,0],[.14,0],[0,-.09],[0,.09]],aim=new T.Vector2(),hits=[];
// A small blade-width sweep, not a bullet-sized pixel. Every candidate still
// intersects an actual monster surface and must have an unobstructed approach.
export function swordContact(ray,camera,targets,world){
 for(const [x,y]of samples){ray.setFromCamera(aim.set(x,y),camera);hits.length=0;const hit=ray.intersectObjects(targets,false,hits)[0];if(hit&&hit.distance<MELEE.reach&&!world.obstructed(ray.ray,hit.distance))return hit;}
 return null;
}

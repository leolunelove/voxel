import * as T from '../../vendor/three.module.js';
export const BOW_ROTATION=[.03,.38,-.12];
export const BOW_VIEW_SCALE=.8424;
export const BOW_REST=new T.Vector3(.19,.14,-.20);
const rotation=new T.Quaternion().setFromEuler(new T.Euler(...BOW_ROTATION)),inverse=rotation.clone().invert();
export const easeDraw=x=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t);};
export function bowAnchor(draw){const p=easeDraw(draw);return new T.Vector3(-.25+.11*p,-.15+.11*p,-1.85+.20*p);}
export function bowFlight(draw){return new T.Vector3(0,0,-8).sub(bowAnchor(draw)).normalize();}
export function localBowFlight(draw){return bowFlight(draw).applyQuaternion(inverse);}
export function bowPosition(draw){return bowAnchor(draw).sub(BOW_REST.clone().multiplyScalar(BOW_VIEW_SCALE).applyQuaternion(rotation));}
export function viewArrowTip(draw){return bowAnchor(draw).addScaledVector(bowFlight(draw),(1.39-.22-.94*easeDraw(draw))*BOW_VIEW_SCALE);}
// Keep exactly the same screen position across the separate 48° item camera
// and the world camera. The arrow starts just ahead of the player, not at eye 0.
export function bowMuzzle(camera,draw){const tip=viewArrowTip(draw),depth=.55,ratio=Math.tan(camera.fov*Math.PI/360)/Math.tan(24*Math.PI/180),k=depth/-tip.z;return new T.Vector3(tip.x*k*ratio,tip.y*k*ratio,-depth).applyQuaternion(camera.quaternion).add(camera.position);}
// Low ballistic arc: solve time of flight while preserving the equipment speed.
export function ballisticVelocity(origin,target,speed,gravity=1.6){const delta=target.clone().sub(origin),distance2=delta.lengthSq(),a=speed*speed-gravity*delta.y,disc=a*a-gravity*gravity*distance2;if(distance2<1e-10||disc<0)return delta.normalize().multiplyScalar(speed);const time=Math.sqrt(2*distance2/(a+Math.sqrt(disc)));return delta.divideScalar(time).add(new T.Vector3(0,.5*gravity*time,0));}

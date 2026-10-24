import * as T from '../../vendor/three.module.js';
import {BOW_ROTATION,BOW_REST,easeDraw,localBowFlight} from './bow-space.js?v=63.1';
export {BOW_ROTATION} from './bow-space.js?v=63.1';
export const ARROW_DIRECTION=new T.Vector3(0,0,-1);
export function bowRig(draw,releaseAge=Infinity,releasedCharge=1,reduced=false){
 const d=Math.max(0,Math.min(1,draw)),age=Math.max(0,releaseAge),releasing=age<.24;
 const stance=releasing?releasedCharge*(1-easeDraw(age/.20)):d,pull=easeDraw(d);
 const tension=releasing?easeDraw(releasedCharge)*Math.exp(-age*36)*Math.cos(age*105):pull;
 const flight=localBowFlight(stance),nock=BOW_REST.clone().addScaledVector(flight,-(.22+.94*tension));
 return {pull,stance,aim:easeDraw(stance),tension,nock:nock.toArray(),flight:flight.toArray(),bend:tension*.32,
 arrowVisible:!releasing||age<.026,arrowLaunch:releasing?Math.min(1,age/.026)*3.2:0,
 follow:reduced?0:releasing?-.055*Math.sin(Math.min(1,age/.14)*Math.PI)*Math.exp(-age*10):0};
}
const up=new T.Vector3(0,1,0),forward=new T.Vector3(0,0,-1);
export function applyBowRig(tool,rig){
 const points=tool.getObjectByName('bowstring').geometry.attributes.position;
 for(const [index,side]of [[0,-1],[2,1]]){const y=side*.50,z=-.015,c=Math.cos(side*rig.bend),s=Math.sin(side*rig.bend);points.setXYZ(index,.28,y*c-z*s,y*s+z*c);}
 points.setXYZ(1,...rig.nock);points.needsUpdate=true;
 for(const [name,index]of [['string-lower',0],['string-upper',2]]){const cord=tool.getObjectByName(name);if(!cord)continue;const a=new T.Vector3().fromBufferAttribute(points,index),b=new T.Vector3(...rig.nock),delta=b.clone().sub(a);cord.position.copy(a).add(b).multiplyScalar(.5);cord.quaternion.setFromUnitVectors(up,delta.clone().normalize());cord.scale.y=delta.length();}
 const flight=new T.Vector3(...rig.flight),arrow=tool.getObjectByName('loaded-arrow');arrow.position.set(...rig.nock).addScaledVector(flight,rig.arrowLaunch);arrow.visible=rig.arrowVisible;arrow.quaternion.setFromUnitVectors(forward,flight);
 for(const [name,side]of [['upper-limb',1],['lower-limb',-1]])tool.getObjectByName(name).rotation.x=side*rig.bend;
}

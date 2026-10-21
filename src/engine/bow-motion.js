import * as T from '../../vendor/three.module.js';
export const BOW_ROTATION=[.04,.55,-.12];
export const ARROW_DIRECTION=new T.Vector3(-.055,.02,-1).normalize();
const localFlight=ARROW_DIRECTION.clone().applyQuaternion(new T.Quaternion().setFromEuler(new T.Euler(...BOW_ROTATION)).invert());
// Camera-local bow rig: positive Z pulls the nock toward the player.
export function bowRig(draw,releaseAge=Infinity,releasedCharge=1,reduced=false){
 const d=Math.max(0,Math.min(1,draw)),pull=d*d*(3-2*d),age=Math.max(0,releaseAge),releasing=age<.24;
 const snap=releasing?releasedCharge*Math.exp(-age*28)*Math.cos(age*100):0;
 const tension=releasing?snap:pull,nockZ=.02+.94*tension;
 return {pull,aim:releasing?1:pull,tension,nock:[.20+(1-pull)*.14*(releasing?0:1),-(1-pull)*.055*(releasing?0:1),nockZ],bend:tension*.32,
 arrowVisible:!releasing||age<.038,arrowLaunch:releasing?Math.min(1,age/.038)*2.8:0,
 follow:reduced?0:releasing?-.20*Math.sin(Math.min(1,age/.12)*Math.PI)*Math.exp(-age*5):0};
}
export function applyBowRig(tool,rig){
 const points=tool.getObjectByName('bowstring').geometry.attributes.position;
 for(const [index,side]of [[0,-1],[2,1]]){const y=side*.50,z=-.015,c=Math.cos(side*rig.bend),s=Math.sin(side*rig.bend);points.setXYZ(index,.28,y*c-z*s,y*s+z*c);}
 points.setXYZ(1,...rig.nock);points.needsUpdate=true;
 const arrow=tool.getObjectByName('loaded-arrow');arrow.position.set(...rig.nock);arrow.position.addScaledVector(localFlight,rig.arrowLaunch);arrow.visible=rig.arrowVisible;
 // The tip remains forward; the nock seats into the sight line as tension rises.
 arrow.quaternion.setFromUnitVectors(new T.Vector3(0,0,-1),localFlight);arrow.rotation.z+=(1-rig.aim)*.08;
 for(const [name,side]of [['upper-limb',1],['lower-limb',-1]])tool.getObjectByName(name).rotation.x=side*rig.bend;
}

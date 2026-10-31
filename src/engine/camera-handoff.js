import * as T from '../../vendor/three.module.js';
// The menu hands off the same world view; no spawn, yaw, or FOV reset on Begin/Resume.
export class CameraHandoff{
 constructor(){this.active=false;this.from=new T.Vector3();this.to=new T.Vector3();this.fromQ=new T.Quaternion();this.toQ=new T.Quaternion();}
 start(from,to,duration=.65){this.from.copy(from.position);this.to.copy(to.position);this.fromQ.copy(from.quaternion);this.toQ.copy(to.quaternion);this.fromFov=from.fov;this.toFov=to.fov;this.elapsed=0;this.duration=duration;this.active=true;}
 update(dt,camera){if(!this.active)return false;this.elapsed+=Math.max(0,dt);const t=Math.min(1,this.elapsed/this.duration),e=t*t*(3-2*t);camera.position.lerpVectors(this.from,this.to,e);camera.quaternion.slerpQuaternions(this.fromQ,this.toQ,e);camera.fov=this.fromFov+(this.toFov-this.fromFov)*e;camera.updateProjectionMatrix();if(t===1)this.active=false;return t===1;}
 cancel(){this.active=false;}
}

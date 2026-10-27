// A small, stable light budget avoids evaluating distant prison lamps per pixel.
import * as T from '../../vendor/three.module.js';
export class LightBudget{
 constructor(scene,limit=8){this.scene=scene;this.limit=limit;this.clock=1;this.lights=[];this.point=new T.Vector3();}
 update(dt,camera){this.clock+=dt;if(this.clock<.25)return;this.clock=0;const lights=[];this.scene.updateMatrixWorld();this.scene.traverse(o=>{if(!o.isPointLight)return;let visible=true;for(let p=o.parent;p;p=p.parent)if(!p.visible){visible=false;break;}if(!visible||(!o.visible&&!o.userData.budgetHidden))return;o.getWorldPosition(this.point);const d2=this.point.distanceToSquared(camera.position),reach=o.distance||50,fall=Math.max(.02,1-Math.sqrt(d2)/reach),score=Math.max(.01,o.intensity)*fall*fall/(2+d2)*(o.visible?1.18:1);lights.push({o,score});});lights.sort((a,b)=>b.score-a.score);lights.forEach(({o},i)=>{o.visible=i<this.limit;o.userData.budgetHidden=!o.visible;});this.lights=lights;}
}
export class RenderQuality{
 constructor(maxRatio){this.max=Math.min(maxRatio,1.5);this.ratio=this.max;this.samples=[];this.cooldown=3;}
 sample(dt){if(dt<=0||dt>.1)return null;this.cooldown-=dt;this.samples.push(dt);if(this.samples.length>120)this.samples.shift();if(this.cooldown>0||this.samples.length<60)return null;const sorted=[...this.samples].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];let next=this.ratio;
 if(median>.020)next=Math.max(Math.min(.85,this.max),this.ratio-.15);else if(median<.0175)next=Math.min(this.max,this.ratio+.1);
 this.cooldown=next<this.ratio?3:8;this.samples=[];if(Math.abs(next-this.ratio)<.01)return null;this.ratio=next;return next;}
}

import {bowRig,applyBowRig} from './bow-motion.js?v=68';
import {BOW_ROTATION,BOW_VIEW_SCALE,bowPosition} from './bow-space.js?v=68';
import {SWORDS,BOWS} from '../game/weapons.js?v=68';
import * as T from '../../vendor/three.module.js';
// Solid stepped tools with a square shaft, socket and tapered working edges.
const PALETTES=[[0x566161,0xb9c3bc,0xe2e6da],[0x4c5657,0xc9d4cc,0xf1f3e8],[0x20594c,0x54c7a7,0xa0f1cf],[0x364e5f,0x92b8cc,0xd9edf2],[0x765a24,0xd4ac45,0xffdf83],[0x713e31,0xe18a59,0xffc388]];
export function toolArtwork(tier,axe=false){
 const grid=Array.from({length:16},()=>Array(16).fill('.'));
 const put=(x,y,c)=>{if(x>=0&&x<16&&y>=0&&y<16)grid[y][x]=c;};
 for(let i=0;i<12;i++){const x=2+i,y=14-i;put(x,y,'h');put(x+1,y,'b');if(i%3===0)put(x,y,'H');}
 put(2,15,'b');put(13,2,'b');put(14,3,'b');
 const rows=axe?[[2,8,10],[3,7,12],[4,6,12],[5,6,11],[6,7,10]]:[[2,5,8],[3,2,9],[4,7,10],[5,9,11],[6,11,11],[7,11,11],[8,11,11]];
 const cells=[];for(const [y,a,b]of rows)for(let x=a;x<=b;x++)cells.push([x,y]);
 for(const [x,y]of cells)for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])put(x+dx,y+dy,'O');
 for(const [x,y]of cells)put(x,y,y===2||x===rows.find(r=>r[0]===y)[1]?'S':'M');
 const palette=PALETTES[Math.min(5,tier)],colors={O:palette[0],M:palette[1],S:palette[2],b:0x3b220e,h:0x593817,H:0x67401e};
 return {grid,colors};
}
function pixelTool(tier,axe=false){
 const {grid,colors}=toolArtwork(tier,axe);
 const unit=new T.BoxGeometry(.066,.066,.052),positions=[],normals=[],vertexColors=[];
 // Non-indexed boxes form one draw call; square pixels keep the tool's silhouette crisp.
 const geo=unit.toNonIndexed(),v=geo.attributes.position,norm=geo.attributes.normal;
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ch=grid[y][x];if(ch==='.')continue;const color=new T.Color(colors[ch]);for(let i=0;i<v.count;i++){positions.push(v.getX(i)+(x-7.5)*.066,v.getY(i)+(7.5-y)*.066,v.getZ(i));normals.push(norm.getX(i),norm.getY(i),norm.getZ(i));const shade=norm.getZ(i)===0?.76:1;vertexColors.push(color.r*shade,color.g*shade,color.b*shade);}}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new T.Float32BufferAttribute(vertexColors,3));geometry.computeBoundingSphere();unit.dispose();geo.dispose();
 const root=new T.Group();root.add(new T.Mesh(geometry,new T.MeshLambertMaterial({vertexColors:true})));return root;
}
export function toolIcon(tier,kind='pick'){const {grid,colors}=toolArtwork(kind==='axe'?([0,1,2,4][tier]??0):tier,kind==='axe'),canvas=document.createElement('canvas');canvas.width=canvas.height=16;const ctx=canvas.getContext('2d');for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(grid[y][x]!=='.'){ctx.fillStyle='#'+colors[grid[y][x]].toString(16).padStart(6,'0');ctx.fillRect(x,y,1,1);}return canvas.toDataURL();}
// Tool space: +Y runs up the handle; -Z is the working direction.
// A head aligned along Z can reach into a block without presenting a broadside.
export function createPickaxe(tier){
 const root=new T.Group(),palette=PALETTES[Math.min(5,tier)];
 const wood=new T.MeshLambertMaterial({color:0x67401e}),grip=new T.MeshLambertMaterial({color:0x382719}),metal=new T.MeshLambertMaterial({color:palette[1]}),edge=new T.MeshLambertMaterial({color:palette[0]}),shine=new T.MeshLambertMaterial({color:palette[2]});
 const box=(size,p,mat)=>{const m=new T.Mesh(new T.BoxGeometry(...size),mat);m.position.set(...p);root.add(m);return m;};
 const bottom=new T.Vector3(0,-1.00,.22),top=new T.Vector3(0,.30,0),shaft=box([.075,bottom.distanceTo(top),.075],bottom.clone().lerp(top,.5).toArray(),wood);
 shaft.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),top.clone().sub(bottom).normalize());
 for(let i=0;i<4;i++){const band=box([.088,.028,.088],bottom.clone().lerp(top,.10+i*.075).toArray(),grip);band.quaternion.copy(shaft.quaternion);}
 box([.155,.18,.17],[0,.285,0],edge);
 box([.165,.035,.18],[0,.375,0],shine);
 for(const [size,pos] of [ [[.14,.12,.20],[0,.30,-.12]], [[.115,.10,.16],[0,.28,-.28]], [[.085,.07,.12],[0,.25,-.40]], [[.05,.04,.06],[0,.22,-.48]] ])box(size,pos,metal);
 // A shorter curved rear point and a darker socket keep the silhouette readable.
 box([.14,.11,.19],[0,.275,.15],metal);
 box([.10,.12,.13],[0,.20,.28],metal);
 box([.065,.12,.08],[0,.105,.35],edge);
 box([.145,.018,.18],[0,.365,-.12],shine);
 return root;
}
export function createAxe(tier){
 const root=new T.Group(),palette=PALETTES[[0,1,2,4][tier]??0];
 const wood=new T.MeshLambertMaterial({color:0x67401e}),grip=new T.MeshLambertMaterial({color:0x382719}),metal=new T.MeshLambertMaterial({color:palette[1]}),dark=new T.MeshLambertMaterial({color:palette[0]}),edge=new T.MeshLambertMaterial({color:palette[2]});
 const box=(size,p,mat)=>{const m=new T.Mesh(new T.BoxGeometry(...size),mat);m.position.set(...p);root.add(m);return m;};
 const bottom=new T.Vector3(0,-1.00,.22),top=new T.Vector3(0,.32,0),shaft=box([.08,bottom.distanceTo(top),.08],bottom.clone().lerp(top,.5).toArray(),wood);shaft.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),top.clone().sub(bottom).normalize());
 for(let i=0;i<4;i++){const band=box([.092,.028,.092],bottom.clone().lerp(top,.10+i*.075).toArray(),grip);band.quaternion.copy(shaft.quaternion);}
 box([.17,.21,.18],[0,.27,0],dark);box([.14,.085,.16],[0,.27,.15],metal);
 box([.15,.26,.19],[0,.275,-.12],metal);
 box([.12,.34,.14],[0,.255,-.27],metal);
 box([.075,.38,.08],[0,.245,-.36],edge);
 box([.035,.33,.04],[0,.245,-.42],edge);
 return root;
}
export function createSword(tier=0){const spec=SWORDS[tier],root=new T.Group();const box=(s,p,c)=>{const m=new T.Mesh(new T.BoxGeometry(...s),new T.MeshLambertMaterial({color:c}));m.position.set(...p);root.add(m);};box([.09,.35,.09],[0,-.30,0],0x67401e);box([.14,.07,.14],[0,-.50,0],spec.trim);box([.38+(tier===3?.08:0),.07,.14],[0,-.10,0],spec.trim);box([.14+(tier>=2?.035:0),.65,.09],[0,.26,0],spec.color);box([.08,.13,.07],[0,.65,0],spec.color);box([.035,.65,.10],[-.065,.26,0],0xe3eade);if(tier>0)box([.055,.11,.12],[0,-.075,0],spec.color);return root;}
export function createBow(tier=0){const spec=BOWS[tier],root=new T.Group(),mat=new T.MeshLambertMaterial({color:spec.color}),trim=new T.MeshLambertMaterial({color:spec.trim});
 const grip=new T.Mesh(new T.BoxGeometry(.13,.24,.17),mat);grip.position.set(.31,0,-.20);root.add(grip);
 for(const y of [-.08,0,.08]){const wrap=new T.Mesh(new T.BoxGeometry(.145,.025,.185),trim);wrap.position.set(.31,y,-.20);root.add(wrap);}
 const rest=new T.Mesh(new T.BoxGeometry(.16,.035,.12),trim);rest.position.set(.23,.115,-.20);root.add(rest);
 for(const side of [-1,1]){const limb=new T.Group();limb.name=side>0?'upper-limb':'lower-limb';root.add(limb);for(const [y,z,angle]of [[.20,-.16,-.30],[.39,-.075,-.50]]){const m=new T.Mesh(new T.BoxGeometry(.085+(tier===3?.025:0),.25,.12),mat);m.position.set(.28,side*y,z);m.rotation.x=side*angle;limb.add(m);}const cap=new T.Mesh(new T.BoxGeometry(.10,.08,.10),trim);cap.position.set(.28,side*.49,-.015);limb.add(cap);}
 const geometry=new T.BufferGeometry().setFromPoints([new T.Vector3(.28,-.50,-.015),new T.Vector3(.20,0,.02),new T.Vector3(.28,.50,-.015)]),string=new T.Line(geometry,new T.LineBasicMaterial({color:0xe0d6b6}));string.name='bowstring';root.add(string);for(const name of ['string-upper','string-lower']){const cord=new T.Mesh(new T.CylinderGeometry(.005,.005,1,5),new T.MeshLambertMaterial({color:0xe0d6b6}));cord.name=name;root.add(cord);}
 const arrow=new T.Group();arrow.name='loaded-arrow';const shaft=new T.Mesh(new T.BoxGeometry(.028,.028,1.40),new T.MeshLambertMaterial({color:0xd4bb84}));shaft.position.z=-.64;arrow.add(shaft);const tip=new T.Mesh(new T.ConeGeometry(.045,.12,4),trim);tip.rotation.x=-Math.PI/2;tip.position.z=-1.39;arrow.add(tip);for(const angle of [0,Math.PI*2/3,Math.PI*4/3]){const feather=new T.Mesh(new T.BoxGeometry(.10,.012,.16),trim);feather.rotation.z=angle;feather.position.z=.025;arrow.add(feather);}arrow.position.x=.20;root.add(arrow);applyBowRig(root,bowRig(0));return root;}
export function bowPose(draw,aspect,recoil=0){return {position:bowPosition(draw).toArray(),rotation:[...BOW_ROTATION]};}
export function swingPose(phase){
 // A deliberate lift, accelerating downstroke, two-frame contact, then a
 // short rebound. Recovery occupies most of the cycle so holding feels calm.
 const keys=[[0,0,0,0,0,0,0],[.16,.008,.22,.035,.08,-.04,.025],[.30,-.10,-.015,-.20,-.36,.05,-.04],[.34,-.10,-.015,-.20,-.36,.05,-.04],[.44,-.02,.13,.045,.065,-.025,.02],[.76,0,0,0,0,0,0],[1,0,0,0,0,0,0]];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(phase<=b[0]){if(phase===b[0])return b.slice(1);let t=Math.max(0,(phase-a[0])/(b[0]-a[0]));t=i===2?t*t:t*t*(3-2*t);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*t);}}
 return [0,0,0,0,0,0];
}

export const TOOL_SCALE=.78;
export const BOW_SCALE=BOW_VIEW_SCALE;
export const TOOL_DEPTH=1.90;
export const CONTACT_TIP=new T.Vector3(0,.22,-.51);
export const AXE_TIP=new T.Vector3(0,.245,-.44);
export const SWORD_TIP=new T.Vector3(0,.715,0);
export function swordSwingPose(phase){
 const keys=[[0,0,0,0,0,0,0],[.18,.035,.10,.05,.11,-.08,.20],[.30,-.08,-.06,-.23,-.44,.12,-.24],[.34,-.08,-.06,-.23,-.44,.12,-.24],[.50,.015,.055,.04,.08,-.025,.08],[.82,0,0,0,0,0,0],[1,0,0,0,0,0,0]];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(phase<=b[0]){let t=Math.max(0,(phase-a[0])/(b[0]-a[0]));t=i===2?t*t:t*t*(3-2*t);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*t);}}return [0,0,0,0,0,0];
}
export function heldPose(phase,aspect,motion=1,kind='pick',draw=0,recoil=0){
 if(kind==='bow')return bowPose(draw,aspect,recoil);
 const p=kind==='sword'?swordSwingPose(phase):swingPose(phase),halfWidth=Math.tan(24*Math.PI/180)*TOOL_DEPTH*aspect,x=Math.min(.56,Math.max(.08,halfWidth-.82)),distance=phase<.30?.30-phase:Math.max(0,phase-.34),t=Math.max(0,1-distance/.14),contact=t*t*(3-2*t);
 // Hold the silhouette diagonally at the right shoulder. Pitch does the work;
 // yaw stays quiet so the head drives forward instead of sweeping sideways.
 const rotation=[-.12+p[3]*motion*1.25,.38+p[4]*motion*.25,.20-p[5]*motion*.65];
 if(kind==='sword'){rotation[0]=-.35+p[3]*motion*1.4;rotation[1]=-.25+p[4]*motion;rotation[2]=-.25+p[5]*motion;}
 const position=[x+p[0]*motion,(kind==='sword'?-.43:-.22)+p[1]*motion,-TOOL_DEPTH+p[2]*motion];
 position[0]=Math.min(position[0],halfWidth*.62);if(kind==='sword')position[2]-=.16*contact*motion;
 const tip=(kind==='sword'?SWORD_TIP:kind==='pick'?CONTACT_TIP:AXE_TIP).clone().multiplyScalar(TOOL_SCALE).applyEuler(new T.Euler(...rotation));
 if(kind!=='sword'){
  // Animate the working point, then solve the grip behind it. Blending the
  // grip toward a reticle correction made the old tip dip and float back up.
  const right=Math.min(.40,halfWidth*.36),rest=[right,-.18,-2.28];
  const keys=[[0,...rest],[.16,right+.008,.18,-2.22],[.30,0,0,-2.48],[.34,0,0,-2.48],[.44,right*.38,.085,-2.26],[.76,...rest],[1,...rest]];
  let point=rest;
  for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(phase<=b[0]){let u=Math.max(0,(phase-a[0])/(b[0]-a[0]));u=i===2?u*u:u*u*(3-2*u);point=a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);break;}}
  for(let i=0;i<3;i++)position[i]=rest[i]+(point[i]-rest[i])*motion-tip.getComponent(i);
 }else{position[0]+=(-tip.x-position[0])*contact*motion;position[1]+=(-tip.y-position[1])*contact*motion;}
 return {position,rotation};
}
// Solve the viewmodel tip onto the aimed surface's screen position, independent
// of camera yaw/pitch. This does not rotate, slow, or lock the gameplay camera.
export function contactPivot(point,gameCamera,viewCamera,rotation,scale=TOOL_SCALE,tipPoint=CONTACT_TIP){
 const ndc=point.clone().project(gameCamera),depth=TOOL_DEPTH;
 const target=new T.Vector3(ndc.x,ndc.y,.5).unproject(viewCamera);
 target.multiplyScalar(-depth/target.z);
 const tip=tipPoint.clone().multiplyScalar(scale).applyEuler(rotation);
 return target.sub(tip);
}

import * as T from '../../vendor/three.module.js';
import {batchScenery} from '../engine/static-batch.js?v=88';
import {SPAWN,groundHeight,inPreview,inBus} from './arrival-layout.js?v=88';
function texture(kind){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');let seed=317;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const bg={brick:'#77736d',stone:'#b0a89a',ground:'#a19a89',metal:'#5a6262',wood:'#8c6745'}[kind];ctx.fillStyle=bg;ctx.fillRect(0,0,256,256);
 if(kind==='brick'){ctx.fillStyle='#5f5c56';for(let row=0;row<8;row++){ctx.fillRect(0,row*32,256,2);for(let col=-1;col<5;col++)ctx.fillRect(col*64+(row%2)*32,row*32,2,32);}for(let i=0;i<72;i++){const x=Math.floor(random()*4)*64,y=Math.floor(random()*8)*32;ctx.fillStyle=random()>.5?'#8a8073':'#6c6b66';ctx.globalAlpha=.35;ctx.fillRect(x+3,y+3,58,26);}ctx.globalAlpha=1;}
 if(kind==='ground'){ctx.fillStyle='#8d877b';ctx.fillRect(0,0,256,2);ctx.fillRect(0,0,2,256);ctx.fillStyle='#b3ab98';ctx.fillRect(2,3,252,1);}
 if(kind==='wood'){for(let x=0;x<256;x+=16){ctx.fillStyle=x%32?'#795a3d':'#9b7952';ctx.fillRect(x,0,2,256);}}
 for(let i=0;i<3200;i++){ctx.fillStyle=random()>.5?'#e1d6bf':'#332f2b';ctx.globalAlpha=kind==='metal'?.035:.055;ctx.fillRect(Math.floor(random()*256),Math.floor(random()*256),1+Math.floor(random()*2),1);}ctx.globalAlpha=1;
 const map=new T.CanvasTexture(c);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.magFilter=T.NearestFilter;map.anisotropy=8;return map;}
export class ArrivalWorld{
 constructor(scene,options={}){this.options=options;this.scene=scene;this.layout={spawn:SPAWN};this.blockers=[];this.geometry=new T.BoxGeometry(1,1,1);this.dynamic=new T.Group();scene.add(this.dynamic);this.materials=new Map();this.textures=new Map(['brick','stone','ground','metal','wood'].map(k=>[k,texture(k)]));this.time=0;this.checked=false;this.build();this.stats=batchScenery(scene,this.geometry,[this.dynamic]);}
 material(color,kind='',repeat=1){const key=color+kind+repeat;if(!this.materials.has(key)){let map=null;if(kind){map=this.textures.get(kind).clone();map.repeat.set(repeat,repeat);map.needsUpdate=true;}this.materials.set(key,new T.MeshStandardMaterial({color,map,roughness:kind==='metal'?.72:.95}));}return this.materials.get(key);}
 box(x,y,z,w,h,d,color=0xffffff,kind='',solid=false,parent=this.scene){const m=new T.Mesh(this.geometry,this.material(color,kind));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=true;m.receiveShadow=true;parent.add(m);if(solid)this.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));return m;}
 // UVs on larger architectural surfaces use world proportions rather than stretching one tile.
 surface(x,y,z,w,h,d,color,kind,solid=false){const m=this.box(x,y,z,w,h,d,color,kind,solid);const g=new T.BoxGeometry(w,h,d),uv=g.attributes.uv,n=g.attributes.normal;for(let i=0;i<uv.count;i++){const nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i));uv.setXY(i,uv.getX(i)*(nx?d:w)/2,uv.getY(i)*(ny?d:h)/2);}m.geometry=g;m.scale.set(1,1,1);return m;}
 sign(lines,x,y,z,w,h,angle=0,light=false){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle=light?'#c3b69c':'#283131';ctx.fillRect(0,0,1024,256);ctx.fillStyle=light?'#333c3b':'#dbccad';ctx.textAlign='center';lines.forEach((s,i)=>{ctx.font=(i===0?'600 ':'400 ')+(lines.length===1?110:i===0?77:39)+'px monospace';ctx.fillText(s,512,lines.length===1?166:110+i*85);});const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.95}));m.position.set(x,y,z);m.rotation.y=angle;this.scene.add(m);return m;}
 lamp(x,y,z,power=30,reach=10,color=0xffc58a){this.box(x,y+.08,z,.65,.14,.4,0x354141,'metal');const bulb=this.box(x,y-.02,z,.42,.08,.24,color);bulb.material=new T.MeshBasicMaterial({color,toneMapped:false});const l=new T.PointLight(color,power,reach,2);l.position.set(x,y-.18,z);this.scene.add(l);return l;}
 contact(x,z,w,d,opacity=.25,y=.015){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),gradient=ctx.createRadialGradient(32,32,1,32,32,32);gradient.addColorStop(0,'rgba(0,0,0,1)');gradient.addColorStop(.6,'rgba(0,0,0,.4)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,opacity,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);this.scene.add(m);}
 officer(x,z,angle=0,desk=false){const g=new T.Group();this.dynamic.add(g);const b=(a,y,c,w,h,d,color)=>this.box(a,y,c,w,h,d,color,'',false,g);for(const a of [-.16,.16]){b(a,.4,0,.23,.74,.29,0x28393e);b(a,.10,.06,.27,.19,.43,0x222a2b);}b(0,1.05,0,.64,.66,.37,0x344d53);b(0,.75,0,.66,.12,.4,0x252d2e);b(0,1.42,0,.24,.15,.23,0xb08566);const head=b(0,1.66,0,.43,.43,.4,0xb78d70);b(0,1.91,-.01,.53,.12,.47,0x2e4247);b(0,1.87,.18,.55,.05,.16,0x2b3b3d);for(const a of [-.11,.11])b(a,1.7,.207,.045,.045,.015,0x263035);b(-.16,1.16,.2,.1,.14,.025,0xc4ab6a);const arms=[];for(const a of [-.43,.43]){const arm=new T.Group();arm.position.set(a,1.32,0);g.add(arm);const sleeve=this.box(0,-.23,0,.2,.5,.26,0x344d53,'',false,arm);this.box(0,-.52,0,.18,.15,.2,0xb78d70,'',false,arm);arms.push(arm);}g.position.set(x,0,z);g.rotation.y=angle;g.userData={head,arms,desk,baseAngle:angle};this.officers??=[];this.officers.push(g);this.contact(x,z,1.3,.9,.35);return g;}
 build(){const B=(...a)=>this.box(...a),S=(...a)=>this.surface(...a);
 // A contained, human-scale arrival depot. Reception is the focal point across the bus bay.
 S(3,-.35,-2,34,.7,50,0xd5c7ae,'ground');S(3,.012,-1,32,.025,46,0xc8bdab,'ground');
 this.contact(0,11,10,16,.5);this.contact(4,-9,24,7,.22);this.contact(-12,4,5,35,.18);this.contact(19,6,5,32,.2);
 for(const x of [-14,20]){S(x,3.7,4,.6,7.4,36,0x93938a,'brick',true);B(x,7.5,4,1,.35,36,0x7e8178,'stone');for(let z=-8;z<22;z+=5){B(x,4,z,.95,8,1,0x888d86,'stone');B(x,8.3,z,.12,1.2,.12,0x465351);}}
 // Rear transport gate with visible double leaves and watch post.
 for(const x of [-10.4,14.4])S(x,3.8,22,7.2,7.6,.7,0x92958a,'brick',true);for(const x of [-6.4,10.4])B(x,4,22,.6,8,.8,0x6d7874,'metal',true);
 for(let x=-6;x<=10;x+=.6)B(x,3,22,.12,5.5,.15,0x4b5a59,'metal',true);for(const y of [.4,4.8,5.7])B(2,y,22,16,.12,.18,0x56635d,'metal');
 for(const x of [-14,20])for(const y of [8.2,8.6])B(x,y,5,.035,.035,34,0x3d4d4a);
 S(-11,5.4,18,5,10.8,5,0x858b82,'brick',true);B(-11,11.3,18,6,.5,6,0x4b5a57,'metal');B(-11,10.5,20.55,3.8,1.2,.1,0x465e61);for(const x of [-12.7,-11,-9.3])B(x,10.5,20.64,.08,1.2,.1,0x293c3d);this.lamp(-11,11,20.8,32,8);
 // Main reception building: layered plinth, pilasters, real deep portico and roofline.
 for(const [x,w]of [[-5.1,13.8],[13.1,13.8]])S(x,4.5,-10,w,9,.75,0xd2cdc0,'brick',true);
 S(-12.3,4.5,-18,.7,9,16,0xc6c5b7,'brick',true);S(20.3,4.5,-18,.7,9,16,0xc6c5b7,'brick',true);if(this.options.integrated){S(-.5,4.5,-27,24,9,.7,0xc6c5b7,'brick',true);S(17.75,4.5,-27,5.5,9,.7,0xc6c5b7,'brick',true);S(13.25,6,-27,3.5,6,.7,0xc6c5b7,'brick',true);}else S(4,4.5,-27,33,9,.7,0xc6c5b7,'brick',true);
 S(4,9.3,-18,34,.55,19,0x65716a,'stone',true);B(4,9.72,-18,34.5,.25,19.5,0x3c4b49,'metal');
 for(const [x,w]of [[-5.2,13.5],[13.2,13.5]])S(x,.65,-9.55,w,1.3,.4,0x777b70,'stone',true);
 for(const x of [-12,-2,10,20]){S(x,4.6,-9.45,.8,9.2,1,0xa4a99b,'stone',true);B(x,.35,-9.2,1.2,.7,1.3,0x7d877b,'stone',true);B(x,9.3,-9.2,1.3,.35,1.4,0x66736b);}
 for(const x of [-9,-6,-3,12,15,18]){B(x,4.45,-9.54,1.85,2.6,.18,0x2f4244,'metal');for(const dx of [-.98,.98])B(x+dx,4.45,-9.32,.14,2.9,.38,0x9ea797,'stone');B(x,3.07,-9.3,2.25,.22,.6,0x747f73,'stone');B(x,5.85,-9.3,2.25,.2,.55,0x747f73,'stone');for(const dx of [-.6,0,.6])B(x+dx,4.45,-9.16,.075,2.5,.10,0x3b4c49,'metal');B(x,4.35,-9.12,1.8,.075,.1,0x3b4c49);}
 this.sign(['BLOCK 07'], -6,7.55,-9.46,5.2,.8,0);this.sign(['RECEPTION'],4,4.55,-7.16,5.6,.72,0);
 B(4,5.25,-8,12,.4,5.5,0x4a5b56,'metal',true);B(4,5.5,-8,12.4,.13,5.8,0x6f7d6b);for(const x of [-1.5,9.5]){S(x,2.5,-6,.48,5,.48,0x8b9684,'stone',true);B(x,.16,-6,.8,.32,.8,0x6c796d,'stone');}
 for(const x of [2.03,5.97]){B(x,2.15,-9.7,.18,4.3,.8,0x3d514e,'metal',true);B(x,.13,-9.55,.3,.26,1,0xa99874);}B(4,4.35,-9.65,4.1,.18,.8,0x344846,'metal');
 // Doors are parked open along the jambs, with a warm vestibule beyond.
 for(const x of [1.84,6.16]){B(x,2.05,-10.5,.16,4.1,1.8,0x8c563d,'metal',true);B(x,2.9,-10.49,.18,1.1,1.3,0x2f403e);}
 for(const x of [.8,7.2])this.lamp(x,3.3,-9,33,8);this.lamp(4,4.95,-6.5,38,10);
 B(-7,6.5,-9.45,13,.09,.1,0x5a6a60);for(const x of [-11,0,10,19])B(x,6.5,-9.42,.2,.25,.15,0x687569);
 // Small cameras, intake bench, drain and bollards keep the approach legible.
 const camera=B(9.15,4.8,-6.8,.5,.32,.75,0xc2c8b5);camera.rotation.y=-.5;B(9.05,4.77,-6.38,.23,.16,.02,0x263c3c);
 for(const x of [12,15]){B(x,.68,-6,2.6,.16,.7,0xa18159,'wood',true);for(const dx of [-.9,.9])B(x+dx,.32,-6,.12,.65,.55,0x485b53,'metal',true);B(x,1.05,-6.3,2.6,.45,.13,0x93744d,'wood');}
 for(const z of [-6,0,5]){B(8,.35,z,.2,.7,.2,0x55685b,'metal',true);B(8,.65,z,.22,.15,.22,0xc9a15d);}
 B(10,.025,-3,1,.03,13,0x7c8375);for(let z=-9;z<3;z+=.25)B(10,.047,z,.85,.015,.07,0x4c5b52);
 for(let z=-7;z<=10;z+=2.4)B(4.2+((z+7)/17)*1.5,.033,z,.09,.018,1.1,0xba9860);
 // A hint of the residential block rises beyond the reception roof.
 S(-7,11.5,-25,9,7,7,0xaaa99a,'brick');B(-7,15.2,-25,9.6,.35,7.6,0x56665b);for(const x of [-10,-7,-4]){B(x,12.7,-21.45,1.1,1.6,.08,0x334a49);for(const dx of [-.3,0,.3])B(x+dx,12.7,-21.37,.06,1.6,.1,0x617167);}
 // Reception interior: a generous clear approach, staffed counter and property cage.
 S(4,-.08,-19,31,.16,17,0xc9c1ab,'ground');S(-11.85,1,-19,.12,2,15,0x8f6a50,'stone');S(19.85,1,-19,.12,2,15,0x8f6a50,'stone');
 B(4,4.2,-18.5,31,.25,16.5,0x9b9f8c,'stone',true);for(const z of [-14,-19,-24]){this.lamp(4,3.95,z,65,10);B(4,4.08,z,8,.12,.2,0x54645a);}
 B(4,.525,-23.2,8,1.05,.9,0x526159,'metal',true);B(4,1.12,-23.2,8.4,.14,1.3,0xb2a385,'wood',true);B(4,.92,-22.7,7.6,.08,.04,0x839080);
 this.sign(['RECEPTION','E / CHECK IN'],4,.61,-22.72,2.8,.38,0,true);
 B(1.5,1.36,-23,.55,.22,.48,0x344940);const bulb=B(1.5,1.51,-23,.35,.06,.25,0xe2b674);bulb.material=new T.MeshBasicMaterial({color:0xe2b674});this.deskLamp=bulb;
 this.ledger=this.box(4,1.24,-22.9,.7,.04,.9,0xe1d2ad,'',false,this.dynamic);B(4,1.27,-22.9,.6,.02,.04,0x8c8069);
 this.deskOfficer=this.officer(4,-24.4,0,true);this.rook=this.officer(7.1,-5.2,-.25);
 for(let z=-25.5;z<-18;z+=.35)B(-1.2,2,z,.07,4,.08,0x5c6c60,'metal',true);B(-1.2,3.9,-22, .12,.15,8,0x4c5e54);for(const x of [-10,-7,-4]){B(x,.6,-24,1.5,1.2,1.5,0x657567,'metal',true);B(x,1.21,-24,1.4,.1,1.4,0x8c9784);}
 this.sign(['PROPERTY STORAGE'], -6.5,3.8,-26.55,5,.6);if(!this.options.integrated)B(13,1.3,-26.55,1.7,2.6,.2,0x88553d,'metal',true);if(!this.options.integrated)B(13,1.9,-26.39,1.1,.8,.04,0x2b4440);if(!this.options.integrated)for(const dx of [-.45,0,.45])B(13+dx,1.9,-26.33,.06,.8,.08,0x5f7465);this.sign(['TOOL ISSUE'],13,2.98,-26.5,2.2,.35);
 // Prison transport: enclosed cabin, real aisle, seat rows and an open front-right stair.
 const cream=0xc2beaa,teal=0x3c5554;
 B(0,.67,11,6.1,.35,12.6,0x3b4d48,'metal',true);B(0,.88,11,5.8,.08,12.2,0x928e77,'ground');
 for(const x of [-3,3]){if(x<0)B(x,1.3,11,.16,1.2,12.5,teal,'metal',true);else B(x,1.3,12.45,.16,1.2,9.3,teal,'metal',true);B(x,3.65,11,.2,.4,12.6,cream,'metal',true);B(x,1.88,11,.22,.12,12.5,0xa76c40);}
 B(0,3.92,11,6.2,.22,12.8,cream,'metal',true);B(0,2.35,17.25,6.1,3.2,.2,teal,'metal',true);this.blockers.push(new T.Box3(new T.Vector3(-3,1.7,4.9),new T.Vector3(3,3.7,5.1))); B(0,1.55,5.7,5.6,1.2,.8,0x40534d,'metal',true);
 // Window frames with pale upper glass and guard bars; open view of Reception through the windshield.
 for(const x of [-3.03,3.03])for(const z of [8.8,11.4,14,16]){B(x,2.72,z,.07,1.3,2.05,0x617c70);for(const dz of [-1.07,1.07])B(x,2.72,z+dz,.13,1.65,.14,cream,'metal',true);B(x,2.65,z,.15,.06,2.1,0x344d46);}
 const windshield=new T.Mesh(new T.PlaneGeometry(5.4,1.5),new T.MeshPhysicalMaterial({color:0xb5c5ae,transparent:true,opacity:.12,roughness:.3,side:T.DoubleSide,depthWrite:false}));windshield.position.set(0,2.8,4.91);this.scene.add(windshield); // facade remains visible from the aisle
 // Replace the opaque front upper panel with split pillars so the windshield is a real view.
  // dashboard remains the actual collision stop
 for(const x of [-2.8,0,2.8])B(x,2.8,5,.15,1.8,.2,cream,'metal');
 for(const z of [8.6,11,13.4,15.8])for(const x of [-1.75,1.75]){B(x,1.42,z,1.8,.22,1.2,0x5b625f,'',true);B(x,2.05,z+.55,1.8,1.25,.22,0x5b625f,'',true);for(const dx of [-.65,.65])B(x+dx,1.1,z,.1,.5,.65,0x394f45);}
 for(const z of [8,13])this.lamp(0,3.7,z,13,6,0xffd7a0);
this.sign(['EXIT →'],2.87,3.05,6.5,1.5,.24,-Math.PI/2);
 // Exit to the bay: clearly edged treads, handrail, folding leaves parked at the door.
 for(const [x,top,w]of [[3.35,.64,.7],[4.05,.4,.7],[4.75,.18,.7]]){B(x,top/2,6.5,w,top,2.4,0x5c695b,'metal');B(x,top+.012,6.5,.07,.025,2.3,0xc2a263);}
 for(const z of [5.3,7.7]){B(3.8,1.25,z,.07,1.5,.07,0xc3b992);B(3.8,1.95,z,1.6,.07,.07,0xc3b992);}
 for(const z of [5.15,7.85])B(3.2,2.1,z,.22,2.5,.8,cream,'metal');
 for(const x of [-3.1,3.1])for(const z of [7.5,14.8]){const tire=new T.Mesh(new T.CylinderGeometry(.8,.8,.35,12),this.material(0x283b34));tire.rotation.z=Math.PI/2;tire.position.set(x,.78,z);tire.castShadow=true;this.scene.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(.39,.39,.38,10),this.material(0x81917b));hub.rotation.z=Math.PI/2;hub.position.copy(tire.position);this.scene.add(hub);}
 this.sign(['CORRECTIONS / 07'],3.13,1.35,12,5,.45,Math.PI/2,true);this.sign(['PRISON TRANSPORT'],0,3.68,4.87,4,.35,Math.PI,true);
 // Lighting and restrained voxel cloud layers.
 if(this.options.lighting!==false){this.scene.background=new T.Color(0xaebdc7);this.scene.fog=new T.FogExp2(0xaebdc7,.008);this.scene.add(new T.HemisphereLight(0xdde3e4,0x706553,1.45));const sun=new T.DirectionalLight(0xffdfae,3.4);sun.position.set(-22,32,18);sun.castShadow=true;sun.shadow.autoUpdate=false;sun.shadow.needsUpdate=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-32,right:32,top:40,bottom:-38,near:1,far:100});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;sun.shadow.blurSamples=8;sun.target.position.set(3,0,-3);this.scene.add(sun,sun.target);this.sun=sun;
 for(const [x,z,w,d]of [[-20,-45,18,7],[18,-55,25,8],[-30,0,15,6],[30,5,16,5]])B(x,29,z,w,.5,d,0xd6dfd2);}
 }
 solid(x,y,z){return !inPreview(x,z)||y<groundHeight(x,z);}
 stepHeight(x,z){return Math.max(...[-.28,.28].flatMap(dx=>[-.28,.28].map(dz=>groundHeight(x+dx,z+dz))));}
 checkIn(){this.checked=true;this.stamp=1;this.deskLamp.material.color.setHex(0xa8c99a);}
 update(dt,position){this.time+=dt;for(const g of this.officers){const d=Math.hypot(position.x-g.position.x,position.z-g.position.z),turn=d<5?Math.atan2(position.x-g.position.x,position.z-g.position.z):g.userData.baseAngle;g.rotation.y+=Math.atan2(Math.sin(turn-g.rotation.y),Math.cos(turn-g.rotation.y))*(1-Math.exp(-dt*2));g.userData.head.position.y=1.66+Math.sin(this.time*1.5)*.007;const arm=g.userData.arms[0];arm.rotation.x=g.userData.desk&&this.stamp?-.9*Math.sin((1-this.stamp)*Math.PI):Math.sin(this.time*1.1)*.025;}
 if(this.stamp){this.stamp=Math.max(0,this.stamp-dt*1.4);this.ledger.position.z=-22.9+(1-this.stamp)*.25;} }
}

import {buildContainmentDetail} from './containment-detail.js?v=81.3';
import {buildTimberDetail} from './timber-detail.js?v=81.3';
import * as T from '../../vendor/three.module.js';
import {surfaceTexture} from '../engine/surface-textures.js?v=81.3';
import {createPickaxe} from '../engine/pickaxe.js?v=81.3';
import {buildCell} from './cell.js?v=81.3';
import {buildUnderblockEntry} from './underblock-entry.js?v=81.3';
import {LABOUR_WINGS,inBox,yardFloor,intakeFloor} from './strict-layout.js?v=81.3';
function relocate(world,build,position,angle=0){const previous=new Set(world.scene.children),first=world.blockers.length;build(world);const matrix=new T.Matrix4().makeRotationY(angle);matrix.setPosition(...position);for(const o of world.scene.children)if(!previous.has(o))o.applyMatrix4(matrix);for(const b of world.blockers.slice(first))b.applyMatrix4(matrix);}
export function buildStrictPrison(world){
 const root=new T.Group();root.name='Block 07 / approved southern intake campus';world.scene.add(root);const rows=[],stone=0x4b4b50,iron=0x303238,trim=0x7d7770,rust=0x8a4734,wood=0x7c5a3e;
 const b=(x,y,z,w,h,d,c,solid=false)=>{rows.push({x,y,z,w,h,d,c});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(lines,x,y,z,w=5,h=.8,a=0,color='#e7b575')=>world.sign(lines,x,y,z,w,h,a,root,color);
 const lamp=(x,y,z,power=35,reach=11,c=0xffc18a)=>{b(x,y+.1,z,.7,.2,.55,iron);const bulb=world.box(x,y,z,.44,.1,.32,c,false,root);bulb.material=new T.MeshBasicMaterial({color:c,toneMapped:false});bulb.userData.prisonBulb=true;const light=new T.PointLight(c,power,reach,2);light.position.set(x,y-.2,z);light.userData.workLight=true;root.add(light);};
 const guard=(x,z,angle=0)=>{const g=new T.Group();const cube=(w,h,d,y,c)=>{const m=new T.Mesh(world.geometry,world.mat(c));m.position.y=y;m.scale.set(w,h,d);g.add(m);};cube(.65,.95,.5,1.8,0x5d6967);cube(.48,.5,.48,2.54,0xb99573);cube(.65,.14,.6,2.86,iron);for(const dx of [-.13,.13]){const eye=new T.Mesh(world.geometry,world.mat(0x22262b));eye.scale.set(.055,.055,.025);eye.position.set(dx,2.58,.25);g.add(eye);}g.position.set(x,1,z);g.rotation.y=angle;root.add(g);return g;};
 world.floorMat=new T.MeshStandardMaterial({map:surfaceTexture('paving'),roughness:.97});world.skyLight=new T.HemisphereLight(0xc9d5e5,0x57504b,1.8);world.sun=new T.DirectionalLight(0xffdfaf,2);world.sun.position.set(-15,30,10);world.sun.castShadow=true;world.sun.shadow.autoUpdate=false;world.sun.shadow.needsUpdate=true;world.sun.shadow.mapSize.set(1024,1024);Object.assign(world.sun.shadow.camera,{left:-40,right:40,top:45,bottom:-35,near:1,far:100});world.sun.shadow.bias=-.001;world.sun.shadow.normalBias=.035;world.yardFill=new T.HemisphereLight(0xe8d3af,0x534b44,.4);world.scene.add(world.skyLight,world.sun,world.yardFill);
 // Continuous foundations and perimeter prevent the campus reading as floating test rooms.
 b(0,-.45,8,116,.9,126,0x5a5751);for(const x of [-55,55])b(x,6.5,8,1.2,13,124,stone,true);for(const z of [-54,70])b(0,6.5,z,111,13,1.2,stone,true);for(const x of [-54,54])for(const z of [-53,69]){b(x,8,z,4,16,4,stone);b(x,16.3,z,6,.5,6,iron);b(x,17.6,z,4,2.2,4,0x303238);b(x,18.9,z,6,.3,6,trim);}
 // SOUTH / a full intake building, screened from the working yard.
 b(0,.5,66,8,1,6,0x756e65);b(0,.5,51,14,1,28,0x756e65);b(0,.5,26.5,6,1,23,0x756e65);
 for(const x of [-7.25,7.25]){b(x,4,50,.5,6,26,stone,true);b(x,7.15,50,.8,.3,27,iron);}
 b(0,7.2,50,15,.35,26,iron,true);b(0,7.5,62.8,15,.5,.6,trim);
 for(const x of [-5,5])b(x,3.5,63,4,5,.5,stone,true);b(0,6.4,63,6,1,.7,iron,true);
 sign(['BLOCK 07 / INTAKE','SEARCH · REGISTER · REPORT FOR DUTY'],0,6.35,63.42,7,1);
 for(const x of [-3.2,3.2]){b(x,4,63,.4,6,.8,trim,true);b(x,1.3,63,.8,.6,1,iron,true);}
 for(const z of [61,58,53,49,44,39,32,24])lamp(0,6.2,z,32,10);
 // Search booth and property lockers, no weapon before issue.
 b(-4.7,2,57,3.8,2,1.5,iron,true);b(-4.7,3.12,57,4.1,.2,1.8,trim);guard(-4.7,57.8,0);
 sign(['01 / SEARCH','E / STAND ON THE MARKER'],0,4.8,55.8,5,.85);
 for(let z=56.1;z<=58.4;z+=.45)b(0,1.035,z,3.4,.025,.12,0xc49d60);
 for(const x of [3.6,5.2]){b(x,2.5,59,1.3,3,1,iron,true);sign(['PROPERTY'],x,3.3,59.55,1.1,.23);}
 // Registration hatch faces east into the centre aisle.
 b(-4.5,1.9,50,3,1.8,4,wood,true);b(-2.92,3,50,.2,.2,4.3,iron);b(-5.5,4.3,50,.2,2,4,iron);
 guard(-5.8,50,Math.PI/2);sign(['02 / RECORDS','E / REGISTER · CELL 07 ASSIGNED'],-6.95,5.6,50,6,1,Math.PI/2);
 b(-4.2,3.05,50,.65,.12,.65,0xd3bd91);for(const z of [48,52])b(-2.9,4.1,z,.12,2.3,.12,iron);b(-2.9,5.2,50,.12,.15,4.2,iron);
 // Tool cage: actual pickup model and barred storage behind the counter.
 b(4.5,1.7,43,3,1.4,4,wood,true);b(3,2.5,43,.2,.2,4.2,iron);for(let z=41.2;z<=44.8;z+=.4)b(6.8,3.4,z,.1,3.8,.08,trim);
 sign(['03 / TOOL ISSUE','E / COLLECT REGISTERED PICKAXE'],6.96,5.5,43,6,1,-Math.PI/2);
 const pick=createPickaxe(0);pick.scale.setScalar(.65);pick.position.set(3.8,3.4,43);pick.rotation.set(.05,Math.PI/2,-.7);root.add(pick);world.issuedPick=pick;
 for(const z of [42,43,44])b(5.8,3.2,z,.12,2,.12,wood);
 b(0,1.03,48,.12,.025,28,0xc5975b);
 // Three independently saved checkpoints. Passing a marker never grants items.
 world.intakeGates=[];for(const [z,stage]of [[55.5,1],[48,2],[40.3,3]]){const bars=new T.Group();bars.position.set(0,0,z);world.scene.add(bars);for(let x=-6.7;x<=6.7;x+=.5){const m=new T.Mesh(world.geometry,world.mat(iron));m.position.set(x,3,0);m.scale.set(.09,4,.16);bars.add(m);}for(const y of [1.05,4.95]){const m=new T.Mesh(world.geometry,world.mat(trim));m.position.y=y;m.scale.set(14,.14,.2);bars.add(m);}world.intakeGates.push({bars,stage,bounds:new T.Box3(new T.Vector3(-7,1,z-.2),new T.Vector3(7,5.2,z+.2))});}
 // Tall screened release passage. Its north threshold reveals all three landmarks.
 for(const x of [-3.25,3.25])b(x,4,26,.5,6,23,stone,true);b(0,7.2,26,7,.3,23,iron,true);
 sign(['REPORT TO ROLL CALL','DEEPWELL / NORTHWEST · CELLBLOCK A / SOUTHWEST'],0,5.7,37.65,6,.8);
 for(const x of [-3.5,3.5])b(x,4.5,16,.6,7,1,trim,true);b(0,8.2,16,8,.7,1,iron,true);
 sign(['BLOCK 07 / WORK YARD','CLEARANCE CONTROLS MOVEMENT'],0,8.15,16.6,7,.9);
 guard(5.5,17,0);b(5.5,1.6,17,2.2,1.2,2.2,stone,true);b(5.5,6,17,3,.3,3,iron);
 // Core circulation: the centre stays clear, with an inspection post off-axis.
 b(4,1.3,2,3.6,.6,3,stone,true);b(4,3.6,2,.3,4.6,.3,iron);b(4,6,2,4.4,.4,.5,iron);sign(['ROLL CALL / 07','REPORT. WORK. RETURN.'],4,5.1,2.3,4.3,.8);
 for(const z of [6,10])for(const x of [-3,3,9])b(x,1.03,z,2,.025,.09,0xbeb8a2);
 for(const [x,z]of [[-5,-2],[17,3],[-5,12],[9,12]]){b(x,3.7,z,.14,5.4,.14,iron,true);b(x,1.2,z,.55,.4,.55,stone,true);lamp(x,6.4,z,32,13);}
 for(const [a,c]of [[-20,-18],[-12,-3],[3,12],[18,20]])b((a+c)/2,4.8,16,c-a,7.6,.6,stone,true);
 for(const x of [-20,20])for(const [a,c]of [[-5,6],[10,16]])b(x,4.5,(a+c)/2,.6,7,c-a,stone,true);
 // SOUTHWEST / enclosed cellblock. Cell 07 is real and reachable from roll call.
 b(-16,.5,28,14,1,16,0x756e65);b(-15,.5,18,6,1,6,0x756e65);
 for(const x of [-23,-9])b(x,5.5,28,.6,9,16.6,stone,true);b(-16,5.5,36,14.6,9,.6,stone,true);b(-16,10.2,28,15,.35,17,iron,true);
 for(const [x,w]of [[-20.5,5],[-10.5,3]])b(x,5,20,w,8,.7,stone,true);b(-15,7.3,20,6,4,.7,stone,true);
 sign(['CELLBLOCK A','ASSIGNED CELLS / CURFEW ROSTER'],-15,7.25,19.56,6,1,Math.PI);
 relocate(world,buildCell,[-28,0,11]);
 // Deep neighbouring cells, barred fronts and an upper inspection gallery.
 for(const z of [23,28,33]){b(-21,2.8,z,3.2,3.6,.3,rust,true);b(-21,3.2,z-.2,1.7,1,.08,iron);for(let dx=-.6;dx<=.61;dx+=.3)b(-21+dx,3.2,z-.28,.06,1,.1,trim);}
 b(-10.5,5.4,28,2.7,.3,15,trim,true);for(const z of [22,25,28,31,34]){b(-12,6.1,z,.08,1.2,.08,iron);lamp(-10.4,9,z,22,9);}b(-12,6.7,28,.08,.08,14,iron);
 for(let n=0;n<9;n++){const h=(n+1)*.5;b(-10.4,1+h/2,22+n*.5,2,h,.5,iron,true);}b(-10.4,5.4,27,2.4,.3,1.5,trim,true);
 sign(['CELL 07  ↑','E / REST AT YOUR ASSIGNED BED'],-15.5,4.2,24.65,3.8,.7,Math.PI);
 // SOUTHEAST / staffed pay office and caged forge, not a free-standing shop stall.
 b(16,.5,28.5,14,1,11,0x756e65);b(15,.5,19.5,6,1,9,0x756e65);
 for(const x of [9,23])b(x,4,28.5,.6,6,11.5,stone,true);b(16,4,34,14.5,6,.6,stone,true);b(16,7.2,28.5,15,.35,12,iron,true);
 b(10.5,4,23,3,6,.6,stone,true);b(20.5,4,23,5,6,.6,stone,true);b(15,6.2,23,6,1.6,.8,iron,true);
 sign(['PAY OFFICE / FORGE','E / REPORT HAUL · LABOUR CREDITS'],15,6.1,22.55,7,1,Math.PI);
 b(15,1.9,31.5,7,1.8,1.4,wood,true);b(15,2.95,31.5,7.4,.2,1.7,iron);guard(15,32.5,Math.PI);sign(['ALL MATERIAL IS PRISON PROPERTY','PAYMENT BY REGISTERED WEIGHT'],15,4.8,33.62,9,.9,Math.PI);
 for(let z=25;z<=32;z+=.4)b(19.8,3.1,z,.08,4.2,.08,iron);b(21.5,1.8,28,2,1.6,2,stone,true);b(21.5,3,28,1.2,.8,.8,iron);b(21.5,6,32.6,1.1,10,1.1,stone,true);lamp(15,6.4,27,48,12);
 // NORTHWEST / industrial Deepwell, with a screened loading hall and headframe.
 for(const x of [-19.2,-1.1])b(x,1,-14.2,.5,12,18.2,stone,true);b(-10.15,1,-23.3,18.6,12,.6,stone,true);
 for(const [x,w]of [[-16.3,6.3],[-3.75,5.9]])b(x,4.2,-5.6,w,6.4,.6,stone,true);b(-10,7.1,-5.6,6.2,1.6,.9,iron,true);
 sign(['DEEPWELL / EXTRACTION DUTY','REGISTER TOOLS · REPORT YOUR HAUL'], -10,7,-5.1,9,1);
 for(const z of [-7,-12,-17,-22]){b(-10,7.9,z,19,.35,.35,iron);b(-10,8.6,z-1,19,.3,2.5,stone,true);lamp(-10,7,z,48,13);}
 for(const x of [-15,-5]){b(x,11.4,-8,.5,8,.5,iron);b(x,15.4,-8,1.2,.3,1.2,trim);}b(-10,14.6,-8,10.6,.4,.5,iron);b(-10,12.7,-8,.1,3.8,.1,iron);
 const wheel=new T.Mesh(new T.TorusGeometry(1,.15,4,12),world.mat(iron));wheel.position.set(-10,14.4,-8);root.add(wheel);
 sign(['PAY OFFICE / SOUTHEAST','HAUL IS WEIGHED BEFORE PAYMENT'],-16,3.7,-5.22,5,.8);
 b(-10,1.035,1,.12,.025,12,0xc99b5f);b(-5,1.035,7,10,.025,.12,0xc99b5f);
 // NORTHEAST / Timber Detail: controlled issue, a blind transfer passage, then daylight.
 buildTimberDetail(world,{root,b,sign,lamp,guard,stone,iron,trim,wood});
 // Secured side wings use independent floorplans and share no combat space with the yard.
 const corridor=(wing)=>{const floor=(x,z)=>wing.passages.some(r=>inBox(x,z,r)),edges=new Map();for(const r of wing.passages){b((r[0]+r[1])/2,.5,(r[2]+r[3])/2,r[1]-r[0],1,r[3]-r[2],0x756e65);b((r[0]+r[1])/2,6.2,(r[2]+r[3])/2,r[1]-r[0],.3,r[3]-r[2],iron,true);}
 for(let x=-50;x<52;x+=.5)for(let z=0;z<21;z+=.5)if(floor(x+.25,z+.25))for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const nx=x+.25+dx,nz=z+.25+dz;if(floor(nx,nz)||inBox(nx,nz,wing.bounds)||yardFloor(nx,nz))continue;const ex=x+.25+dx/2,ez=z+.25+dz/2,k=(dx?'x:':'z:')+(dx?ex:ez);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(dx?ez:ex);}
 for(const [key,values]of edges){const [axis,fixed]=key.split(':'),v=[...new Set(values)].sort((a,b)=>a-b);let start=v[0],last=start;const flush=()=>{const center=(start+last)/2,length=last-start+.5;b(axis==='x'?+fixed:center,3.6,axis==='x'?center:+fixed,axis==='x'?.2:length,5.2,axis==='x'?length:.2,stone,true);};for(const n of v.slice(1)){if(n-last>.51){flush();start=n;}last=n;}flush();}for(const p of wing.route.slice(1,-1))lamp(p[0],5.5,p[1],25,9);};
 world.trainingGates=[];const gate=(wing)=>{const [x,z]=wing.gate,axis=wing.axis,bars=new T.Group();bars.position.set(x,0,z);world.scene.add(bars);for(let n=-1.8;n<=1.81;n+=.45){const m=new T.Mesh(world.geometry,world.mat(iron));m.position.set(axis==='x'?0:n,3,axis==='x'?n:0);m.scale.set(axis==='x'?.18:.08,4,axis==='x'?.08:.18);bars.add(m);}const bounds=new T.Box3(new T.Vector3(x-(axis==='x'?.25:2),1,z-(axis==='x'?2:.25)),new T.Vector3(x+(axis==='x'?.25:2),5.2,z+(axis==='x'?2:.25)));const beacon=world.box(x+(axis==='x'?-Math.sign(x)*.4:1.8),4.4,z+(axis==='x'?1.7:0),.2,.3,.2,0xe4a065,false,root);beacon.material=world.mat(0xe4a065,.4).clone();world.trainingGates.push({wing,bars,bounds,beacon,lift:0,open:false});};
 for(const wing of LABOUR_WINGS){corridor(wing);gate(wing);const [x,z]=wing.gate;sign([wing.name,'CLEARANCE '+wing.level+' / CONTROLLED WEAPON ISSUE'],x-Math.sign(x)*.45,6.5,z,7,1,x<0?Math.PI/2:-Math.PI/2);}
 // West containment court and east outward-facing bow range remain functional.
 buildContainmentDetail(world,{root,b,sign,lamp,guard,stone,iron,trim,rust});
 b(41,.5,10.5,19,1,12,0x85745f);for(const z of [4.75,16.25]){b(41,4,z,19.5,6,.5,stone,true);b(41,2.4,z+(z<10?.3:-.3),18,2.6,.08,wood);b(41,6.1,z,19.5,1.1,.15,0x82918e);}b(50.5,4,10.5,.6,6,12,stone,true);for(const [z,d]of [[6.5,3],[14.5,3]])b(31.75,4,z,.5,6,d,stone,true);b(41,7.2,10.5,20,.3,12,iron,true);
 for(const z of [7.3,10.5,13.7]){b(48.5,3,z,.3,4,2.7,wood,true);b(46.7,1.6,z,.5,1.2,.5,wood);b(46.7,2.5,z,.15,2.3,2.4,wood);b(41.5,1.035,z,10,.025,2.4,0x9b896b);for(const dz of [-1.25,1.25])b(41.5,1.05,z+dz,10,.02,.07,0xc2a571);}for(const x of [35,40,46])lamp(x,6.6,10.5,80,15);sign(['BOW QUALIFICATION','SUPERVISED ISSUE / RETURN EVERY WEAPON'],41,5.5,15.95,11,1,Math.PI);
 // North watch / sealed service stair replaces the old western dungeon door.
 b(1.1,.5,-17.5,3.4,1,25,0x756e65);for(const x of [-.9,3.1])b(x,3.5,-17.5,.5,5,25,stone,true);b(1.1,6.3,-17.5,4.5,.3,25,iron,true);
 relocate(world,buildUnderblockEntry,[8,0,-10],-Math.PI/2);gate({key:'dungeon',gate:[1.1,-8],axis:'z'});sign(['OLD WATCH / UNDERBLOCK','WARDEN CLEARANCE REQUIRED'],1.1,5.8,-6.7,4,.8);for(const z of [-10,-18,-27])lamp(1.1,5.7,z,25,8);
 for(const x of [-2,4.2])b(x,9,-22,1,16,1,stone,true);b(1.1,17.3,-22,8,.5,7,iron);sign(['OLD WATCH'],1.1,14.8,-18.4,6,.8);
 // Texture-aware static batches and a bounded ambient dust pool.
 const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:.98}),rows.length),matrix=new T.Matrix4(),q=new T.Quaternion(),p=new T.Vector3(),s=new T.Vector3();rows.forEach((r,i)=>{matrix.compose(p.set(r.x,r.y,r.z),q,s.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.c));});mesh.name='Strict prison / batched structure';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);world.strictPrison=root;
 world.motes=new T.InstancedMesh(new T.BoxGeometry(.023,.023,.023),new T.MeshBasicMaterial({color:0xe4cfa8,transparent:true,opacity:.35}),32);world.scene.add(world.motes);world.matrix=new T.Matrix4();
}

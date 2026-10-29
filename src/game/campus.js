import {surfaceTexture} from '../engine/surface-textures.js?v=82.3';
import * as T from '../../vendor/three.module.js';
import {createPickaxe} from '../engine/pickaxe.js?v=82.3';
// A replacement campus, not the old test-yard facade. Working seams retain
// their coordinates so saved gear and plot stages need no migration.
function kit(world,name){const root=new T.Group();root.name=name;world.scene.add(root);const rows=[];
 const b=(x,y,z,w,h,d,color,solid=false)=>{rows.push({x,y,z,w,h,d,color});if(solid)world.blockers.push(new T.Box3(new T.Vector3(x-w/2,y-h/2,z-d/2),new T.Vector3(x+w/2,y+h/2,z+d/2)));};
 const sign=(lines,x,y,z,w=5,h=.9,a=0,c='#efb55e')=>world.sign(lines,x,y,z,w,h,a,root,c);
 const lamp=(x,y,z,color=0xffc185,power=35,reach=11)=>{b(x,y+.12,z,.7,.24,.55,0x303238);const bulb=world.box(x,y,z,.44,.12,.32,color,false,root);bulb.material=new T.MeshBasicMaterial({color,toneMapped:false});bulb.userData.prisonBulb=true;const light=new T.PointLight(color,power,reach,2);light.position.set(x,y-.2,z);light.userData.workLight=true;root.add(light);};
 const finish=()=>{const mesh=new T.InstancedMesh(world.geometry,new T.MeshStandardMaterial({roughness:.98}),rows.length),matrix=new T.Matrix4(),q=new T.Quaternion(),p=new T.Vector3(),s=new T.Vector3();rows.forEach((r,i)=>{matrix.compose(p.set(r.x,r.y,r.z),q,s.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});mesh.name=name+' / batched masonry';mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);return root;};return {root,b,sign,lamp,finish};}
export function buildCampus(world){world.floorMat=new T.MeshStandardMaterial({map:surfaceTexture('paving'),roughness:.96});
 const {root,b,sign,lamp,finish}=kit(world,'Blackstone Penitentiary / intake and working campus'),stone=0x4b4b50,iron=0x303238,trim=0x77726c,rust=0x884634,timber=0x806044;
 world.skyLight=new T.HemisphereLight(0xdce1ef,0x57504a,1.9);world.sun=new T.DirectionalLight(0xffe0b2,2);world.sun.position.set(-16,30,10);world.sun.castShadow=true;world.sun.shadow.autoUpdate=false;world.sun.shadow.needsUpdate=true;world.sun.shadow.mapSize.set(1024,1024);Object.assign(world.sun.shadow.camera,{left:-42,right:42,top:38,bottom:-35,near:1,far:100});world.sun.shadow.bias=-.001;world.sun.shadow.normalBias=.04;world.scene.add(world.skyLight,world.sun);world.yardFill=new T.HemisphereLight(0xe7d3b5,0x554b44,.4);world.scene.add(world.yardFill);
 // Intake has an outdoor arrival apron, a Records room and tool-issue bay.
 b(-53,.5,-10,10,1,8,0x746e67);b(-40,.5,-10,22,1,8,0x77726c);b(-30,.5,-6,6,1,16,0x77726c);b(-25,.5,-.5,10,1,5,0x77726c);
 b(-43,4,-14.25,30.5,6,.5,stone,true);b(-45.75,4,-5.75,24.5,6,.5,stone,true);
 b(-58.25,4,-10,.5,6,9,stone,true);b(-28.75,4,-10,.5,6,8.5,stone,true);
 // The lower south wall opens at the tool bay into the exit corridor.
 // Remove the corresponding overlapping masonry by splitting it at construction.
  b(-42.5,7.1,-10,23,.35,9,iron,true);
 // Exit corridor turns south, then east; keep these actual doorways open.
 b(-33.25,3.5,-2,.5,5,8,stone,true);b(-27.25,3.5,-4,.5,5,4,stone,true);b(-23.5,3.5,2.25,20,5,.5,stone,true);
 b(-30,6.2,-2,6.5,.3,8.5,iron,true);b(-24,6.2,-.5,12,.3,5.5,iron,true);
 for(const x of [-57,-51]){b(x,5,-14.6,1.4,8,1.4,stone,true);b(x,9.2,-14.6,2.4,.35,2.4,trim);}
 b(-54,8.9,-14.6,5.5,1,.5,iron);sign(['VOXEL / BLACKSTONE','INTAKE · EVERY BLOCK IS A WAY FORWARD'],-54,6.4,-14.30,6,1.4);
 // A guard booth faces the incoming player. The queue line is unobstructed.
 b(-46,1.9,-12.5,4,1.8,1.3,timber,true);b(-46,2.88,-12.5,4.4,.16,1.5,iron);
 for(const x of [-48.2,-43.8])b(x,4.1,-12.5,.15,2.4,.2,iron);b(-46,5.4,-12.5,4.6,.18,.3,iron);
 const glass=new T.Mesh(new T.BoxGeometry(4,.95,.04),new T.MeshStandardMaterial({color:0xa7b5b6,transparent:true,opacity:.17,depthWrite:false}));glass.position.set(-46,4.45,-12.46);root.add(glass);
 b(-46,3.25,-13.15,.75,.95,.5,0x5e6b69);b(-46,4,-13.15,.55,.55,.55,0xb18c66);b(-46,4.32,-13.15,.7,.14,.65,iron);
 for(const x of [-46.13,-45.87])b(x,4.04,-12.86,.06,.06,.03,0x22252a);
 b(-47.1,3.03,-12.3,.5,.12,.5,0xd7c7a2);b(-46.75,3.04,-12.3,.12,.14,.18,iron);
 sign(['01 / RECORDS','E / CHECK IN · CELL 07 ASSIGNMENT'],-46,5.9,-12.2,5,.85);
 // Numbered lockers, a bench and your actual issued pickaxe.
 for(let i=0;i<5;i++){b(-39+i*1.8,2.6,-13.9,1.5,3.2,.35,iron,true);b(-39+i*1.8,3.25,-13.68,1.2,.08,.05,trim);sign([String(7+i).padStart(2,'0')],-39+i*1.8,3.7,-13.68,.65,.25);}
 b(-35,1.7,-11.9,3.4,1.4,1,timber,true);b(-35,2.5,-11.9,3.7,.18,1.3,iron);
 const pick=createPickaxe(0);pick.scale.setScalar(.6);pick.position.set(-35,3.4,-11.7);pick.rotation.set(.05,0,-.75);root.add(pick);world.issuedPick=pick;
 sign(['02 / TOOL ISSUE','E / COLLECT WORN IRON PICKAXE'],-35,5.8,-12.2,5,.85);
 for(const x of [-53,-50]){b(x,1.55,-6.5,2,.18,.7,timber,true);for(const dx of [-.7,.7])b(x+dx,1.25,-6.5,.12,.5,.5,iron);}
 for(const [x,z]of [[-53,-10],[-46,-10],[-37,-10],[-30,-9],[-30,-1],[-23,-.5]])lamp(x,5.7,z);
 b(-43,1.03,-10,23,.025,.12,0xc3995d);b(-30,1.03,-6,.12,.025,8,0xc3995d);b(-25,1.03,-.5,10,.025,.12,0xc3995d);
 sign(['WORK BLOCK  →','YOUR FIRST SHIFT STARTS IN DEEPWELL'],-30,3.8,-3.78,4.5,.9,Math.PI);
 sign(['←  DEEPWELL','EXCHANGE / CELLBLOCK  →'],-20.1,4,-.5,4,.9,-Math.PI/2);
 world.intakeGates=[];for(const [x,z,axis,stage,width]of [[-41.5,-10,'x',1,8],[-30,-5.4,'z',2,6]]){const bars=new T.Group();bars.position.set(x,0,z);world.scene.add(bars);for(let n=-width/2+.2;n<width/2;n+=.5){const m=new T.Mesh(world.geometry,world.mat(iron));m.position.set(axis==='x'?0:n,3,axis==='x'?n:0);m.scale.set(axis==='x'?.16:.08,4,axis==='x'?.08:.16);bars.add(m);}for(const y of [1.05,4.95]){const m=new T.Mesh(world.geometry,world.mat(trim));m.position.y=y;m.scale.set(axis==='x'?.2:width,.12,axis==='x'?width:.2);bars.add(m);}const bounds=new T.Box3(new T.Vector3(x-(axis==='x'?.2:width/2),1,z-(axis==='x'?width/2:.2)),new T.Vector3(x+(axis==='x'?.2:width/2),5.1,z+(axis==='x'?width/2:.2)));world.intakeGates.push({bars,bounds,stage});}
 // The yard is an industrial court framed by distinct buildings, not a wall box.
 for(const x of [-20,20]){if(x<0){b(x,5,-13.5,.6,8,21,stone,true);b(x,5,3.75,.6,8,3.5,stone,true);b(x,8,-.5,.8,2,5,stone,true);b(x,5,13.5,.6,8,5,stone,true);}else{b(x,5,-18,.7,8,12,stone,true);b(x,5,-1.25,.7,8,13.5,stone,true);b(x,5,13,.7,8,5,stone,true);}}
 b(0,5,-24,41,8,.7,stone,true);
 // A tall sawtooth-roof mine building and exposed headframe silhouette.
 for(const x of [-19.2,-1.1])b(x,1,-14.2,.5,12,18,stone,true);b(-10.15,1,-23.2,18.6,12,.5,stone,true);
 for(const z of [-7,-12,-17,-22]){b(-10,7.6,z,19,.35,.35,iron);b(-10,8.3,z-1,19,.25,2.4,stone,true);b(-10,8.9,z+.55,19,.18,.18,trim);lamp(-10,6.9,z,0xffcf91,48,13);}
 for(const x of [-19,-1])b(x,4.5,-5.6,.7,7,.9,trim,true);
 b(-10,6.3,-5.7,18,1.5,.8,stone,true);sign(['DEEPWELL / WORKS 01','EXCAVATION · FIRST SHIFT REPORT HERE'],-10,6.2,-5.22,10,1);
 for(const x of [-15,-5]){b(x,11,-8,.5,8,.5,iron);b(x,14.8,-8,1.3,.3,1.3,trim);}b(-10,14.2,-8,10.5,.4,.5,iron);b(-10,12,-8,.15,4,.15,iron);
 const wheel=new T.Mesh(new T.TorusGeometry(1,.16,4,12),world.mat(iron));wheel.position.set(-10,13.8,-8);root.add(wheel);
 b(-10,1.04,1,.13,.03,12,0xd5984d);b(-5,1.04,6,10,.03,.13,0xd5984d);
 // Receiving house replaces the two floating shop stalls.
 b(-13,2.3,7,9,2.6,3,stone,true);for(const x of [-17.4,-8.6])b(x,4.6,7,.25,2,.3,iron);b(-13,5.6,7,10,.3,4,iron,true);
 sign(['WORKERS’ EXCHANGE','E / SELL HAUL · TOOLS · EXPANSIONS'],-13,4.6,8.57,8.5,1.1);
 b(-13,3.7,7.05,7,1.1,.1,0x26282b);b(-13,3.2,8.7,8,.15,.65,timber);
 // A forge chimney and freight loading dock establish the industrial west edge.
 b(-18,4,1,1.6,6,1.6,stone,true);b(-18,7.2,1,2,.3,2,iron);b(-17,1.6,4,3,1.2,1.8,timber,true);
 for(const x of [-17.8,-16.7])b(x,2.35,4,.8,.3,1.4,0x80674b);
 lamp(-13,5.15,8.9,0xffbd76,50,12);
 // Central roll-call plinth and an open offset route around it.
 b(4,1.35,4,3.8,.7,3,stone,true);b(4,3.8,4,.35,4.5,.35,iron);b(4,6.1,4,4.8,.5,.4,iron);
 sign(['BLACKSTONE / 07','YOUR SHIFT. YOUR PACE.'],4,5.2,4.25,4.6,.9);lamp(4,6.5,4,0xffbd76,45,16);
 for(const z of [1,7]){b(7,1.5,z,2.5,.2,.7,timber,true);for(const x of [6.2,7.8])b(x,1.25,z,.12,.5,.5,iron);}
 for(const [x,z,w,d]of [[-3,10,4,.1],[9,8,.1,12],[0,12,2,.1]])b(x,1.03,z,w,.025,d,0xc5bfa8);
 // East residential block: an enclosed gallery, deep cells and a lit stair tower.
 b(13,5.5,20.3,6,9,.5,stone,true);b(18,8,20.3,4,4,.5,stone,true);b(15.2,5.5,29.8,10.5,9,.5,stone,true);b(20,5.5,22.5,.6,9,15,stone,true);
 b(15.2,10.2,22.3,10.8,.35,15.6,iron,true);b(18,5.4,22.4,3,.3,14.5,trim,true);
 for(const x of [10.6,19.6])for(const z of [15,20,25,29]){b(x,5.4,z,.35,9,.45,trim);b(x,10.4,z,.8,.3,1,iron);}
 for(const z of [21.8,25.7]){b(13.2,2.8,z,5,3.6,.35,stone,true);b(13.2,2.8,z+3.6,5,3.6,.35,stone,true);b(10.7,2.8,z+1.8,.35,3.6,3.6,stone,true);b(15.7,2.8,z+1.8,.3,3.6,3.6,rust,true);sign(['CELL '+(z<24?'08':'09')],15.88,4,z+1.8,2.1,.4,Math.PI/2);}
 for(const z of [16.5,23.6,27.6]){b(16.5,7.6,z,.15,2.8,3,rust);for(let dz=-1;dz<=1;dz+=.5)b(16.64,7.8,z+dz,.1,1.4,.08,iron);lamp(18.1,9,z,0xffc185,25,9);}
 for(const z of [15.5,19.5,23.5,27.5]){b(16.45,6.05,z,.08,1.2,.08,iron);b(16.45,6.65,z,.08,.08,4,iron);}
 for(let n=0;n<9;n++){const h=(n+1)*.5;b(18,1+h/2,10+n*.5,2,h,.5,iron,true);}
 b(18,5.4,14.6,2.5,.3,1.5,trim,true);
 sign(['CELLBLOCK / EAST','CELL 07 · YOUR ROOM IS ON THE GROUND FLOOR'],14,10,13.9,10,1.3,Math.PI);
 for(const x of [11,15.7,19.6])b(x,5.4,13.9,.4,9,.5,trim,true);
 // Closed neighboring cells give the residential frontage depth and scale.
 for(const [i,x]of [4.5,8.2].entries()){b(x,2.8,15.45,2.6,3.6,.22,rust);b(x,3.25,15.29,1.4,.95,.07,iron);for(let dx=-.5;dx<=.51;dx+=.25)b(x+dx,3.25,15.19,.06,.95,.08,trim);b(x+.85,2.2,15.23,.14,.25,.1,trim);sign(['CELL 0'+(5+i)],x,5,15.41,2.3,.45,Math.PI);lamp(x,5.8,15.3,0xffc185,25,8);}
 // South security facade frames the containment door, not another cell wall.
 for(const x of [-8,7])b(x,4,15.9,10,6,.7,stone,true);b(0,7.2,16,5,2,.8,iron,true);sign(['03 / CONTAINMENT','PRISON LEVEL 3 · 60 BLOCKS'],0,7.2,15.55,5,1,Math.PI);
 b(-14,4.2,15.9,12,6.4,.7,stone,true);sign(['SHIFT OFFICE / 07','WORK EARNS PRIVILEGES'],-13,4.4,15.51,8,1,Math.PI);
 // East armoury has a high, asymmetric front, visible from the central yard.
 b(20,5,4.3,.8,8,2.6,stone,true);b(20,5,12.6,.8,8,4.2,stone,true);b(20,8,8,1,2,6,iron,true);sign(['04 / PRISON ARMOURY','ARCHERY · PRISON LEVEL 4'],19.51,7.8,8,6,1,-Math.PI/2);
 // Night wayfinding and distinct building lamps; the renderer budgets nearby lights.
 for(const [x,z]of [[-4,-2],[17,3],[-4,12],[9,11]]){b(x,3.8,z,.14,5.6,.14,iron,true);b(x,1.2,z,.6,.4,.6,stone,true);lamp(x,6.4,z,0xffbf80,35,13);}
 world.campusRoot=finish();
}
export function buildCampusTraining(world){
 const {b,sign,lamp,finish}=kit(world,'Blackstone / containment court and armoury hall'),iron=0x303238,stone=0x4a494e,rust=0x884634,wood=0x806044;
 // Combat is an open-roof containment court surrounded by real holding bays
 // and an overhead inspection gallery. Nothing obstructs pursuit on the floor.
 b(6,.5,40,18,1,16,0x77706a);
 for(const x of [-3,15]){b(x,4.5,40,.7,7,16.7,stone,true);b(x,7.7,40,2.3,.35,17,iron,true);for(const z of [33,37,41,45,48])b(x,6,z,.35,10,.4,iron,true);for(const y of [8.3,9.1])b(x+(x<6?.9:-.9),y,40,.1,.1,17,iron);}
 b(6,4.5,47.6,18.7,7,.7,stone,true);b(6,9.8,47.6,19,1,.8,iron);
 for(const x of [0,6,12]){b(x,3,47.18,4.7,4,.16,rust);for(let dx=-1.8;dx<=1.81;dx+=.45)b(x+dx,3.5,47.03,.09,2.4,.12,iron);sign(['HOLD '+(x/6+1)],x,5.8,47.1,3,.5,Math.PI);}
 for(const z of [35.2,40.2,45.2]){for(const x of [-2.55,14.55]){b(x,3,z,.08,2.2,2.8,0x292b2f);for(let dz=-1;dz<=1;dz+=.5)b(x+(x<6?.1:-.1),3,z+dz,.1,2.2,.06,0x7e7670);}b(6,10.5,z,19,.25,.25,iron);}
 for(const x of [-1,13])for(const z of [35,40,45]){b(x,1.03,z,.08,.025,3,0xaa8b6d);lamp(x,6.9,z,0xffa968,40,12);}
 sign(['CONTAINMENT DETAIL','CONTAINMENT COURT / WALK OUT TO BANK'],6,8.7,47.17,12,1.2,Math.PI,'#e9a480');
 // Armoury entry is a lower equipment vestibule, followed by a tall timber
 // range with a raised clerestory and target lighting, not the old flat box.
 b(41.5,.5,27,19,1,12,0x827969);
 for(const z of [21,33]){b(41.5,3.8,z,20,5.6,.6,stone,true);b(41.5,7,z,20,1,.6,iron);b(41.5,5.9,z,20,1.3,.12,0x93a5a4);for(const x of [33,36,39,42,45,48,51])b(x,5.9,z,.12,1.4,.4,iron);}
 for(const z of [21.36,32.64]){b(43,2.4,z,14,2.8,.08,wood);for(let x=36.5;x<50.5;x+=.7)b(x,2.4,z+(z<27?.05:-.05),.035,2.8,.05,0x4d4137);b(43,3.9,z,14,.16,.18,iron);}
 b(51,4.5,27,.7,7,12.7,stone,true);b(41.5,8.1,27,20,.3,12.5,iron,true);
 b(35,5.6,27,6,.25,12,wood,true);for(const z of [23,31]){b(35.1,2.5,z,4.4,3,.45,wood,true);for(let i=0;i<5;i++){b(33.5+i*.8,2.8,z+(z<27?.3:-.3),.08,2,.12,0xd0b283);b(33.5+i*.8,3.4,z+(z<27?.3:-.3),.45,.08,.12,iron);}}
 sign(['EQUIPMENT ISSUE','ARROWS SUPPLIED / ENTER THE FIRING HALL'],35.5,4.7,21.4,5.5,.8);
 for(const z of [23.8,27,30.2]){b(48.7,3.2,z,.3,4.4,2.8,wood,true);b(47.2,1.6,z,.5,1.2,.5,wood);b(47.2,2.5,z,.15,2.3,2.4,wood);b(42.1,1.03,z,10,.03,2.5,0x98896b);for(const dz of [-1.3,1.3])b(42.1,1.05,z+dz,10,.025,.07,0xd5b580);sign(['LANE '+(Math.round((z-23.8)/3.2)+1)],48.48,5.1,z,2.3,.5,-Math.PI/2);}
 for(const x of [38,42,46,50])b(x,7.7,27,.25,.4,12,wood);
 for(const [x,z]of [[35,27],[40,27],[46,27]])lamp(x,7.2,z,0xffd6a0,95,16);
 const targetLight=new T.SpotLight(0xffd8a3,120,12,1.05,.7,2);targetLight.position.set(44,6.4,27);targetLight.target.position.set(47,2.5,27);targetLight.userData.workLight=true;world.scene.add(targetLight,targetLight.target);
 sign(['BOW RANGE','HOLD / DRAW · RELEASE / FIRE'],40.5,7.1,32.64,10,1,Math.PI,'#efd296');
 world.campusTraining=finish();
}

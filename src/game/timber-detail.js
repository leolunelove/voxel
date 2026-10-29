import * as T from '../../vendor/three.module.js';
// Static architecture only. Tree yields, unlocks and regrowth remain in camp rules.
export function buildTimberDetail(world,{root,b,sign,lamp,guard,stone,iron,trim,wood}){
 root.name='Block 07 / Timber Detail labour campus';
 const floor=(x,z,w,d,c=0x756d5d)=>b(x,.5,z,w,1,d,c);
 floor(8,-8.5,4,7);floor(18,-10,24,4);floor(30.5,-22.5,19,21);
 // A tall works facade reads from roll call, with an offset watch booth.
 for(const [x,w]of [[4.4,2.9],[15,10]])b(x,5,-5.6,w,8,.7,stone,true);
 b(8,7.1,-5.6,4.5,2.2,1,iron,true);b(11.8,9.6,-7,4.4,2,4,stone);b(11.8,10.8,-7,5.2,.4,4.8,iron);
 sign(['02 / TIMBER DETAIL','LEVEL 2 / COMPULSORY LABOUR'],8,7,-5.12,7,1.1);
 sign(['20 BLOCKS / CLEARANCE 2','E / CHECK WORK ORDER'],8,3.5,-5.05,3.5,.65);
 // Real sightline break: low, enclosed and twice turned, with a caged issue hatch.
 b(5.75,3.4,-8.5,.5,4.8,7.5,stone,true);b(10.25,3.4,-6.5,.5,4.8,3,stone,true);
 b(20.1,3.4,-7.75,20.2,4.8,.5,stone,true);b(13.5,3.4,-12.25,15.5,4.8,.5,stone,true);b(30.25,3.4,-10,.5,4.8,4.5,stone,true);
 b(8,5.9,-8.7,4.5,.3,7.1,iron,true);b(18,5.9,-10,24,.3,4.5,iron,true);
 for(const [x,z]of [[8,-7],[13,-10],[21,-10],[28,-12]])lamp(x,5.3,z,34,8);
 for(const x of [12,17,22,27]){b(x,5.55,-10,.16,.25,4,trim);b(x,1.035,-10,1.4,.03,.12,0xc59958);}
 b(18,1.05,-8.35,22,.04,.1,0xc59958);b(8,1.05,-7,.12,.03,4,0xc59958);
 sign(['TOOL CONTROL →','IRON HATCHET / REGISTERED ISSUE'],8,3.8,-11.94,3.5,.8);
 sign(['NO LOITERING / KEEP MOVING'],16,3.9,-7.99,5,.5,Math.PI);
 // Hatch is recessed behind the passage wall; bars and tools stay outside the walk lane.
 b(18,2.4,-7.95,3.7,1.2,.24,wood);for(let x=16.3;x<19.8;x+=.4)b(x,3.8,-7.98,.07,1.5,.14,iron);
 b(18,4.6,-7.98,3.8,.12,.16,iron);sign(['ISSUE 02 / ALL TOOLS RETURNED'],18,5,-8.03,4.5,.45,Math.PI);
 sign(['← CUTTING YARD','STAY WITHIN YOUR ALLOCATION'],29.94,3.8,-10,3.5,.9,-Math.PI/2);
 // Daylit threshold is narrow; the compound opens laterally after the last turn.
 for(const x of [25.8,30.2])b(x,4.4,-13,.35,6.8,.5,iron,true);
 b(28,7.7,-13,5.1,.4,.7,iron);sign(['TIMBER DETAIL / FELLING COURT'],28,7.2,-12.65,7,.65);
 for(const x of [20.75,40.25])b(x,5.5,-22.5,.5,9,21.5,stone,true);b(30.5,5.5,-33.25,20,9,.5,stone,true);
 // The south wall closes the yard except for the arrival mouth.
 b(23.3,4.5,-12.25,4.6,7,.5,stone,true);b(35.3,4.5,-12.25,9.6,7,.5,stone,true);
 // West inspection gallery, higher than the cutting plots; no prop blocks a trunk approach.
 b(21.65,7.6,-22.5,1.25,.3,21,iron,true);
 for(const z of [-15,-20,-25,-30,-32]){b(22.3,8.3,z,.08,1.2,.08,iron);b(21.3,4.3,z,.22,6.4,.22,iron);lamp(21.55,9,z,36,12);}
 b(22.3,8.9,-22.5,.08,.08,21,iron);b(21.8,9.25,-22.5,2,.18,22,trim);
 guard(21.65,-25,Math.PI/2).position.y=7.75; // Silhouette overlooking assigned plots.
 // Timber-processing shed at the east wall: cantilever roof, bundled beams and weigh cradle.
 b(39,5.4,-23,2,.25,18,iron);for(const z of [-15,-22,-31])b(39.8,3.2,z,.2,4.4,.2,trim,true);
 for(const z of [-17,-22,-28]){b(39.1,1.45,z,.8,.9,3,wood,true);for(const dz of [-.85,0,.85]){b(39.1,2.05,z+dz,.75,.32,.7,wood);b(38.68,2.05,z+dz,.035,.24,.5,0xc6a16d);}b(39.1,2.4,z,1,.1,3.2,iron);}
 sign(['OUTPUT / MINE SUPPORT TIMBER','PRISON PROPERTY · WEIGH EVERY LOAD'],39.92,4.1,-23,9,1,-Math.PI/2);
 sign(['BLOCK 07 / LABOUR COMPOUND 02','CUT. STACK. REPORT.'],31,8.7,-32.94,14,1.2);
 sign(['01 / ASSIGNED PLOT','CHOP EACH LOG · RETURN TO PAY OFFICE'],28,4.7,-32.94,7,.9);
 // Sawn plank thresholds and drainage strips mark circulation, without replacing live plots.
 for(const z of [-15,-19,-23,-27,-31])b(23,1.025,z,1.2,.03,.2,iron);
 for(const x of [24,28,32,36])b(x,1.035,-31.7,2.5,.025,.12,0xc49b61);
 world.gate=new T.Group();world.gate.name='Timber Detail / level 2 portcullis';world.gate.position.set(8,0,-5.3);world.scene.add(world.gate);
 for(let x=-2;x<=2;x+=.4){const m=new T.Mesh(world.geometry,world.mat(iron));m.position.set(x,3,0);m.scale.set(.12,4,.18);world.gate.add(m);}
 for(const y of [1.1,3,4.9]){const m=new T.Mesh(world.geometry,world.mat(trim));m.position.set(0,y,0);m.scale.set(4.2,.14,.22);world.gate.add(m);}world.gateLift=0;
}

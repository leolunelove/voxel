import * as T from '../../vendor/three.module.js';
// Cell 07 occupies the eastern ground-floor cell beneath the existing gallery.
export const CELL_WAKE=[12.4,2.65,16.2];
export const insideCell=(x,z)=>x>10.8&&x<15.2&&z>14.2&&z<19.5;
export const atBed=p=>p.x>11.3&&p.x<14.8&&p.z>15.8&&p.z<19.1;
export function buildCell(world){
 const b=(...a)=>world.box(...a),stone=0x535156,iron=0x303238;
 b(13,.5,17.25,4.4,1,4.5,stone);
 for(const x of [10.8,15.2])b(x,2.8,17,.25,3.6,5,stone,true);
 b(13,2.8,19.5,4.6,3.6,.25,stone,true);
 // The doorway sits in the same facade plane as the neighboring closed cells.
 for(const x of [11.3,14.7])b(x,2.8,14.5,1,3.6,.25,stone,true);
 b(13,4.55,17,4.6,.28,5,iron,true);
 // A fixed open rust-red door leaves the threshold entirely clear.
 b(14.25,2.65,15.25,.12,3.3,1.6,0x913e29,true);
 for(let z=14.7;z<15.9;z+=.25)b(14.17,3.1,z,.06,.7,.055,iron);
 b(14.1,1.35,17.75,1.25,.6,2.4,iron,true);
 b(14.1,1.76,17.75,1.2,.22,2.3,0xa9a18d);
 b(14.1,1.94,17,1.1,.15,.55,0xdbcfaf);
 b(14.1,1.92,18.3,1.25,.12,1.2,0x914731);
 b(11.25,1.65,18.1,.65,1.3,.9,0x72543b,true);
 b(11.25,2.32,18.1,.43,.05,.45,0xd5bd8d);
 b(13,3.2,19.34,1.5,1,.07,0x20252a);
 for(let x=12.4;x<13.7;x+=.3)b(x,3.2,19.25,.06,1,.1,iron);
 const light=new T.PointLight(0xffbc70,15,7);light.userData.alwaysOn=true;light.position.set(12.6,3.85,16.5);world.scene.add(light);
 const bulb=b(12.6,4.2,16.5,.5,.12,.5,0xffba55);bulb.material=new T.MeshBasicMaterial({color:0xffba55,toneMapped:false});
 world.sign(['CELL 07','YOUR CELL / E BY THE BED'],13,3.95,14.30,2.6,.65,Math.PI);
 world.sign(['YOUR SHIFT. YOUR PACE.'],12.8,3.6,19.3,2.8,.5,Math.PI);
}

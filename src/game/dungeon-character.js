import * as T from '../../vendor/three.module.js';

export const ROOM_MOODS={
 Intake:{stone:0x687266,trim:0xb1a58a,light:0xe1c594,fog:0x303d35,ambient:1.05,subtitle:'RECEIVING / NO RECORD OF RELEASE'},
 Cellblock:{stone:0x56636a,trim:0x929c95,light:0xaac4cc,fog:0x26363c,ambient:.95,subtitle:'DETENTION / ALL CELLS SEALED'},
 'Overgrown cistern':{stone:0x4d6857,trim:0x8b9978,light:0xa8c9a3,fog:0x293f37,ambient:.95,subtitle:'WATERWORKS / DO NOT DRINK'},
 'Ember forge':{stone:0x6c594c,trim:0xaa9170,light:0xe0b182,fog:0x3e332d,ambient:1,subtitle:'PENAL FOUNDRY / SHIFT NEVER ENDED'},
 'Warden vault':{stone:0x505c59,trim:0xb2a078,light:0xc5c8ad,fog:0x293533,ambient:1,subtitle:'THE UNDERWARDEN / FINAL SEAL'}
};

for(const mood of Object.values(ROOM_MOODS))mood.fogColor=new T.Color(mood.fog);

export function dressDungeon(dungeon){
 const root=new T.Group();root.name='Underblock / prison architecture';dungeon.root.add(root);
 const rows=[],geometry=new T.BoxGeometry(1,1,1),material=new T.MeshStandardMaterial({roughness:1}),iron=0x2d3c36;
 const b=(x,y,z,w,h,d,color)=>rows.push({x,y,z,w,h,d,color});
 const glow=(x,y,z,w,h,d,color)=>{const m=new T.Mesh(geometry,new T.MeshBasicMaterial({color}));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;};
 const label=(lines,x,y,z,w,h,nx,nz)=>{
  if(typeof document==='undefined')return;
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#24362e';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#b9aa88';ctx.fillRect(0,0,12,256);
  lines.forEach((text,i)=>{let size=i?42:90;ctx.font='bold '+size+'px monospace';while(ctx.measureText(text).width>945&&size>16){ctx.font='bold '+(--size)+'px monospace';}ctx.fillStyle=i?'#afb8a5':'#e0ceb0';ctx.fillText(text,36,i?204:113);});
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}));m.position.set(x,y,z);m.rotation.y=Math.atan2(nx,nz);root.add(m);
 };
 dungeon.roomArchitecture=[];
 for(const [index,r]of dungeon.rooms.entries()){
  const cx=r.x+.5,cz=r.z+.5,m=ROOM_MOODS[r.style],walls=[];
  const face=(nx,nz,u,y,w,h,depth,color,offset=4.43)=>b(cx+nx*offset-nz*u,y,cz+nz*offset+nx*u,nx?depth:w,h,nx?w:depth,color);
  // Every exit is discovered from the actual generated floor, never assumed.
  for(const [nx,nz]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const open=dungeon.floor.has((r.x+nx*5)+','+(r.z+nz*5));walls.push({nx,nz,open});
   // A continuous lower dado and chipped courses bind all rooms to one prison.
   for(const u of [-3.5,3.5]){face(nx,nz,u,2.6,.38,3.2,.18,m.stone);face(nx,nz,u,4.35,.65,.16,.25,m.trim);}
   for(const y of [1.4,3.8,5.3]){
    if(open){for(const u of [-3,3])face(nx,nz,u,y,2.7,.12,.1,m.trim);}
    else face(nx,nz,0,y,8.7,.12,.1,m.trim);
   }
   if(open){
    // Posts are in the corridor walls; the three-block passage stays open.
    for(const u of [-1.78,1.78])face(nx,nz,u,2.8,.32,3.6,.35,iron,4.65);
    face(nx,nz,0,4.75,3.9,.35,.4,iron,4.65);
    label(['PASSAGE '+String(index+1).padStart(2,'0'),'KEEP THE THRESHOLD CLEAR'],cx+nx*4.4,4.75,cz+nz*4.4,2.9,.55,-nx,-nz);
   }
  }
  const closed=walls.filter(w=>!w.open);
  // Markings remain flush: no debris piles or pillars in the fighting square.
  b(cx,1.015,cz,8.55,.025,8.55,m.stone);
  for(const off of [-3.65,3.65]){b(cx+off,1.04,cz,.07,.018,7.3,m.trim);b(cx,1.04,cz+off,7.3,.018,.07,m.trim);}
  for(let i=0;i<10;i++)b(cx-3+(i*7%7),1.055,cz-3+(i*11%7),.35+(i%3)*.12,.01,.055,0x424f44);
  // Structural ribs make this a buried building rather than an outdoor arena.
  for(const off of [-3.4,3.4]){b(cx+off,5.65,cz,.28,.35,8.8,iron);b(cx,5.65,cz+off,8.8,.35,.28,iron);}
  const panel=closed[0];
  if(panel)label([String(index+1).padStart(2,'0')+' / '+r.style.toUpperCase(),m.subtitle],cx+panel.nx*4.32,4.6,cz+panel.nz*4.32,6.2,1,-panel.nx,-panel.nz);
  // Wall-mounted fixtures and one diffuse room light leave attack tells readable.
  for(const {nx,nz}of closed.slice(0,2)){
   face(nx,nz,0,3.5,1.1,.45,.2,iron);
   glow(cx+nx*4.28,3.5,cz+nz*4.28,nx?.08:.75,.2,nx?.75:.08,m.light);
  }
  const light=new T.PointLight(m.light,38,14,2);light.position.set(cx,4.6,cz);root.add(light);
  if(r.style==='Intake'){
   for(const {nx,nz}of closed){
    face(nx,nz,0,2.5,5,2.3,.09,0x283d32);
    for(const u of [-2,-1.5,-1,-.5,0,.5,1,1.5,2])face(nx,nz,u,2.8,.065,1.7,.14,m.trim,4.32);
    face(nx,nz,0,1.9,5.2,.2,.25,0x8d7956);
    for(const u of [-2.8,2.8]){face(nx,nz,u,2.2,.65,2.4,.13,0x4a5d4a);face(nx,nz,u,2.3,.12,.16,.2,m.trim,4.3);}
   }
   // Inlaid intake queue stripes lead to whichever passage was generated.
   for(let i=-2;i<=2;i++)b(cx+i*.65,1.06,cz,.25,.02,.9,0xb6a374);
  }else if(r.style==='Cellblock'){
   for(const {nx,nz}of closed)for(const u of [-2.5,0,2.5]){
    face(nx,nz,u,2.65,1.9,3.1,.08,0x192b2b);
    for(let k=-.75;k<=.76;k+=.3)face(nx,nz,u+k,2.65,.065,3,.14,0x89938a,4.31);
    for(const y of [1.5,3.15])face(nx,nz,u,y,1.85,.08,.16,m.trim,4.3);
    face(nx,nz,u,4.25,2.1,.2,.18,m.trim);
   }
   b(cx,5.35,cz,8.5,.14,.2,0x727660);
  }else if(r.style==='Overgrown cistern'){
   // Shallow perimeter water is decorative; the entire combat floor stays dry.
   for(const off of [-4,4]){b(cx+off,1.04,cz,.35,.04,7.5,0x476c63);b(cx,1.04,cz+off,7.5,.04,.35,0x476c63);}
   for(const {nx,nz}of closed){
    for(const u of [-2.5,2.5]){
     face(nx,nz,u,3.2,.4,3.7,.25,0x647a67);
     for(const y of [1.7,3,4.4])face(nx,nz,u,y,.65,.14,.3,iron);
    }
    face(nx,nz,0,2.65,3,2.4,.08,0x253f35);
    for(let i=0;i<7;i++){const u=-2.6+i*.85,h=.6+(i%3)*.35;face(nx,nz,u,5-h/2,.2,h,.18,i%2?0x5f7548:0x78905b,4.29);}
   }
   b(cx,5.4,cz,8.4,.25,.42,0x637763);
  }else if(r.style==='Ember forge'){
   for(const {nx,nz}of closed){
    face(nx,nz,0,2.7,5.4,3.2,.13,0x7e6150);
    face(nx,nz,0,2.5,3.6,1.7,.16,0x271f1b,4.31);
    glow(cx+nx*4.2,2.15,cz+nz*4.2,nx?.06:3.1,.8,nx?3.1:.06,0xa9673e);
    for(let u=-1.5;u<=1.5;u+=.5)face(nx,nz,u,2.5,.08,1.7,.14,iron,4.08);
    face(nx,nz,0,4.8,1.4,1.4,.22,iron);
   }
   for(const off of [-2.5,2.5])b(cx+off,5.4,cz,.3,.35,8.5,0x625a44);
   // Rails are flush with the paving and cannot catch feet or arrows.
   for(const off of [-1.1,1.1])b(cx+off,1.06,cz,.08,.025,6.8,0x9d9678);
  }else{
   // Vault: rigid brass-framed panels, ceiling coffers and a sober boss floor.
   for(const {nx,nz}of closed)for(const u of [-2.7,0,2.7]){
    face(nx,nz,u,2.9,2.1,3.1,.1,0x30483f);
    for(const off of [-1,1])face(nx,nz,u+off,2.9,.1,3.1,.16,m.trim,4.32);
    for(const y of [1.4,4.4])face(nx,nz,u,y,2.1,.1,.16,m.trim,4.32);
   }
   for(const off of [-2.9,2.9]){b(cx+off,5.35,cz,.25,.3,6.1,m.trim);b(cx,5.35,cz+off,6.1,.3,.25,m.trim);}
   for(const off of [-2.7,2.7]){b(cx+off,1.07,cz,.12,.025,5.4,m.trim);b(cx,1.07,cz+off,5.4,.025,.12,m.trim);}
   // No bright floor rune competes with the Underwarden's attack warning.
   b(cx,1.055,cz,4.8,.02,4.8,0x46544a);
  }
  dungeon.roomArchitecture.push({style:r.style,openSides:walls.filter(w=>w.open).map(w=>[w.nx,w.nz]),clearHalfWidth:3.5,light});
 }
 // Covered service passages share overhead conduit, pools of light and thresholds.
 for(let i=1;i<dungeon.rooms.length;i++){
  const a=dungeon.rooms[i-1],r=dungeon.rooms[i],cx=(a.x+r.x)/2+.5,cz=(a.z+r.z)/2+.5,alongX=a.x!==r.x;
  b(cx,5.25,cz,alongX?4:.2,.2,alongX?.2:4,0x7d7759);
  for(const off of [-1.25,1.25])b(cx+(alongX?0:off),1.035,cz+(alongX?off:0),alongX?4:.07,.02,alongX?.07:4,0x8b957f);
  glow(cx,5.05,cz,.5,.12,.5,0xd0b78b);
 }
 const mesh=new T.InstancedMesh(geometry,material,rows.length),matrix=new T.Matrix4(),p=new T.Vector3(),s=new T.Vector3(),q=new T.Quaternion();rows.forEach((r,i)=>{matrix.compose(p.set(r.x,r.y,r.z),q,s.set(r.w,r.h,r.d));mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,new T.Color(r.color));});mesh.name='Instanced dungeon architecture';mesh.computeBoundingSphere();root.add(mesh);dungeon.architecture=root;
}

// Seeded, material-aware fracture graphs. No world state, rendering or rewards.
export function fractureSeed(value){let n=2166136261;for(const c of String(value))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
const clamp=n=>Math.max(1,Math.min(127,Math.round(n)));
export function fractureGraph({seed=1,type=0,face=4,anchor={u:.5,v:.5},energy=1,exposure=0}={}){
 let n=fractureSeed(seed+':'+type+':'+face);const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 const root=[clamp(anchor.u*128),clamp((1-anchor.v)*128)],hard=[3,4,5,6,7].includes(type),crystal=type===2||type===6,arms=(hard?6:4)+Math.floor(random()*3),paths=[];
 const stress=Math.max(.6,Math.min(1.8,energy)),grain=random()*Math.PI,reachScale=1+Math.min(3,exposure)*.06;
 for(let i=0;i<arms;i++){
  const angle=grain+i*Math.PI*2/arms+(random()-.5)*.65,length=(25+random()*65)*reachScale*(.8+stress*.2),points=[root],born=(i%3)*.10;
  let x=root[0],y=root[1];const segments=crystal?3:5;
  for(let j=1;j<=segments;j++){const a=angle+(random()-.5)*(crystal?.24:.75),step=length/segments;x=clamp(x+Math.cos(a)*step);y=clamp(y+Math.sin(a)*step);points.push([x,y]);}
  paths.push({points,born,width:hard?1.7:2.4});
  for(let j=1;j<points.length-1;j++)if(random()<(hard?.7:.45)){
   const a=angle+(random()<.5?-1:1)*(.5+random()*.8),len=10+random()*27,p=points[j];
   paths.push({points:[p,[clamp(p[0]+Math.cos(a)*len*.5),clamp(p[1]+Math.sin(a)*len*.5)],[clamp(p[0]+Math.cos(a+.2)*len),clamp(p[1]+Math.sin(a+.2)*len)]],born:.25+j*.08,width:1.2});
  }
 }
 return paths;
}
// Reveal fixed paths by arc length. Existing vertices never wriggle on a hit.
export function revealFracture(graph,progress){const lines=[];for(const path of graph){const growth=Math.max(0,Math.min(1,(progress-path.born)/(1-path.born)));if(growth<=0)continue;const p=path.points,lengths=p.slice(1).map((q,i)=>Math.hypot(q[0]-p[i][0],q[1]-p[i][1])),total=lengths.reduce((a,b)=>a+b,0);let remaining=total*growth;const line=[p[0]];for(let i=0;i<lengths.length;i++){if(remaining>=lengths[i]){line.push(p[i+1]);remaining-=lengths[i];}else{const t=lengths[i]?remaining/lengths[i]:0;line.push([p[i][0]+(p[i+1][0]-p[i][0])*t,p[i][1]+(p[i+1][1]-p[i][1])*t]);break;}}if(line.length>1)lines.push(line);}return lines;}

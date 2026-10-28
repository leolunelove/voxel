import * as T from '../../vendor/three.module.js';
// One small atlas and one lookup per fragment, shared by all architectural batches.
export const SURFACES={STONE:0,IRON:1,TIMBER:2,PAINT:3,CONCRETE:4,PLANK:5,PLAIN:6};
export function surfaceKind(hex){
 const r=hex>>16&255,g=hex>>8&255,b=hex&255;
 if((g>95&&r>g*1.3&&b<80)||(g>r*1.15&&g>b*1.2))return SURFACES.PLAIN;
 if(r>90&&r>g*1.65&&g>b*1.05)return SURFACES.PAINT;
 if(r>g*1.13&&g>b*1.12)return SURFACES.TIMBER;
 if([0x303238,0x24262a,0x34363b,0x35373d,0x22262b,0x20252a,0x171e28,0x292a2f,0x35453b,0x314b3c,0x65786c,0xb7c5b5,0x8a8580,0x8b8172].includes(hex))return SURFACES.IRON;
 return SURFACES.STONE;
}
export function architectureAtlas(){
 const width=256,height=128,data=new Uint8Array(width*height*4);let seed=1701;
 const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const fill=(tile,x,y,w,h,v)=>{for(let j=Math.max(0,y);j<Math.min(64,y+h);j++)for(let i=Math.max(0,x);i<Math.min(64,x+w);i++){const p=(((tile>>2)*64+j)*width+(tile%4)*64+i)*4;data[p]=data[p+1]=data[p+2]=v;data[p+3]=255;}};
 for(let tile=0;tile<8;tile++){
  fill(tile,0,0,64,64,234);
  for(let n=0;n<380;n++)fill(tile,Math.floor(rand()*64),Math.floor(rand()*64),1+Math.floor(rand()*3),1,218+Math.floor(rand()*29));
  if(tile===0){for(let row=0;row<4;row++){const y=row*16;fill(tile,0,y,64,1,154);fill(tile,0,y+1,64,1,249);for(let x=(row%2)*16;x<64;x+=32){fill(tile,x,y,1,16,163);fill(tile,x+1,y+2,1,13,242);}}for(const [x,y,w]of [[8,10,7],[39,23,8],[16,54,9]]){fill(tile,x,y,w,1,184);fill(tile,x+w-1,y,1,3,184);}}
  if(tile===1){fill(tile,0,0,64,2,180);fill(tile,0,0,2,64,180);for(const x of [5,58])for(const y of [5,58]){fill(tile,x,y,3,3,128);fill(tile,x,y,2,1,255);}for(let n=0;n<20;n++)fill(tile,Math.floor(rand()*64),Math.floor(rand()*64),1,2+Math.floor(rand()*6),205);}
  if(tile===2||tile===5){for(let x=0;x<64;x+=16){fill(tile,x,0,1,64,156);fill(tile,x+1,0,1,64,250);}for(let n=0;n<65;n++)fill(tile,Math.floor(rand()*32)*2,Math.floor(rand()*64),1,3+Math.floor(rand()*11),192+Math.floor(rand()*40));fill(tile,23,20,6,9,170);fill(tile,24,22,4,5,220);}
  if(tile===3){for(const y of [3,31,60]){fill(tile,4,y,56,1,164);fill(tile,5,y+1,54,1,253);}for(const x of [4,59])fill(tile,x,4,1,57,182);for(let n=0;n<38;n++){const x=Math.floor(rand()*64),y=42+Math.floor(rand()*22);fill(tile,x,y,2+Math.floor(rand()*4),1+Math.floor(rand()*3),150+Math.floor(rand()*35));}for(const y of [11,46]){fill(tile,9,y,3,3,120);fill(tile,9,y,2,1,255);}fill(tile,48,23,1,8,254);fill(tile,49,24,2,5,184);}
  if(tile===4){fill(tile,0,63,64,1,160);fill(tile,63,0,1,64,160);fill(tile,0,0,63,1,253);fill(tile,5,39,13,1,173);fill(tile,17,40,1,5,173);fill(tile,18,44,5,1,173);for(let n=0;n<8;n++)fill(tile,Math.floor(rand()*64),Math.floor(rand()*64),2,2,191);}
 }
 return {data,width,height};
}
const vertexHeader='varying vec2 vArchitectureUv; varying float vArchitectureStyle;\nuniform float architectureStyle;\n#ifdef ARCHITECTURE_INSTANCES\nattribute float architectureInstanceStyle;\n#endif\n';
const vertexBody=`
 vec4 architecturePosition=vec4(transformed,1.0);
 vec3 architectureNormal=normal;
 #ifdef USE_INSTANCING
 architecturePosition=instanceMatrix*architecturePosition;
 architectureNormal=mat3(instanceMatrix)*architectureNormal;
 #endif
 architecturePosition=modelMatrix*architecturePosition;
 architectureNormal=abs(normalize(mat3(modelMatrix)*architectureNormal));
 float architectureKind=architectureStyle;
 #ifdef ARCHITECTURE_INSTANCES
 architectureKind=architectureInstanceStyle;
 #endif
 if(architectureNormal.y>architectureNormal.x&&architectureNormal.y>architectureNormal.z){
  vArchitectureUv=architecturePosition.xz;
  if(architectureKind<0.5)architectureKind=4.0;
  else if(abs(architectureKind-2.0)<0.1)architectureKind=5.0;
 }else if(architectureNormal.x>architectureNormal.z)vArchitectureUv=architecturePosition.zy;
 else vArchitectureUv=architecturePosition.xy;
 vArchitectureUv*=architectureKind<0.5?0.5:architectureKind>3.5?0.75:architectureKind>1.5&&architectureKind<2.5?1.0:0.7;
 vArchitectureStyle=architectureKind;
`;
export class ArchitectureSurfaces{
 constructor(){const atlas=architectureAtlas();this.atlas=new T.DataTexture(atlas.data,atlas.width,atlas.height);this.atlas.colorSpace=T.SRGBColorSpace;this.atlas.magFilter=T.NearestFilter;this.atlas.minFilter=T.LinearMipmapLinearFilter;this.atlas.generateMipmaps=true;this.atlas.anisotropy=4;this.atlas.needsUpdate=true;this.detail={value:1};this.materials=new Set();}
 material(material,style=surfaceKind(material.color.getHex()),instances=false){
 if(material.userData.architecture||material.map||material.transparent||!material.isMeshStandardMaterial||material.emissiveIntensity>0&&material.emissive.getHex()!==0)return material;
 material.userData.architecture=true;this.materials.add(material);material.customProgramCacheKey=()=>instances?'voxel-architecture-74-instanced':'voxel-architecture-74';
 material.onBeforeCompile=shader=>{
  if(material.map)return;
  shader.uniforms.architectureAtlas={value:this.atlas};shader.uniforms.architectureDetail=this.detail;shader.uniforms.architectureStyle={value:style};
  shader.vertexShader=(instances?'#define ARCHITECTURE_INSTANCES\n':'')+vertexHeader+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',vertexBody+'\n#include <project_vertex>');
  shader.fragmentShader='uniform sampler2D architectureAtlas; uniform float architectureDetail; varying vec2 vArchitectureUv; varying float vArchitectureStyle;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   if(architectureDetail>0.001){
    vec2 tile=vec2(mod(vArchitectureStyle,4.0),floor(vArchitectureStyle/4.0));
    vec2 detailUv=(tile*64.0+vec2(1.5)+fract(vArchitectureUv)*61.0)/vec2(256.0,128.0);
    vec3 patina=texture2D(architectureAtlas,detailUv).rgb;
    diffuseColor.rgb*=mix(vec3(1.0),patina,0.64*architectureDetail);
   }`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nif(abs(vArchitectureStyle-1.0)<0.1)roughnessFactor=mix(roughnessFactor,0.68,architectureDetail);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <metalnessmap_fragment>','#include <metalnessmap_fragment>\nif(abs(vArchitectureStyle-1.0)<0.1)metalnessFactor=mix(metalnessFactor,0.25,architectureDetail);');
 };
 material.needsUpdate=true;return material;
 }
 decorate(root,unitGeometry){
 root.traverse(o=>{if(!o.isInstancedMesh||o.geometry!==unitGeometry||!o.instanceColor||Array.isArray(o.material)||o.material.map||o.material.transparent)return;
  const geometry=o.geometry.clone(),styles=new Float32Array(o.count),color=new T.Color();for(let i=0;i<o.count;i++){o.getColorAt(i,color);styles[i]=surfaceKind(color.getHex());}
  geometry.setAttribute('architectureInstanceStyle',new T.InstancedBufferAttribute(styles,1));o.geometry=geometry;this.material(o.material,0,true);
 });
 }
}

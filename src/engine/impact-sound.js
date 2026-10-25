// Short, layered impact recipes. No game state, audio context or reward logic.
export function impactSound(kind,type=0,tier=0,variant=0){
 const wood=type===8,crystal=[2,6,7].includes(type),metal=[1,3,4,5].includes(type),broken=kind==='break';
 const pitch=[.97,1.025,.99,1.05,1][variant%5]*(1+Math.min(5,tier)*.009);
 const body=(wood?170:crystal?245:metal?195:125)*pitch;
 const layers=[
  {kind:'tone',delay:0,frequency:body,duration:broken?.085:.052,volume:broken?.065:.052,wave:'triangle',end:body*.42,attack:.0015},
  {kind:'grit',delay:0,frequency:wood?950:metal?3200:crystal?3800:2300,duration:wood?.025:.019,volume:broken?.12:.085,filter:'highpass',attack:.001},
  {kind:'grit',delay:.012,frequency:wood?440:metal?1050:650,duration:broken?.10:.048,volume:broken?.075:.038,filter:'bandpass',attack:.002}
 ];
 if(metal||crystal)layers.push({kind:'tone',delay:.003,frequency:(crystal?1450:1850)*pitch,duration:crystal?.115:.072,volume:crystal?.017:.012,wave:'sine',end:(crystal?1250:1420)*pitch,attack:.001});
 if(broken)for(let i=0;i<3;i++)layers.push({kind:'grit',delay:.035+i*.032,frequency:(wood?700:1350)+i*460,duration:.025,volume:.028-i*.005,filter:'bandpass',attack:.001});
 return layers;
}

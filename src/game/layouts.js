export const LAYOUTS=[
 {id:'courtyard',bounds:[-10,10,-18,8],bottom:-4,spawn:[.5,2.65,2],fog:.014,sky:0x748c89,ambient:0xc2d5c6,ground:0x46594a,intensity:1.65,sun:0xffdc9c,sunPower:2.2,wall:0x56665b,floor:0x576457,accent:0xc5a16b,title:'THE DEEPWELL',detail:'Open prison yard / timber watchposts / daylight'},
 {id:'foundry',bounds:[-11,11,-21,8],bottom:-4,spawn:[-3.5,2.65,2],fog:.026,sky:0x18232d,ambient:0x9cb9d5,ground:0x24313c,intensity:1.1,sun:0xa8d0e5,sunPower:1.5,wall:0x354855,floor:0x354553,accent:0xe69b53,title:'IRONWORKS',detail:'Twin extraction bays / steel gantry / furnace light'},
 {id:'vault',bounds:[-12,12,-22,8],bottom:-4,spawn:[.5,2.65,2],fog:.019,sky:0x202b3b,ambient:0xb6c8e4,ground:0x36394c,intensity:1.35,sun:0xe9d6a1,sunPower:1.8,wall:0x4d5563,floor:0x4b5260,accent:0xdfba62,title:'GILDED FAULT',detail:'Octagonal excavation / vault arches / crystal light'},
 {id:'hollow',bounds:[-12,12,-23,8],bottom:-5,spawn:[-3.5,2.65,2],fog:.030,sky:0x271e28,ambient:0xad94b2,ground:0x352332,intensity:.95,sun:0xf0b09b,sunPower:1.5,wall:0x34303e,floor:0x413b47,accent:0xf18a59,title:'EMBER HOLLOW',detail:'Split basalt terraces / deep cavern / heated conduits'}
];
export function columnTop(index,x,z){
 if(index===0)return x>=-7&&x<=7&&z>=-14&&z<=-1?0:null;
 if(index===1)return ((x>=-8&&x<=-2)||(x>=2&&x<=8))&&z>=-17&&z<=-1?0:null;
 if(index===2){const dx=Math.abs(x),dz=Math.abs(z+9);return dx<=9&&dz<=8&&dx+dz<=13?0:null;}
 const dx=Math.abs(x),dz=Math.abs(z+10);
 if(dx>9||dz>9||dx+dz>15||((x>=-1&&x<=1)&&z<=-5&&z>=-15))return null;
 return z< -11?1:0;
}
export function columnsFor(index){const layout=LAYOUTS[index],result=[];for(let x=layout.bounds[0]+1;x<layout.bounds[1];x++)for(let z=layout.bounds[2]+1;z<0;z++){const top=columnTop(index,x,z);if(top!==null)result.push({x,z,top});}return result;}

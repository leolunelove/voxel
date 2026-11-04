import {terraceFloor} from './foundry-layout.js?v=87';
// Human-scale architecture shared with reception; keep every prop off the walking lanes.
export function buildWorkCourt(w,{a,box:B,wall:W,roof:R,lamp:L,guard:G,sign:S}){
 const steel=0x435751,wood=0x8c6745,amber=0xb99a60;
 // Four legible frontages around one compact court, with no ambiguous side exits.
 for(const [x,z,width,depth]of [[-8,8,.3,8],[-8,23,.3,14],[-.15,30,15.7,.3],[11.8,30,1.4,.3],[17.3,30,1.4,.3],[18,6,.3,4],[18,14.5,.3,5],[18,28.5,.3,3]])W(x,z,width,depth,4.5);
 // North facade makes Deepwell the first obvious landmark on entering the yard.
 W(-1.4,4,13.2,.5,4.8);W(13.4,4,9.2,.5,4.8);
 B(7,4.43,4,3.6,1.26,.5,steel,true);R(5,-2,28,12.8,6.05);W(-8.8,-2,.4,12.8,4.8);W(18.8,-2,.4,12.8,4.8);W(13.9,-8.2,9.8,.4,4.8);
 for(const x of [-7,1,10,17]){a.surface(x,3.35,4.35,.42,4.7,.65,0x969d8d,'stone',true);B(x,5.84,4.35,.7,.2,.9,steel);}
 // Recessed barred windows, a masonry plinth and copper lamps make a finished work block.
 for(const x of [-5,-1,12,16]){
 B(x,3.1,4.29,1.5,1.35,.12,0x344d4a);for(const dx of [-.85,.85])a.surface(x+dx,3.1,4.39,.12,1.65,.3,0xa4a99b,'stone');
 B(x,2.33,4.45,1.9,.16,.45,0x778476);B(x,3.87,4.42,1.9,.13,.36,0x778476);
 for(const dx of [-.5,0,.5])B(x+dx,3.1,4.51,.055,1.3,.07,steel);
 L(x,4.65,4.75,20);
 }
 for(const [x,width]of [[-1.4,13.2],[13.4,9.2]])a.surface(x,1.33,4.28,width,.65,.2,0x8c9586,'stone');
 B(5,5.96,4.4,28,.18,.45,steel);B(5,5.55,4.43,28,.16,.14,0xa4a99b);
 S(['DEEPWELL'],7,4.04,4.32,3.1,.45);S(['01 / EXTRACTION DETAIL'],7,5.35,4.33,4.7,.35);
 for(const x of [5.08,8.92]){B(x,2.38,4,.14,2.76,.65,steel,true);L(x,3.55,4.6,23);}
 // A short straight issue passage, then an immediate view into the actual work chamber.
 for(const x of [5.08,8.92])W(x,-2,.25,12,3.5);R(7,-2,4.2,12,4.63);
 for(const z of [1,-4.8])L(7,4.32,z,26);
 S(['WORK FACE AHEAD'],7,3.5,-7.94,2.5,.25);
 // South gate ties the approved release passage directly into roll call.
 B(9.4,3.9,30,3.8,.65,.4,steel,true);S(['ROLL CALL / BLOCK 07'],9.4,3.48,29.75,2.8,.3,Math.PI);
 // Complete pay/forge office. Its entrance faces the court and its counter is waist high.
 W(12,18.7,.25,3.4,3.5);W(12,25.3,.25,3.4,3.5);W(22,22,.3,10,3.5);W(17,17,10,.3,3.5);W(17,27,10,.3,3.5);R(17,22,10.5,10.5,4.65);
 B(12,4.05,22,.3,.9,3.2,steel,true);S(['PAY OFFICE'],11.81,3.53,22,2.6,.38,-Math.PI/2);S(['WEIGH / SELL / FORGE'],11.8,2.98,22,2.5,.22,-Math.PI/2);
 a.surface(19,1.5,22,.9,1,4,0x526159,'metal',true);a.surface(19,2.08,22,1.05,.16,4.2,0xb2a385,'wood',true);G(20.5,22,-Math.PI/2);
 B(18.8,2.19,22,.45,.08,.6,0xcabb9a);S(['LABOUR ACCOUNTS'],21.81,3.15,22,3,.35,-Math.PI/2,true);L(17.6,4.3,22,35);
 for(const z of [19.4,24.6]){B(21.77,2.5,z,.1,1.4,1.5,0x334b48);for(const d of [-.45,0,.45])B(21.65,2.5,z+d,.08,1.4,.06,steel);}
 // Existing residential passage is the ONLY cellblock route, marked in pale stone.
 S(['CELLBLOCK A'], -7.78,3.1,14,2.7,.4,Math.PI/2);S(['CELL 07 / ASSIGNED QUARTERS'],-7.76,2.65,14,3,.22,Math.PI/2,true);
 // Modest utility detail, occupied edges, and a clear central work lane.
 for(const [x,z]of [[-6,22],[-6,8],[15.7,6.3]]){B(x,1.49,z,2.3,.14,.65,wood,true);for(const dx of [-.8,.8])B(x+dx,1.23,z,.13,.46,.55,steel,true);B(x,1.89,z+.28,2.3,.65,.1,wood);a.contact(x,z,3,1.7,.22,1.015);}
 for(const x of [-7.7,17.7]){B(x,2.8,24,.12,3.6,.12,steel);B(x,1.025,20,.32,.025,10,0x727c70);for(let z=15;z<=25;z+=.3)B(x,1.045,z,.28,.015,.05,steel);}
 B(-7.72,3.2,24,.25,.7,.45,0x55665b);B(-7.54,3.18,24,.08,.18,.25,0xbda36f);
 for(const [x,z]of [[-7.6,20],[17.6,15],[1,4.65]])L(x,4.1,z,25);
 // Painted assembly marks are deliberately secondary to the continuous route markings.
 for(const x of [-2.5,1])for(const z of [19.5,23,26]){B(x,1.024,z,.8,.014,.06,0xb5ad94);B(x,1.024,z-.25,.06,.014,.5,0xb5ad94);}
 S(['BLOCK 07','REPORT. WORK. RETURN.'],-7.79,3.35,25,3.8,.7,Math.PI/2);
 // Floor lines follow reachable ground, not through walls or the mine's empty centre.
 for(let z=5;z<29;z+=1.2)B(7,1.029,z,.09,.016,.68,amber);
 for(let x=-18.5;x<7;x+=1.2)B(x,1.029,14,.68,.016,.08,0xc1c4ac);
 for(let x=7.6;x<17.7;x+=1.2)B(x,1.029,22,.68,.016,.08,amber);
 for(let z=-6.8;z<4;z+=1.2)B(7,1.029,z,.09,.016,.68,amber);
 // Eye-level destination board lives beside the lane, not in it.
 B(9.7,1.72,16,.10,1.44,.10,steel,true);S(['DEEPWELL  ↑','CELL 07  ←     PAY OFFICE  →'],9.7,2.8,16,2.5,.65);
 S(['TIMBER DETAIL','CLEARANCE 2 / LOGGING WORKS'],17.75,3.5,10,3.5,.5,-Math.PI/2);
}
export function buildDeepwell(w,{a,box:B,wall:W,roof:R,lamp:L,guard:G,sign:S}){
 const steel=0x435751,amber=0xb99a60;const task=(x,y,z,power=65)=>{const light=L(x,y,z,power);light.distance=17;light.userData.alwaysOn=true;return light;};
 // A contained excavation hall: its depth comes from the benches, not giant empty walls.
 W(-23.6,-22,.4,28,4.8);W(9.6,-22,.4,28,4.8);W(-7,-35.6,33.2,.4,4.8);
 W(-9.3,-8.2,28.6,.4,4.8);W(9.2,-8.2,.8,.4,4.8);B(7,4.44,-8.2,3.6,1.28,.45,steel,true);
 R(-7,-22,34,28.5,6.05);
 for(const z of [-10,-18,-26,-34]){B(-7,5.79,z,32,.24,.22,steel);for(const x of [-22.7,8.7]){B(x,3.35,z,.2,4.7,.2,steel,true);B(x,1.2,z,.5,.4,.5,0x939c8b,true);}}
 for(const x of [-18,-6,6]){for(const z of [-11,-34]){B(x,3.45,z,.18,4.9,.18,steel,true);B(x,1.2,z,.45,.4,.45,0x939c8b,true);}B(x,5.68,-22,.2,.24,24,steel);}
 S(['DEEPWELL / EXTRACTION'],7,3.45,-8.45,3.1,.33,Math.PI);S(['WORK FACE  ←','RAMP TO LOWER BENCHES'],8.97,3.45,-12,3.3,.55,-Math.PI/2);
 S(['UPPER BENCH / REGISTERED LABOUR'], -7,4.25,-35.31,8,.55);
 // The original permanent ramp and bridge stay exactly the same dimensions.
 for(let z=-12;z> -24;z--){const y=terraceFloor(3,z-.5);a.surface(3,y-.12,z-.5,2,.24,1,0xa8a496,'stone');B(3,y+.021,z-.5,1.5,.014,.065,amber);B(3.91,y+.525,z-.5,.06,1.05,.06,steel,true);if(z< -12)B(3.91,y+1.05,z-.5,.06,.07,1,steel,true);}
 for(const [x,z]of [[7,-11],[-21,-12],[-21,-33],[7,-33]])task(x,4.9,z,65);
 for(const [x,z]of [[2,-17],[0,-25],[-12,-25]]){const y=terraceFloor(x,z),h=y+3.15;task(x,h,z,12);B(x,(h+5.8)/2,z,.035,5.8-h,.035,steel);}
 for(const x of [-15,-3,7])for(const z of [-15,-28]){task(x,5.15,z,60);B(x,5.49,z,.035,.62,.035,steel);}
 // Guarded outer edge only; the route and mineable faces remain unobstructed.
 for(let x=-19;x<=2;x+=2){B(x,1.85,-9.5,.07,1.7,.07,steel);B(x,2.65,-9.5,2,.07,.07,steel);}
 for(const z of [-16,-22,-28]){B(9.32,3.7,z,.12,.10,5,steel);B(9.25,3.7,z,.18,.18,.12,0x8c7957);}
 // Returning is explicitly signposted from the ramp landing and chamber.
 for(let z=-12;z< -7.8;z+=.8)B(7,1.029,z,.09,.016,.5,amber);
 for(let x=3.6;x<7.1;x+=.8)B(x,1.029,-12,.5,.016,.09,amber);
 S(['YARD / PAY OFFICE  →'],1.3,3.1,-8.45,4.5,.35,Math.PI);S(['RETURN TO YARD','CELL 07 / PAY OFFICE'],7,3.5,-7.91,3.1,.48,Math.PI);
 S(['RAMP / EXIT ABOVE'],4.4,-.2,-22,2.5,.35,-Math.PI/2,true);
 // Safe props occupy the back wall and upper service edge, never the mine ramp.
 for(const x of [-20,-18.7]){B(x,1.5,-34.4,1,.95,1,0x637366,true);B(x,2.02,-34.4,1,.08,1,0x9da38c);}
 B(8.5,1.6,-20,1,1.2,2,0x5a6860,true);S(['VENTILATION'],8.01,2.8,-20,1.8,.23,-Math.PI/2);
 G(8.25,-6.5,Math.PI);
}

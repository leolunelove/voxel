// Interactions stay in the world: no modal, pointer-lock hand-off or repeated confirmation.
export function createIntakeExperience({confirm}){
 const panel=document.createElement('aside');panel.className='intake-caption';panel.hidden=true;panel.setAttribute('role','status');document.body.append(panel);
 const lines={welcome:['OFFICER ROOK','Off the transport. Reception is through the doors ahead.'],search:['PROPERTY CONTROL','Belongings logged. Move along the counter to register with the duty officer.'],checkin:['DUTY OFFICER','Cell 07, west row. Tool issue is through the door on your right.'],issue:['TOOL CONTROL','One pickaxe. Your responsibility. Report to Cell 07 before starting your shift.'],cell:['CELL 07','Your bed, your locker. Deepwell is right at the north junction. Bring your first haul to the Pay Office.']};
 let timer;
 function show(key){const line=lines[key];if(!line)return;if(key!=='welcome')confirm(key);panel.replaceChildren();const name=document.createElement('small'),text=document.createElement('p');name.textContent=line[0];text.textContent=line[1];panel.append(name,text);panel.hidden=false;clearTimeout(timer);timer=setTimeout(()=>panel.hidden=true,key==='cell'?10000:7000);}
 return {show,hide(){clearTimeout(timer);panel.hidden=true;},get active(){return false;}};
}

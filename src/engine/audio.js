import {impactSound} from './impact-sound.js?v=79.1';
export class Audio{
 constructor(){this.context=null;this.muted=false;this.noise=null;this.variant=0;}
 unlock(){this.context??=new(window.AudioContext||window.webkitAudioContext)();this.context.resume();if(!this.master){this.master=this.context.createGain();this.master.gain.value=this.volume??.75;this.master.connect(this.context.destination);}if(!this.noise){const c=this.context;this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate);const d=this.noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}}
 tone(t,f,duration,volume,type='sine',end=f*.65,attack=.004){const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master??c.destination);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};}
 grit(t,duration,volume,frequency,filterType='bandpass',attack=.003){const c=this.context,n=c.createBufferSource(),filter=c.createBiquadFilter(),g=c.createGain();n.buffer=this.noise;filter.type=filterType;filter.frequency.value=frequency;filter.Q.value=.65;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+duration);n.connect(filter);filter.connect(g);g.connect(this.master??c.destination);n.start(t,Math.random()*.6,duration);n.onended=()=>{n.disconnect();filter.disconnect();g.disconnect();};}
 play(kind,type=0,tier=0){
 if(!this.context||this.muted||!this.noise)return;const t=this.context.currentTime;
 if(kind==='tree-break'){this.tone(t,110,.14,.065,'triangle',38,.001);this.grit(t,.16,.08,650);this.grit(t+.035,.22,.045,2800,'highpass');this.tone(t+.06,320,.10,.025,'triangle',105,.001);return;}
 if(kind==='wake'){[392,494,587].forEach((f,i)=>this.tone(t+i*.15,f,.55,.025,'sine',f));return;}
 if(kind==='rest'){[330,440,554,660].forEach((f,i)=>this.tone(t+i*.18,f,.8,.035,'sine',f));return;}
 if(kind==='shield-block'||kind==='perfect-block'||kind==='guard-break'){this.tone(t,kind==='guard-break'?95:420,.17,.075,'triangle',kind==='guard-break'?38:210);this.grit(t,.085,.08,1700);if(kind==='perfect-block')this.tone(t+.02,1100,.23,.035,'sine',1500);return;}
 if(kind==='monster-death'){this.tone(t,140,.19,.065,'triangle',35);this.grit(t,.16,.065,450);[660,880].forEach((f,i)=>this.tone(t+.06+i*.065,f,.16,.025,'sine',f));return;}
 if(kind==='bow-tension'){this.tone(t,90+type*95,.13,.014+type*.01,'triangle',120+type*115);this.grit(t,.065,.014+type*.012,500+type*450);return;}
 if(kind==='bow-ready'){this.tone(t,460,.09,.018,'triangle',620);return;}
 if(kind==='boss-victory'){[220,330,440,554,660].forEach((f,i)=>this.tone(t+i*.13,f,.65,.045,'triangle',f));this.grit(t,.4,.07,180);return;}
 if(kind==='armor-hit'){this.tone(t,105,.12,.07,'triangle',42);this.tone(t,1750,.14,.035,'sine',900);this.grit(t,.065,.09,1700);return;}
 if(kind==='monster-arrow-hit'||kind==='arrow-armor-hit'){const power=Math.max(0,Math.min(1,type)),metal=kind==='arrow-armor-hit';this.grit(t,.022,.045+power*.055,metal?3300:2100,'highpass',.001);this.tone(t,metal?150:108,.09+power*.045,.035+power*.045,'triangle',metal?58:40,.001);this.grit(t+.012,.065,.025+power*.025,metal?1200:480);if(metal)this.tone(t+.003,1950,.11,.012+power*.018,'sine',1050,.001);if(power>=.999)this.tone(t+.025,880,.07,.014,'sine',660,.001);return;}
 if(kind==='arrow-wall'){this.tone(t,145,.09,.025+type*.025,'triangle',58);this.grit(t,.055,.03+type*.03,850);return;}
 if(kind==='arrow-hit'||kind==='bullseye'){this.grit(t,.06,.09,650);this.tone(t,kind==='bullseye'?1046:740,.16,.045,'sine',kind==='bullseye'?1568:900);return;}
 if(kind==='bow-release'){this.tone(t,290,.045,.035+type*.035,'triangle',65);this.grit(t,.055,.045+type*.05,2600+type*700);this.tone(t+.012,440,.14,.012+type*.012,'sine',130);return;}
 if(kind==='swoosh'){this.grit(t,.075,.035,1800);return;}
 if(kind==='strike'){this.tone(t,145,.09,.065,'triangle',65);this.grit(t,.055,.09,750);this.tone(t+.004,1260,.09,.018,'sine',820);return;}
 if(kind==='hurt'){this.tone(t,88,.14,.06,'triangle',42);this.grit(t,.1,.055,340);return;}
 if(kind==='pickup'){this.tone(t,740+type*130,.08,.018,'sine',980+type*130);return;}
 if(kind==='sell'||kind==='upgrade'){const notes=kind==='upgrade'?[440,554.37,659.25,880]:[523.25,659.25,783.99];notes.forEach((f,i)=>this.tone(t+i*.065,f,.25,.035,'sine',f));return;}
 if(kind==='hit'||kind==='break')for(const layer of impactSound(kind,type,tier,this.variant++)){
  if(layer.kind==='tone')this.tone(t+layer.delay,layer.frequency,layer.duration,layer.volume,layer.wave,layer.end,layer.attack);
  else this.grit(t+layer.delay,layer.duration,layer.volume,layer.frequency,layer.filter,layer.attack);
 }

 }
 environment(index,active){
 if(!this.context||!this.noise)return;const c=this.context,t=c.currentTime;
 if(!this.ambient){this.ambient=c.createBufferSource();this.ambient.buffer=this.noise;this.ambient.loop=true;this.ambientFilter=c.createBiquadFilter();this.ambientFilter.type='lowpass';this.ambientGain=c.createGain();this.ambientGain.gain.value=0;this.ambient.connect(this.ambientFilter);this.ambientFilter.connect(this.ambientGain);this.ambientGain.connect(this.master??c.destination);this.ambient.start();}
 if(this.ambientMine!==index){this.ambientMine=index;this.ambientFilter.frequency.setTargetAtTime([420,115,680,82,650][index],t,.5);}
 this.ambientGain.gain.setTargetAtTime(this.muted||!active?0:[.010,.021,.007,.026,.009][index],t,.2);
 }

 setVolume(value){this.volume=Math.max(0,Math.min(1,value));if(this.master)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.03);}

}

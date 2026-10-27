import {swordDamage} from '../game/hunt-rules.js?v=72';
import {SWORDS,BOWS} from '../game/weapons.js?v=72';
import {toolIcon} from '../engine/pickaxe.js?v=72';
import {PICKS,BLOCKS,bagCount,bagValue,capacity,bagCost} from '../game/rules.js?v=72';
import {MINE_STAGES,FOREST_STAGES,AXES,campLevel,LEVEL_TWO,pickRequirement} from '../game/camp-rules.js?v=72';

const fmt=n=>n.toLocaleString();
const swatch=b=>'<i class="ore-gem" style="--ore:#'+b.color.toString(16).padStart(6,'0')+'"></i>';
export class HUD{
 constructor(actions){
 this.actions=actions;this.tab='mines';this.started=false;
 document.querySelector('#interface').innerHTML=`
 <div class="game-hud">
  <header class="hud-top"><div class="voxel-mark"><span class="brand-cube">V</span><div><b>VOXEL</b><small>EVERY BLOCK IS A WAY FORWARD</small></div></div>
   <div class="mine-badge"><span id="hud-rank">A</span><div><b id="hud-mine"></b><small id="hud-wing"></small></div></div>
   <div class="credit-chip"><small>CREDITS</small><b id="money">0</b><span>CR</span></div></header>
  <aside class="next-order"><small>NEXT UNLOCK</small><b id="goal"></b><div class="meter"><span id="rank-meter"></span></div><span id="goal-detail"></span><kbd>E</kbd><em>Workers’ Exchange</em></aside>
  <div id="prison-route" class="prison-route"></div><div id="crosshair"><span></span><span></span><span></span><span></span></div>
  <div id="target" hidden><b id="block-name"></b><div class="meter"><span id="damage"></span></div></div>
  <div id="pickup-slip" aria-hidden="true"></div>
  <footer class="hud-bottom"><div class="tool-chip"><span class="tool-icon">⛏</span><div><small>AUTO TOOL</small><b id="pick-name"></b><span id="pick-power"></span></div></div>
   <div class="voxel-hotbar" aria-hidden="true"><div class="hotbar-slot selected" data-tool-slot="pick"><img id="slot-pick" alt=""><small>PICK</small></div><div class="hotbar-slot" data-tool-slot="axe"><img id="slot-axe" alt=""><small>AXE</small></div><div class="hotbar-slot" data-tool-slot="sword"><svg viewBox="0 0 16 16"><path fill="#c8d6cf" d="M7 1h2v8H7z"/><path fill="#e6eddf" d="M7 0h1v8H7z"/><path fill="#d7b875" d="M4 9h8v2H4z"/><path fill="#714b29" d="M7 11h2v4H7z"/></svg><small>SWORD</small></div><div class="hotbar-slot" data-tool-slot="bow"><svg viewBox="0 0 16 16"><path fill="none" stroke="#bb8d53" stroke-width="2" d="M5 1L9 4L11 8L9 12L5 15"/><path fill="none" stroke="#e4d7b5" d="M5 1v14"/></svg><small>BOW</small></div><div class="hotbar-slot bag-slot"><svg viewBox="0 0 16 16"><path fill="#392d1e" d="M1 4h14v10H1z"/><path fill="#a4773b" d="M2 5h12v8H2z"/><path fill="#d6ae63" d="M1 4h14v4H1z"/><path fill="#684c2b" d="M2 8h12v1H2z"/><path fill="#f0d697" d="M7 7h2v4H7z"/></svg><small id="bag-mini">0</small></div></div><div class="satchel-chip"><div><b>Your haul</b><span id="bag-count"></span></div><div class="meter"><span id="bag-fill"></span></div><small id="bag-value"></small></div>
   <div class="control-strip"><span><kbd>SPACE</kbd> Jump</span><span><kbd>SHIFT</kbd> Sprint</span><span><kbd>E</kbd> Exchange</span><span><kbd>R</kbd> Yard</span><span><kbd>ESC</kbd> Pause</span></div></footer>
 </div>
 <div id="toast" role="status" aria-live="polite"></div>

 <section id="menu" class="overlay title-screen" role="dialog" aria-modal="true" aria-label="Voxel main menu">
  <div class="title-topline"><span>BLOCK 07</span><span class="title-status">IRON & EMBER</span></div>
  <div class="start-shell">
   <div class="start-identity"><h1 aria-label="Voxel">VOXEL</h1><div class="wordmark-sub"><b>PRISON</b></div></div>
   <div class="start-actions">
    <div id="menu-main-actions">
     <h2 id="start-title">Your next shift.</h2><p id="start-summary">Mine. Forge. Make this place yours.</p>
     <button id="play" class="button primary menu-play">Continue <span>▶</span></button>
     <button id="start-exchange" class="menu-link"><span><b>Workers’ Exchange</b></span><span>›</span></button>
     <button id="open-settings" class="menu-link"><span><b>Settings</b></span><span>›</span></button>
     <button id="open-controls" class="menu-link"><span><b>Controls</b></span><span>›</span></button>
     <div class="shift-card"><span id="start-rank">A</span><div><small>LOCAL SAVE</small><b id="start-mine"></b><em id="start-tool"></em></div><i class="save-check" aria-label="Progress stored locally">✓</i></div>
     <small class="save-note">PROGRESS SAVES AUTOMATICALLY</small><p id="lock-error" role="alert"></p>
    </div>
    <div id="menu-settings" hidden><button data-menu-back class="menu-back">← Main menu</button><small class="eyebrow">MAKE IT YOURS</small><h2>Settings</h2><p class="setting-intro">A comfortable shift is a good shift.</p>
     <div class="setting-range"><label for="volume">Master volume <output id="volume-value">75%</output></label><input id="volume" type="range" min="0" max="100" value="75"></div>
     <label class="setting-toggle"><span><b>Mute sound</b><small>Quiet tools and surroundings.</small></span><input id="mute" type="checkbox"></label>
     <label class="setting-toggle"><span><b>Reduced motion</b><small>Less tool movement and fewer particles.</small></span><input id="motion" type="checkbox"></label>
     <div class="setting-range"><label for="sensitivity">Mouse sensitivity <output id="sensitivity-value">100%</output></label><input id="sensitivity" type="range" min="40" max="180" step="5" value="100"></div><small class="save-note">YOUR SETTINGS SAVE BETWEEN SHIFTS.</small>
    </div>
    <div id="menu-controls" hidden><button data-menu-back class="menu-back">← Main menu</button><h2>Controls</h2>
     <div class="control-list"><span>Move <kbd>W A S D</kbd></span><span>Look <kbd>MOUSE / ARROWS</kbd></span><span>Mine / strike <kbd>HOLD LMB</kbd></span><span>Bow <kbd>HOLD / RELEASE LMB</kbd></span><span>Jump <kbd>SPACE</kbd></span><span>Sprint <kbd>SHIFT</kbd></span><span>Interact / rest <kbd>E</kbd></span><span>Swap weapon <kbd>Q</kbd></span><span>Dungeon guard <kbd>RMB / SWORD</kbd></span><span>Skills <kbd>TAB</kbd></span><span>Return to yard <kbd>R</kbd></span><span>Pause <kbd>ESC</kbd></span></div>
     <p class="controls-note">Mine 20 blocks to unlock the forest. Chop all three trunk blocks. Each log drops timber; the last clears the canopy. Sell and forge at the Exchange.</p><p class="controls-note">Walk out of combat to bank loot. Defeat, retreat or reload loses unbanked monster loot. Skills and gear stay yours.</p><small class="save-note">NO MOUSE CAPTURE? HOLD RMB TO LOOK.</small>
    </div>
   </div>
  </div>
  <div class="title-footer"><span>THE WALLS DON’T GET THE LAST WORD.</span><span>SINGLE PLAYER <i>·</i> LOCAL SAVE <i>·</i> ALPHA</span></div>
 </section>
 <section id="shop" class="overlay" role="dialog" aria-modal="true" aria-labelledby="exchange-title" hidden>
  <div class="exchange-shell">
   <div class="exchange-top"><div><small class="eyebrow">RUN BY MINERS. BUILT IN BLOCK 07.</small><h2 id="exchange-title">Workers’ Exchange<span>.</span></h2></div><button id="close-shop" class="button compact" aria-label="Return to mining">Back to mine <kbd>E</kbd></button></div>
   <div class="exchange-layout"><nav class="exchange-nav" aria-label="Exchange sections"><small>YOUR WAY FORWARD</small><button data-tab="mines" class="nav-button selected" aria-pressed="true"><span>01</span> Your plots</button><button data-tab="forge" class="nav-button" aria-pressed="false"><span>02</span> The forge</button><button data-tab="cargo" class="nav-button" aria-pressed="false"><span>03</span> Ore & satchel</button><div class="nav-lore">The walls belong<br>to the company.<br><strong>Your earnings don’t.</strong></div></nav>
    <div class="exchange-content">
     <div class="account-row"><div><small>AVAILABLE CREDITS</small><strong id="shop-balance"></strong></div><div><small>YOUR HAUL</small><strong id="haul-value"></strong></div><button id="sell" class="button primary"></button></div>
     <div id="pane-mines" class="exchange-pane"><div class="section-heading"><div><small class="eyebrow">YOUR CORNER OF BLOCK 07</small><h3>A little more room to grow.</h3></div></div><p class="section-help">One mine. One forest. Every expansion moves your fences and adds space permanently.</p><div class="plot-grid"><article class="plot-card"><small class="eyebrow">01 / THE DEEPWELL</small><h4 id="mine-name"></h4><p id="mine-detail"></p><div id="mine-stages" class="plot-steps"></div><b id="rank-name"></b><p id="rank-reason"></p><button id="buy-rank" class="button primary"></button></article><article class="plot-card forest-card"><small class="eyebrow">02 / TIMBER WORKS</small><h4 id="forest-name"></h4><p id="forest-detail"></p><div id="forest-stages" class="plot-steps"></div><b id="forest-next"></b><p id="forest-reason"></p><button id="buy-forest" class="button primary"></button></article></div></div>
     <div id="pane-forge" class="exchange-pane" hidden><div class="section-heading"><div><small class="eyebrow">MADE TO CUT DEEPER</small><h3>A better tool changes the shift.</h3></div></div><div class="forge-display"><div class="forge-emblem"><img id="forge-icon" alt="Next pickaxe"></div><div><small>NEXT PICKAXE</small><h4 id="upgrade-name"></h4><p id="upgrade-detail"></p><span id="forge-requirement"></span></div></div><button id="buy-pick" class="button primary"></button><div id="gear-ladder"></div><div class="axe-workshop"><img id="forge-axe-icon" alt="Next axe"><small class="eyebrow">FORESTRY TOOLS / AUTO-EQUIP AT TREES</small><h4 id="axe-name"></h4><p id="axe-detail"></p><button id="buy-axe" class="button primary"></button><div id="axe-ladder"></div></div></div>
     <div id="pane-cargo" class="exchange-pane" hidden><div class="section-heading"><div><small class="eyebrow">EVERY FRAGMENT COUNTS</small><h3>Your haul, item by item.</h3></div></div><div id="ore-list"></div><div class="satchel-upgrade"><div><small>SATCHEL WORKSHOP</small><h4>Room for another seam.</h4><p id="bag-detail"></p></div><button id="buy-bag" class="button secondary"></button></div></div>
    </div>
   </div><div class="exchange-foot"><span>Plot expansions, tools and credits save automatically.</span><button id="reset-mine" class="text-button">↻ Open a fresh seam</button></div>
  </div>
 </section>`;

 document.getElementById('buy-rank').after(document.getElementById('mine-stages'));document.getElementById('buy-forest').after(document.getElementById('forest-stages'));
 document.body.classList.add('modal-open');document.querySelector('.game-hud').setAttribute('aria-hidden','true');
 const bind=(id,fn)=>document.getElementById(id).addEventListener('click',fn);
 for(const [id,fn]of [['play',actions.play],['close-shop',actions.close],['start-exchange',actions.exchange],['sell',actions.sell],['buy-pick',actions.pick],['buy-bag',actions.bag],['buy-rank',actions.mine],['buy-forest',actions.forest],['buy-axe',actions.axe],['reset-mine',actions.reset]])bind(id,fn);
 document.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>this.select(el.dataset.tab));

 document.getElementById('mute').onchange=e=>actions.mute(e.target.checked);
 document.getElementById('volume').oninput=e=>{this.set('volume-value',e.target.value+'%');actions.volume(Number(e.target.value)/100);};
 document.getElementById('sensitivity').oninput=e=>{this.set('sensitivity-value',e.target.value+'%');actions.sensitivity(Number(e.target.value));};
 bind('open-settings',()=>this.menuPanel('settings'));bind('open-controls',()=>this.menuPanel('controls'));document.querySelectorAll('[data-menu-back]').forEach(b=>b.onclick=()=>this.menuPanel('main-actions'));
 document.addEventListener('keydown',e=>{if(e.code==='Escape'&&!document.getElementById('menu').hidden){this.menuPanel('main-actions');}});document.getElementById('motion').onchange=e=>actions.motion(e.target.checked);
 document.addEventListener('keydown',e=>{if(e.code!=='Tab')return;const modal=!document.getElementById('shop').hidden?document.getElementById('shop'):!document.getElementById('menu').hidden?document.getElementById('menu'):null;if(!modal)return;const controls=[...modal.querySelectorAll('button:not(:disabled),input')].filter(el=>el.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls.at(-1);if(e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){e.preventDefault();first.focus();}});
 }
 location(area,level){this.area=area;this.set('hud-rank','L'+level);this.set('hud-mine',area===7?'The Underblock':area===6?'The Long Room':area===8?'Dungeon Entrance':area===5?'The Iron Hall':area===4?'Timber Works':area===0?'The Deepwell':'Work Yard');this.set('hud-wing','Block 07 / Level '+level);}
 tool(kind,s,skills=this.combatSkills??{sword:0,bow:0}){this.combatSkills=skills;const key=kind+':'+(kind==='bow'?skills.bow:kind==='sword'?skills.sword:kind==='axe'?s.axe:s.pick)+':'+(kind==='sword'?skills.xp:0);if(this.toolKey===key)return;this.toolKey=key;document.querySelectorAll('[data-tool-slot]').forEach(el=>el.classList.toggle('selected',el.dataset.toolSlot===kind));if(kind==='bow'){this.set('pick-name',BOWS[skills.bow].name);this.set('pick-power',BOWS[skills.bow].damage+' damage / '+BOWS[skills.bow].draw+'s draw');document.querySelector('[data-tool-slot=bow] svg path').setAttribute('stroke','#'+BOWS[skills.bow].trim.toString(16));return;}if(kind==='sword'){this.set('pick-name',SWORDS[skills.sword].name);this.set('pick-power',swordDamage(skills.xp,skills.sword)+' damage / hold to strike');document.querySelector('[data-tool-slot=sword] svg path').setAttribute('fill','#'+SWORDS[skills.sword].color.toString(16));return;}const t=kind==='axe'?AXES[s.axe]:PICKS[s.pick];this.set('pick-name',t.name);this.set('pick-power',t.power.toFixed(2)+'× '+(kind==='axe'?'cutting':'mining')+' power');}
 wayfinding(text){this.set('prison-route',text);}
 set(id,value){document.getElementById(id).textContent=value;}
 update(s){
 if(!this.started){const first=s.mined===0&&s.money===0;this.set('start-title',first?'Your first shift.':'Your next shift.');document.getElementById('play').firstChild.textContent=first?'Start shift ':'Continue ';}
 this.state=s;const count=bagCount(s),cap=capacity(s),next=PICKS[s.pick+1],m=MINE_STAGES[s.mineLevel],f=FOREST_STAGES[s.forestLevel],mn=MINE_STAGES[s.mineLevel+1],fn=FOREST_STAGES[s.forestLevel+1],level=campLevel(s);
 if(this.iconPick!==s.pick){document.getElementById('slot-pick').src=toolIcon(s.pick);this.iconPick=s.pick;}if(this.iconAxe!==s.axe){document.getElementById('slot-axe').src=toolIcon(s.axe,'axe');this.iconAxe=s.axe;}this.set('bag-mini',count);
 if(this.nextIconPick!==s.pick){document.getElementById('forge-icon').src=toolIcon(Math.min(PICKS.length-1,s.pick+1));this.nextIconPick=s.pick;}if(this.nextIconAxe!==s.axe){document.getElementById('forge-axe-icon').src=toolIcon(Math.min(AXES.length-1,s.axe+1),'axe');this.nextIconAxe=s.axe;}
 this.set('money',fmt(s.money));this.location(this.area??-1,level);this.tool(this.area===6?'bow':(this.area===5||this.area===7)?'sword':this.area===4?'axe':'pick',s);this.set('bag-count',count+' / '+cap);this.set('bag-value',fmt(bagValue(s))+' CR haul value');document.getElementById('bag-fill').style.width=count/cap*100+'%';document.querySelector('.satchel-chip').classList.toggle('full',count>=cap-9);
 const goals=[mn&&{name:'Expand the Deepwell',cost:mn.cost},level>=2&&fn&&{name:'Expand your forest',cost:fn.cost},next&&!pickRequirement(s)&&{name:'Forge '+next.name,cost:next.cost},level>=2&&AXES[s.axe+1]&&{name:'Forge '+AXES[s.axe+1].name,cost:AXES[s.axe+1].cost}].filter(Boolean).sort((a,b)=>a.cost-b.cost),goal=goals[0];
 this.set('goal',level<2?'Level 2 / Open your forest':goal?.name??'Both plots fully grown');
 this.set('goal-detail',level<2?Math.min(s.mined,LEVEL_TWO)+' / '+LEVEL_TWO+' blocks mined':goal?fmt(s.money)+' / '+fmt(goal.cost)+' CR':'Your work. Your pace.');
 document.getElementById('rank-meter').style.width=(level<2?s.mined/LEVEL_TWO:goal?Math.min(1,s.money/goal.cost):1)*100+'%';
 this.set('start-rank','0'+level);this.set('start-mine','Your work yard');this.set('start-tool',PICKS[s.pick].name+' / '+fmt(s.money)+' credits');
 if(document.getElementById('shop').hidden)return;
 this.set('shop-balance',fmt(s.money)+' CR');this.set('haul-value',fmt(bagValue(s))+' CR');this.set('sell',count?'Sell haul +'+fmt(bagValue(s))+' CR':'Satchel empty');document.getElementById('sell').disabled=!count;
 this.set('mine-name',m.name);this.set('mine-detail',m.detail);this.set('forest-name',level<2?'Opens at level 2':f.name);this.set('forest-detail',level<2?'Mine 20 blocks. Your starter trees are waiting behind the gate.':f.detail);
 const steps=(list,owned)=>list.map((p,i)=>'<span class="'+(i<=owned?'earned':'')+'">'+(i<owned?'✓':i===owned?'●':'○')+' '+p.name+'</span>').join('');
 document.getElementById('mine-stages').innerHTML=steps(MINE_STAGES,s.mineLevel);document.getElementById('forest-stages').innerHTML=steps(FOREST_STAGES,level<2?-1:s.forestLevel);
 this.set('rank-name',mn?'NEXT / '+mn.name:'Your mine is fully expanded.');this.set('rank-reason',mn?mn.detail:'Keep digging. A fresh seam opens automatically.');this.set('buy-rank',mn?'Expand mine · '+fmt(mn.cost)+' CR':'Fully expanded');document.getElementById('buy-rank').disabled=!mn||s.money<mn.cost;
 this.set('forest-next',level<2?'LEVEL 2 / '+Math.min(s.mined,20)+' / 20 blocks':fn?'NEXT / '+fn.name:'Your forest is fully expanded.');this.set('forest-reason',level<2?'The gate opens automatically when you reach level 2.':fn?fn.detail:'Cut, collect, regrow. Your own little grove.');this.set('buy-forest',level<2?'Reach level 2':fn?'Expand forest · '+fmt(fn.cost)+' CR':'Fully expanded');document.getElementById('buy-forest').disabled=level<2||!fn||s.money<fn.cost;
 this.set('upgrade-name',next?.name??'Finest pickaxe equipped');this.set('upgrade-detail',next?PICKS[s.pick].power.toFixed(2)+'× → '+next.power.toFixed(2)+'× power. Fewer strikes through every seam.':'Your finest tool. Every upgrade earned.');this.set('forge-requirement',next?pickRequirement(s)||(s.money<next.cost?fmt(next.cost-s.money)+' more credits needed':'Ready to forge'):'Fully upgraded');this.set('buy-pick',next?'Forge pickaxe · '+fmt(next.cost)+' CR':'Best pickaxe equipped');document.getElementById('buy-pick').disabled=!next||s.money<next.cost||!!pickRequirement(s);
 document.getElementById('gear-ladder').innerHTML=PICKS.map((p,i)=>'<div class="gear-row '+(i===s.pick?'equipped':'')+'"><i style="background:#'+p.color.toString(16)+'"></i><b>'+p.name+'</b><span>'+p.power.toFixed(2)+'×</span><small>'+(i===s.pick?'EQUIPPED':i<s.pick?'FORGED':fmt(p.cost)+' CR')+'</small></div>').join('');
 const axe=AXES[s.axe+1];this.set('axe-name',axe?.name??'Gilded axe equipped');this.set('axe-detail',level<2?'Your iron hatchet comes with level 2.':axe?AXES[s.axe].power.toFixed(2)+'× → '+axe.power.toFixed(2)+'× cutting power. Fell the whole tree faster.':'Your finest axe. A few solid strikes, a full timber haul.');this.set('buy-axe',level<2?'Reach level 2':axe?'Forge axe · '+fmt(axe.cost)+' CR':'Best axe equipped');document.getElementById('buy-axe').disabled=level<2||!axe||s.money<axe.cost;
 document.getElementById('axe-ladder').innerHTML=AXES.map((a,i)=>'<div class="gear-row '+(i===s.axe?'equipped':'')+'"><b>'+a.name+'</b><span>'+a.power.toFixed(2)+'×</span><small>'+(i===s.axe?'EQUIPPED':i<s.axe?'FORGED':fmt(a.cost)+' CR')+'</small></div>').join('');
 document.getElementById('ore-list').innerHTML=BLOCKS.map((b,i)=>'<div class="ore-row">'+swatch(b)+'<div><b>'+b.name+'</b><small>'+b.value+' CR each</small></div><span>×'+s.inventory[i]+'</span><strong>'+fmt(s.inventory[i]*b.value)+' CR</strong></div>').join('');
 this.set('bag-detail',s.bagLevel<10?cap+' → '+(cap+48)+' fragments. Level '+s.bagLevel+' / 10.':'Maximum capacity: '+cap+' fragments.');this.set('buy-bag',s.bagLevel<10?'Expand · '+fmt(bagCost(s))+' CR':'Fully expanded');document.getElementById('buy-bag').disabled=s.bagLevel>=10||s.money<bagCost(s);
 }
 select(tab){this.tab=tab;document.querySelector('.exchange-content').scrollTop=0;document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.tab===tab);b.setAttribute('aria-pressed',String(b.dataset.tab===tab));});for(const name of ['mines','forge','cargo'])document.getElementById('pane-'+name).hidden=name!==tab;}
 target(name,progress,showMeter=true){document.getElementById('damage').parentElement.hidden=!showMeter;this.set('block-name',name);document.getElementById('target').hidden=!name;document.getElementById('damage').style.width=progress*100+'%';}
 pickup(name){const now=performance.now();this.pickupCount=this.lastPickup===name&&now-(this.pickupAt??0)<450?(this.pickupCount??0)+1:1;this.lastPickup=name;this.pickupAt=now;const el=document.getElementById('pickup-slip');el.textContent='+'+this.pickupCount+' '+name+' / RECOVERED';el.classList.add('visible');clearTimeout(this.pickupTimer);this.pickupTimer=setTimeout(()=>el.classList.remove('visible'),900);}

 menuPanel(name){for(const panel of ['main-actions','settings','controls'])document.getElementById('menu-'+panel).hidden=panel!==name;const area=document.getElementById('menu-'+name);area.querySelector('button,input')?.focus();}
 settings(s){document.getElementById('mute').checked=s.muted;document.getElementById('motion').checked=s.reduced;document.getElementById('volume').value=s.volume*100;document.getElementById('sensitivity').value=s.sensitivity;this.set('volume-value',Math.round(s.volume*100)+'%');this.set('sensitivity-value',s.sensitivity+'%');}
 menu(show){document.getElementById('menu').hidden=!show;document.body.classList.toggle('modal-open',show||!document.getElementById('shop').hidden);document.querySelector('.game-hud').setAttribute('aria-hidden',String(show||!document.getElementById('shop').hidden));if(show&&this.started){this.set('start-title','Paused.');document.getElementById('play').firstChild.textContent='Resume shift ';}if(!show)this.started=true;}
 shop(show){document.getElementById('shop').hidden=!show;document.body.classList.toggle('modal-open',show||!document.getElementById('menu').hidden);document.querySelector('.game-hud').setAttribute('aria-hidden',String(show||!document.getElementById('menu').hidden));}
 toast(message){this.set('toast',message);document.getElementById('toast').classList.add('visible');clearTimeout(this.timeout);this.timeout=setTimeout(()=>document.getElementById('toast').classList.remove('visible'),3000);}
}

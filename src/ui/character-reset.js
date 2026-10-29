import {requestCharacterReset} from '../game/character-reset.js?v=79.2';
export function mountCharacterReset(parent){
 const button=document.createElement('button');button.id='reset-character';button.className='menu-link';button.innerHTML='<span><b>Reset character</b><small>Fresh prisoner · restart intake</small></span><span>↺</span>';parent.append(button);
 const dialog=document.createElement('dialog');dialog.setAttribute('aria-labelledby','reset-character-title');dialog.style.cssText='max-width:420px;width:calc(100% - 48px);box-sizing:border-box;background:#242326;color:#f1d2a1;border:2px solid #b18b53;padding:28px;font-family:inherit;text-align:center';
 dialog.innerHTML='<h2 id="reset-character-title">Start a fresh prisoner?</h2><p>This resets your credits, inventory, skills, upgrades and daily progress. You will begin at intake with no tools.</p><p>Your sound and control settings stay the same.</p><p id="reset-character-error" role="alert"></p><button class="menu-play" id="confirm-character-reset">Reset and start fresh</button><button class="menu-link" id="cancel-character-reset">Keep my character</button>';
 document.body.append(dialog);button.onclick=()=>{dialog.showModal();dialog.querySelector('#cancel-character-reset').focus();};dialog.querySelector('#cancel-character-reset').onclick=()=>dialog.close();
 dialog.querySelector('#confirm-character-reset').onclick=()=>{try{requestCharacterReset(localStorage);location.reload();}catch{dialog.querySelector('#reset-character-error').textContent='Could not save the reset request. Your character has not been cleared.';}};
}

export class Input {
 constructor(canvas,onPause){
  this.sensitivity=.002;this.keys=new Set();this.held=false;this.yaw=0;this.pitch=-.12;this.locked=false;this.fallback=false;this.looking=false;this.blocking=false;this.guardMode=false;this.canvas=canvas;
  document.addEventListener('pointerlockchange',()=>{this.locked=document.pointerLockElement===canvas;if(!this.locked){this.clear();onPause();}});
  window.addEventListener('keydown',e=>{if(['Space','KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)&&this.active)e.preventDefault();this.keys.add(e.code);});
  window.addEventListener('keyup',e=>this.keys.delete(e.code));
  window.addEventListener('blur',()=>{this.clear();document.exitPointerLock?.();onPause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.clear();document.exitPointerLock?.();onPause();}});
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('mousedown',e=>{if(e.button===0&&this.active)this.held=true;if(e.button===2&&this.active){if(this.guardMode)this.blocking=true;else if(this.fallback)this.looking=true;}});
  window.addEventListener('mouseup',e=>{if(e.button===0)this.held=false;if(e.button===2){this.blocking=false;this.looking=false;}});
  window.addEventListener('mousemove',e=>{if(this.locked||this.looking||(this.fallback&&this.guardMode)){this.yaw-=e.movementX*this.sensitivity;this.pitch=Math.max(-1.5,Math.min(1.5,this.pitch-e.movementY*this.sensitivity));}});
 }
 get active(){return this.locked||this.fallback;}
 clear(){this.keys.clear();this.held=false;this.blocking=false;this.looking=false;}
 async lock(){try{await this.canvas.requestPointerLock();this.fallback=false;return true;}catch{this.fallback=true;return false;}}
}

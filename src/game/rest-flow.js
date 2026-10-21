export class RestFlow{
 constructor(){this.phase='idle';this.time=0;}
 begin(){if(this.phase!=='idle')return false;this.phase='closing';this.time=0;return true;}
 wake(){if(this.phase!=='report')return false;this.phase='waking';this.time=0;return true;}
 update(dt,reduced=false){this.time+=Math.max(0,dt);const duration=reduced?.18:this.phase==='closing'?.75:1.15;if(this.phase==='closing'&&this.time>=duration){this.phase='report';this.time=0;return 'report';}if(this.phase==='waking'&&this.time>=duration){this.phase='idle';this.time=0;return 'awake';}return null;}
 get opacity(){if(this.phase==='closing')return Math.min(1,this.time/.6);if(this.phase==='waking')return 1-Math.max(0,Math.min(1,(this.time-.25)/.8));return 0;}
}

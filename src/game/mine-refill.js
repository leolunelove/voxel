import {MINE_REFILL} from './rules.js?v=92';
// The countdown starts with excavation. Occupancy pauses the final reset,
// including menus opened inside the mine. No relocation is ever required.
export function updateMineRefill(mine,dt,occupied){
 if(dt<=0||mine.excavated.size===0)return false;
 mine.elapsed+=dt;
 if(mine.refillIn<0&&(mine.blocks.size<mine.totalBlocks*MINE_REFILL.remaining||mine.elapsed>=MINE_REFILL.seconds))mine.refillIn=MINE_REFILL.warning;
 else if(mine.refillIn>=0)mine.refillIn=Math.max(0,mine.refillIn-dt);
 mine.refillWaiting=mine.refillIn===0&&occupied;
 return mine.refillIn===0&&!occupied;
}

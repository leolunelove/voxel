import * as T from '../../vendor/three.module.js';
import {CampWorld} from './camp.js?v=82.3';
import {MINE_STAGES,FOREST_STAGES,inside,stairTop} from './camp-rules.js?v=82.3';
import {keyOf} from './world.js?v=82.3';
import {conservatoryFloor,inServiceFootprint,inConservatory,inServicePassage} from './conservatory-layout.js?v=82.3';
import {trainingAccess} from './training-layout.js?v=82.3';
import {PRISON_SPAWN,intakeFloor,yardFloor,lowerFloor,lowerFootprint,lowerPassage,dutyWing,dutyPassage,inCells} from './strict-layout.js?v=82.3';
export class StrictPrisonWorld extends CampWorld{
 constructor(scene){super(scene,{campus:'strict'});this.layout.spawn=PRISON_SPAWN;}
 syncTrainingAccess(hunt={},instant=false){this.huntProgress=hunt;for(const g of this.trainingGates??[]){g.open=g.wing.key==='dungeon'?(this.state?.mined>=120||(hunt?.dungeonXP??0)>0):trainingAccess(this.state??{mined:0},hunt,g.wing);if(instant)g.lift=g.open?5.4:0;}this.refreshBlockers();}
 setIntake(stage){this.intakeStage=stage;if(this.issuedPick)this.issuedPick.visible=stage<3;for(const g of this.intakeGates)g.bars.position.y=stage>=g.stage?5.5:0;this.refreshBlockers();}
 solid(x,y,z){if(this.dungeon&&x>45)return this.dungeon.solid(x,y,z);if(intakeFloor(x,z)||yardFloor(x,z))return y<1;
 const wing=dutyWing({x,z})??dutyPassage({x,z});if(wing)return !trainingAccess(this.state??{mined:0},this.huntProgress,wing)||y<1;
 if(lowerFootprint(x,z))return y<lowerFloor(x,z);if(lowerPassage(x,z))return y<1;
 if(inServiceFootprint(x,z)){if(this.level<2||!conservatoryFloor(x,z))return true;const forest=FOREST_STAGES[this.forestLevel??0];if(inside(x,z,FOREST_STAGES[2].bounds)&&!inside(x,z,forest.bounds))return true;if(y<1)return true;return this.treeSolid(x,y,z);}
 const mine=MINE_STAGES[this.mineLevel??0];if(inside(x,z,mine.bounds)){const top=stairTop(this.mineLevel,x,z);if(top!==null)return y<top;if(y<mine.bottom)return true;return this.blocks.has(keyOf(Math.floor(x),Math.floor(y),Math.floor(z)));}
 if(inside(x,z,MINE_STAGES[2].bounds))return true;if(x>=-19.5&&x< -1.3&&z>=-23.5&&z< -5)return y<1;return true;
 }
 treeSolid(x,y,z){return this.trees.some(t=>t.status==='ready'&&Math.abs(x-t.x)<.5&&Math.abs(z-t.z)<.5&&t.targets.some(m=>Math.abs(y-(1+m.position.y))<.5));}
 area(p){if(intakeFloor(p.x,p.z))return p.z>36?12:-1;if(inCells(p))return 13;const wing=dutyWing(p),pass=dutyPassage(p);if(wing&&trainingAccess(this.state,this.huntProgress,wing))return wing.area;if(pass&&trainingAccess(this.state,this.huntProgress,pass))return pass.passage;if(inside(p.x,p.z,MINE_STAGES[this.mineLevel].bounds))return 0;if(inConservatory(p)&&this.level>=2)return 4;if(inServicePassage(p)&&this.level>=2)return 9;return -1;}
}

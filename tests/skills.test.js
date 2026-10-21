import {test} from 'node:test';
import assert from 'node:assert/strict';
import {skillProgress,skillLedger} from '../src/game/skills.js';
import {freshState} from '../src/game/rules.js';
import {freshHunt} from '../src/game/hunt-rules.js';
test('skill progress crosses level boundaries and honours level caps',()=>{assert.equal(skillProgress(0).level,1);assert.equal(skillProgress(29).remaining,1);assert.equal(skillProgress(30).level,2);assert.equal(skillProgress(30).progress,0);assert.equal(skillProgress(120).level,3);assert.equal(skillProgress(999999,10).level,10);assert.equal(skillProgress(999999,10).maxed,true);assert.equal(skillProgress(999999,10).progress,1);});
test('skill book includes all five skills and derives work XP from saved actions without mutation',()=>{const work={...freshState(),mined:25,chopped:3},hunt={...freshHunt(),xp:48,archeryXP:6,dungeonXP:160,completions:1},before=JSON.stringify([work,hunt]),skills=skillLedger(work,hunt);assert.deepEqual(skills.map(s=>s.name),['Mining','Woodcutting','Attack','Archery','Dungeoneering']);assert.deepEqual(skills.map(s=>s.xp),[100,36,48,6,160]);assert.equal(JSON.stringify([work,hunt]),before);});

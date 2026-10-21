import {readdirSync} from 'node:fs';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
function walk(path){return readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(path,e.name)):e.name.endsWith('.js')||e.name.endsWith('.mjs')?[join(path,e.name)]:[]);}
for(const file of [...walk('src'),...walk('scripts')]){const r=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);}
const r=spawnSync(process.execPath,['--test',...walk('tests').filter(f=>f.endsWith('.test.js'))],{stdio:'inherit'});process.exit(r.status??1);

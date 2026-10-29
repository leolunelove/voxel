export const CHARACTER_KEYS=['deepwell-save','voxel-hunt','voxel-intake','voxel-shift','voxel-last-shift'];
const REQUEST='voxel-reset-request',BACKUP='voxel-character-backup';
export function requestCharacterReset(storage){
 const snapshot=Object.fromEntries(CHARACTER_KEYS.map(key=>[key,storage.getItem(key)]));
 storage.setItem(BACKUP,JSON.stringify(snapshot));
 storage.setItem(REQUEST,'fresh');
}
// Apply on boot, after the outgoing page's final shift save has finished.
export function consumeCharacterReset(storage){
 if(storage.getItem(REQUEST)!=='fresh')return false;
 for(const key of CHARACTER_KEYS)storage.removeItem(key);
 storage.removeItem(REQUEST);return true;
}

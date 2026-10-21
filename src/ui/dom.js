// Keep frequently refreshed panels stable when their displayed values are unchanged.
const previous=new WeakMap();
export function updateHTML(element,html){if(previous.get(element)===html)return false;element.innerHTML=html;previous.set(element,html);return true;}

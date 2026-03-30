const fs = require('fs');
const code = fs.readFileSync('src/app/checkout/page.jsx','utf8');
let inSingle = false, inDouble = false, inBack = false, inLineComment = false, inBlockComment = false;
const stack = [];
for (let i=0;i<code.length;i++){
  const ch = code[i];
  const next = code[i+1];
  if (inLineComment){ if (ch==='\n') inLineComment=false; continue; }
  if (inBlockComment){ if (ch==='*' && next==='/'){ inBlockComment=false; i++; } continue; }
  if (!inSingle && !inDouble && !inBack){
    if (ch==='/' && next==='/'){ inLineComment=true; i++; continue; }
    if (ch==='/' && next==='*'){ inBlockComment=true; i++; continue; }
  }
  if (!inLineComment && !inBlockComment){
    if (ch === '\\' && (inSingle||inDouble||inBack)) { i++; continue; }
    if (!inSingle && !inDouble && ch === '`') { inBack = !inBack; continue; }
    if (!inDouble && !inBack && ch === "'") { inSingle = !inSingle; continue; }
    if (!inSingle && !inBack && ch === '"') { inDouble = !inDouble; continue; }
  }
  if (inSingle||inDouble||inBack) continue;
  if (ch === '{' || ch === '(' || ch === '[') stack.push({ch, i});
  if (ch === '}' || ch === ')' || ch === ']'){
    const last = stack.pop();
    if (!last){ console.error('Unmatched closing', ch, 'at index', i); process.exit(1); }
    const pairs={'}':'{',')':'(',']':'['};
    if (pairs[ch] !== last.ch){ console.error('Mismatched', last.ch, 'vs', ch, 'at index', i); process.exit(1); }
  }
}
if (stack.length) { console.error('Unclosed brackets left:', stack); process.exit(1); }
console.log('Brackets balanced ({}[]()).');

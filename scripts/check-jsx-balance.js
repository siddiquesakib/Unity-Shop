const fs = require('fs');
const code = fs.readFileSync('src/app/checkout/page.jsx','utf8');
const tagRegex = /<([\/!]?)([A-Za-z0-9_:-]+|)([^>]*)>/g;
let match;
const stack = [];
while ((match = tagRegex.exec(code)) !== null) {
  const full = match[0];
  const slash = match[1];
  const name = match[2];
  const rest = match[3];
  const index = match.index;
  const line = code.slice(0, index).split(/\r?\n/).length;

  if (slash === '!') continue; // comment/doctype
  if (full.startsWith('</')) {
    // closing tag
    const closingName = name || 'FRAGMENT';
    if (stack.length === 0) {
      console.error(`Unmatched closing tag </${closingName}> at line ${line}`);
      process.exit(1);
    }
    const top = stack[stack.length - 1];
    if (top.name === closingName) {
      stack.pop();
    } else if (closingName === 'FRAGMENT' && top.name === 'FRAGMENT') {
      stack.pop();
    } else {
      console.error(`Tag mismatch at line ${line}: closing </${closingName}> but top of stack is <${top.name}> opened at line ${top.line}`);
      process.exit(1);
    }
  } else {
    // opening or self-closing
    const isFragment = full === '<>' || full.startsWith('<>') || full.includes('<>');
    const selfClose = full.trimEnd().endsWith('/>');
    const tagName = name || (isFragment ? 'FRAGMENT' : null);
    if (selfClose) continue;
    stack.push({ name: tagName || name, line });
  }
}
if (stack.length === 0) {
  console.log('All tags balanced (heuristic).');
} else {
  console.error('Unclosed tags remain:');
  for (const t of stack) console.error(`<${t.name}> opened at line ${t.line}`);
  process.exit(1);
}

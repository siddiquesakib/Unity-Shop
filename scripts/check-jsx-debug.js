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
  if (line < 400 || line > 480) continue; // focus
  console.log('Found', full.replace(/\n/g, '\\n'), 'at line', line);
  if (slash === '!') continue;
  const selfClose = /\/\s*>$/.test(full) || /\/\s*>\s*$/.test(full) || rest.trim().endsWith('/');
  if (full.startsWith('</')) {
    console.log(' Closing tag </' + (name || 'FRAGMENT') + '>');
    const closingName = name || 'FRAGMENT';
    if (stack.length === 0) {
      console.error(`Unmatched closing tag </${closingName}> at line ${line}`);
      process.exit(1);
    }
    const top = stack[stack.length - 1];
    if (top.name === closingName) {
      console.log('  Matches top. Pop.');
      stack.pop();
    } else if (closingName === 'FRAGMENT' && top.name === 'FRAGMENT') {
      console.log('  Matches fragment top. Pop.');
      stack.pop();
    } else {
      console.error(`Tag mismatch at line ${line}: closing </${closingName}> but top of stack is <${top.name}> opened at line ${top.line}`);
      process.exit(1);
    }
  } else {
    const tagName = name || (full.startsWith('<>') ? 'FRAGMENT' : null);
    if (selfClose) {
      console.log(' Self-closing <' + (tagName || name) + '/>');
      continue;
    }
    console.log(' Opening <' + (tagName || name) + '>');
    stack.push({ name: tagName || name, line });
  }
}
console.log('Done scan. Stack size:', stack.length);
if(stack.length) console.log('Top of stack:', stack[stack.length-1]);

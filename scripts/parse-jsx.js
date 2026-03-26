const fs = require('fs');
const parser = require('@babel/parser');
const path = 'src/app/checkout/page.jsx';
const code = fs.readFileSync(path, 'utf8');
try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
      'optionalChaining',
      'classPrivateProperties',
      'topLevelAwait',
    ],
  });
  console.log('PARSE_OK');
} catch (e) {
  console.error('ERROR:', e.message);
  if (e.loc) {
    const lines = code.split(/\r?\n/);
    const start = Math.max(0, e.loc.line - 5);
    const end = Math.min(lines.length, e.loc.line + 5);
    console.error('\n--- Codeframe ---');
    for (let i = start; i < end; i++) {
      const mark = i + 1 === e.loc.line ? '>' : ' ';
      console.error(`${mark} ${i + 1}| ${lines[i]}`);
    }
    console.error('--- End ---\n');
  }
  process.exit(1);
}

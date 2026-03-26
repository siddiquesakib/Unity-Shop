const fs = require('fs');
const parser = require('@babel/parser');
const endLine = parseInt(process.argv[2], 10) || null;
const path = 'src/app/checkout/page.jsx';
const code = fs.readFileSync(path, 'utf8');
const lines = code.split(/\r?\n/);
const slice = endLine ? lines.slice(0, endLine).join('\n') : code;
try {
  parser.parse(slice, {
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'optionalChaining', 'classPrivateProperties', 'topLevelAwait'],
  });
  console.log('PARSE_OK up to line', endLine || 'EOF');
} catch (e) {
  console.error('ERROR:', e.message);
  if (e.loc) console.error('loc:', e.loc);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const baseFile = 'en.json';
const basePath = path.join(localesDir, baseFile);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const baseData = readJson(basePath);
const baseKeys = new Set(Object.keys(baseData));
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

let hasDiscrepancies = false;

files.forEach(file => {
  if (file === baseFile) return;
  const localeData = readJson(path.join(localesDir, file));
  const localeKeys = new Set(Object.keys(localeData));

  const missing = [...baseKeys].filter(k => !localeKeys.has(k));
  const extra = [...localeKeys].filter(k => !baseKeys.has(k));

  if (missing.length || extra.length) {
    hasDiscrepancies = true;
    console.log(`\nDiscrepancies in ${file}:`);
    if (missing.length) console.log('  Missing keys:', missing.join(', '));
    if (extra.length) console.log('  Extra keys:', extra.join(', '));
  } else {
    console.log(`${file} matches ${baseFile}`);
  }
});

if (!hasDiscrepancies) {
  console.log('All locale files match', baseFile);
} else {
  process.exitCode = 1;
}

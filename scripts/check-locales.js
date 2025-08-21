const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'locales');
const baseFile = 'en.json';
const basePath = path.join(localesDir, baseFile);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      acc.push(...flattenKeys(value, fullKey));
    } else {
      acc.push(fullKey);
    }
    return acc;
  }, []);
}

const baseData = readJson(basePath);
const baseKeys = new Set(flattenKeys(baseData));
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

let hasDiscrepancies = false;

files.forEach(file => {
  if (file === baseFile) return;
  const localeData = readJson(path.join(localesDir, file));
  const localeKeys = new Set(flattenKeys(localeData));

  const missing = [...baseKeys].filter(k => !localeKeys.has(k));
  const extra = [...localeKeys].filter(k => !baseKeys.has(k));

  if (missing.length || extra.length) {
    hasDiscrepancies = true;
    console.log(`\nDiscrepancies in ${file}:`);
    if (missing.length) console.log('  Missing keys:\n    ' + missing.join('\n    '));
    if (extra.length) console.log('  Extra keys:\n    ' + extra.join('\n    '));
  } else {
    console.log(`${file} matches ${baseFile}`);
  }
});

if (!hasDiscrepancies) {
  console.log('All locale files match', baseFile);
} else {
  process.exitCode = 1;
}

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const WP_DIR = path.join(ROOT, 'whitepaper');
const tokenomics = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'tokenomics.json'), 'utf-8')
);

function replaceTokenomics(html) {
  return html.replace(/\{(supply|dao|community|team|advisors|investors|burn)\}/g, (__, key) => {
    const value = tokenomics[key];
    if (value === undefined) return '';
    return key === 'supply'
      ? Number(value).toLocaleString()
      : String(value);
  });
}

function htmlToText(html) {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || '';
}

function build() {
  const langs = fs
    .readdirSync(WP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path.join(WP_DIR, 'whitepaper.pdf')));
  langs.forEach((lang, index) => {
    const content = fs.readFileSync(
      path.join(WP_DIR, lang, 'index.html'),
      'utf-8'
    );
    const text = htmlToText(replaceTokenomics(content));
    if (index > 0) doc.addPage();
    doc.fontSize(12).text(text);
  });
  doc.end();
}

build();

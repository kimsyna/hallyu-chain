const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.join(__dirname, '..', 'index.html');
const endpoint = process.env.NEWSLETTER_API_URL || '';

if (!endpoint) {
  console.warn('NEWSLETTER_API_URL is not set. Skipping newsletter endpoint injection.');
  process.exit(0);
}

const html = fs.readFileSync(filePath, 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;
const form = document.querySelector('.newsletter-form');

if (!form) {
  console.warn('newsletter-form not found in index.html.');
  process.exit(0);
}

form.setAttribute('data-endpoint', endpoint);
fs.writeFileSync(filePath, dom.serialize());
console.log(`Injected newsletter endpoint: ${endpoint}`);

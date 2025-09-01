const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const filePath = path.join(__dirname, '..', 'index.html');
const configPath = path.join(__dirname, '..', 'newsletter.config.json');

let endpoint = process.env.NEWSLETTER_API_URL || '';

// Fall back to config file if environment variable is not set
if (!endpoint && fs.existsSync(configPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    endpoint = config.newsletterApiUrl || config.endpoint || '';
  } catch (err) {
    console.warn('Failed to parse newsletter.config.json:', err);
  }
}

if (!endpoint) {
  console.warn(
    'Newsletter endpoint not set. Skipping newsletter endpoint injection.'
  );
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

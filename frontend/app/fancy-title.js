import { h } from './lib/dom.js';

class HCFancyTitle extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'size'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.prefersReducedMotion = null;
    this.handlePreferenceChange = null;
  }
  connectedCallback() {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );
      this.handlePreferenceChange = () => this.render();
      const mql = this.prefersReducedMotion;
      if (mql.addEventListener) {
        mql.addEventListener('change', this.handlePreferenceChange);
      } else {
        mql.addListener(this.handlePreferenceChange);
      }
    }
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  disconnectedCallback() {
    const mql = this.prefersReducedMotion;
    const handler = this.handlePreferenceChange;
    if (mql && handler) {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handler);
      } else {
        mql.removeListener(handler);
      }
    }
  }
  render() {
    const text = this.getAttribute('text') || '';
    const size = this.getAttribute('size') || 'large';
    const root = this.shadowRoot;
    if (!root) return;

    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }

    const prefersReduced = this.prefersReducedMotion?.matches ?? false;
    const style = h('style');
    style.textContent = `
        :host { display: inline-block; }
        h1 {
          font-family: 'Poppins', sans-serif;
          font-size: ${size === 'medium' ? '1.8rem' : 'clamp(2.5rem, 8vw, 4rem)'};
          margin: 0;
          position: relative;
          background: linear-gradient(45deg,#ff0080,#ffcd00,#00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        h1::before, h1::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          mix-blend-mode: screen;
          animation: ${prefersReduced ? 'none' : 'glitch 2s infinite'};
        }
        h1::before { color: #f0f; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
        h1::after { color: #0ff; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }
        ${
          prefersReduced
            ? ''
            : `@keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px,-2px); }
          40% { transform: translate(2px,2px); }
          60% { transform: translate(-2px,2px); }
          80% { transform: translate(2px,-2px); }
          100% { transform: translate(0); }
        }`
        }
    `;
    root.appendChild(style);

    this.setAttribute('role', 'heading');
    this.setAttribute('aria-level', size === 'medium' ? '2' : '1');

    const h1 = h('h1', { 'data-text': text }, text);
    root.appendChild(h1);
  }
}

customElements.define('hc-fancy-title', HCFancyTitle);

export function applyFancyTitles() {
  document.querySelectorAll('h1').forEach((h1) => {
    if (h1.closest('hc-fancy-title')) return;
    const fancy = h('hc-fancy-title');
    fancy.setAttribute('size', 'large');
    fancy.setAttribute('text', h1.textContent.trim());
    if (h1.className) fancy.className = h1.className;
    if (h1.dataset.i18n) fancy.setAttribute('data-i18n', h1.dataset.i18n);
    h1.replaceWith(fancy);
  });
  document.querySelectorAll('h2').forEach((h2) => {
    if (h2.closest('hc-fancy-title')) return;
    const fancy = h('hc-fancy-title');
    fancy.setAttribute('size', 'medium');
    fancy.setAttribute('text', h2.textContent.trim());
    if (h2.className) fancy.className = h2.className;
    if (h2.id) fancy.id = h2.id;
    if (h2.dataset.i18n) fancy.setAttribute('data-i18n', h2.dataset.i18n);
    h2.replaceWith(fancy);
  });
}

window.applyFancyTitles = applyFancyTitles;

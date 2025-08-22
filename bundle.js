// src/theme.js
function isDark() {
  return document.body.classList.contains("dark-mode") || !document.body.classList.contains("light-mode") && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function updateThemeIcon(themeToggle) {
  if (!themeToggle) return;
  themeToggle.innerHTML = isDark() ? '<i class="material-symbols-outlined" aria-hidden="true">light_mode</i>' : '<i class="material-symbols-outlined" aria-hidden="true">dark_mode</i>';
}
function setTheme(theme, themeToggle = document.querySelector(".theme-toggle")) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  document.body.classList.toggle("light-mode", theme === "light");
  if (theme) {
    localStorage.setItem("theme", theme);
  }
  updateThemeIcon(themeToggle);
}
function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;
  const saved = localStorage.getItem("theme");
  if (saved) setTheme(saved, themeToggle);
  else updateThemeIcon(themeToggle);
  themeToggle.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    setTheme(next, themeToggle);
  });
}

// src/staking.js
async function loadStakingStatus() {
  const total = document.getElementById("total-staked");
  const rewards = document.getElementById("user-rewards");
  const errorEl = document.getElementById("staking-error");
  try {
    const resp = await fetch("staking.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (total) total.textContent = data.totalStaked;
    if (rewards) rewards.textContent = data.userRewards;
  } catch (err) {
    console.error("Failed to fetch staking info", err);
    if (total) total.textContent = "N/A";
    if (rewards) rewards.textContent = "N/A";
    if (errorEl) {
      errorEl.textContent = "Failed to load staking info.";
      errorEl.hidden = false;
    }
  }
}

// src/notice.js
var notice = document.createElement("div");
notice.className = "notice";
notice.setAttribute("role", "status");
notice.setAttribute("aria-live", "polite");
notice.hidden = true;
document.body.appendChild(notice);
var noticeTimeout;
function showNotice(message, delay = 4e3) {
  notice.textContent = message;
  notice.hidden = false;
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    notice.hidden = true;
    notice.textContent = "";
  }, delay);
}
if (typeof window !== "undefined") {
  window.showNotice = showNotice;
}

// src/i18n.js
var translations = {};
var DEFAULT_LANG = "en";
var FALLBACK_NOTICES = {
  notice_load_fail: "Localization failed to load.",
  notice_lang_unavailable: "Selected language unavailable. Using default language."
};
var tokenomicsCache = null;
var currentLang = localStorage.getItem("lang") || DEFAULT_LANG;
async function loadTokenomics() {
  if (!tokenomicsCache) {
    const resp = await fetch("tokenomics.json");
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    tokenomicsCache = await resp.json();
  }
  return tokenomicsCache;
}
function replaceTokenomicsPlaceholders(root, data) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    walker.currentNode.textContent = walker.currentNode.textContent.replace(
      /\{(supply|dao|community|team|advisors|investors|burn)\}/g,
      (_, key) => {
        const value = data[key];
        if (value === void 0) return "";
        return key === "supply" ? Number(value).toLocaleString() : String(value);
      }
    );
  }
}
async function applyTokenomics(root = document) {
  try {
    const data = await loadTokenomics();
    replaceTokenomicsPlaceholders(root, data);
  } catch (err) {
    console.error("Failed to load tokenomics:", err);
  }
}
async function loadLanguage(lang) {
  if (!translations[lang]) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      translations[lang] = await response.json();
    } catch (err) {
      console.error(`Failed to load language '${lang}':`, err);
      if (lang !== DEFAULT_LANG) {
        return await loadLanguage(DEFAULT_LANG);
      }
      return null;
    }
  }
  return lang;
}
function translate(key, lang = currentLang) {
  return translations[lang]?.[key] || translations[DEFAULT_LANG]?.[key] || FALLBACK_NOTICES[key] || key;
}
async function setLanguage(lang) {
  const loadedLang = await loadLanguage(lang);
  if (!loadedLang) {
    showNotice(translate("notice_load_fail", DEFAULT_LANG));
    return;
  }
  if (loadedLang !== lang) {
    showNotice(translate("notice_lang_unavailable", loadedLang));
  }
  lang = loadedLang;
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = translations[lang][key];
    if (text) {
      if (el.tagName === "HC-FANCY-TITLE") {
        el.setAttribute("text", text);
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = translations[lang][key];
    if (text) {
      el.setAttribute("placeholder", text);
    }
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    const text = translations[lang][key];
    if (text) {
      el.setAttribute("aria-label", text);
    }
  });
  document.querySelectorAll("[data-i18n-meta]").forEach((el) => {
    const key = el.getAttribute("data-i18n-meta");
    const text = translations[lang][key];
    if (text) {
      el.setAttribute("content", text);
    }
  });
  if (location.hash === "#whitepaper") {
    await loadWhitepaper(lang);
  }
  await applyTokenomics();
  const page = document.body.dataset.page;
  const titleKey = `title_${page}`;
  if (translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }
  const select = document.querySelector(".lang-select");
  if (select) select.value = lang;
}
async function loadWhitepaper(lang) {
  const container = document.getElementById("whitepaper-content");
  if (!container) return;
  try {
    const resp = await fetch(`whitepaper/${lang}/index.html`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    container.innerHTML = await resp.text();
    await applyTokenomics(container);
    window.applyFancyTitles?.();
  } catch (err) {
    console.error("Failed to load whitepaper:", err);
    container.innerHTML = "<p>Whitepaper not available.</p>";
  }
}
function handleHash() {
  if (location.hash === "#whitepaper") {
    loadWhitepaper(localStorage.getItem("lang") || currentLang);
  }
}
function initI18n() {
  setLanguage(currentLang);
  window.addEventListener("hashchange", handleHash);
  handleHash();
  const select = document.querySelector(".lang-select");
  if (select) {
    select.addEventListener("change", (e) => setLanguage(e.target.value));
  }
}
if (typeof window !== "undefined") {
  window.translate = translate;
}

// src/index.js
gsap.registerPlugin(ScrollTrigger);
var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
var prefersReducedMotion = reduceMotionQuery.matches;
function updateNavHeight() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  const height = navbar.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--nav-height", `${height}px`);
  document.documentElement.style.scrollPaddingTop = `${height}px`;
  document.body.style.paddingTop = `${height}px`;
}
updateNavHeight();
window.addEventListener("resize", updateNavHeight);
document.querySelectorAll(".material-symbols-outlined").forEach((icon) => icon.setAttribute("aria-hidden", "true"));
var HCFancyTitle = class extends HTMLElement {
  static get observedAttributes() {
    return ["text", "size"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const text = this.getAttribute("text") || "";
    const size = this.getAttribute("size") || "large";
    const root = this.shadowRoot;
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    const style = document.createElement("style");
    style.textContent = `
        :host { display: inline-block; }
        h1 {
          font-family: 'Poppins', sans-serif;
          font-size: ${size === "medium" ? "1.8rem" : "clamp(2.5rem, 8vw, 4rem)"};
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
          animation: glitch 2s infinite;
        }
        h1::before { color: #f0f; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
        h1::after { color: #0ff; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px,-2px); }
          40% { transform: translate(2px,2px); }
          60% { transform: translate(-2px,2px); }
          80% { transform: translate(2px,-2px); }
          100% { transform: translate(0); }
        }
    `;
    root.appendChild(style);
    this.setAttribute("role", "heading");
    this.setAttribute("aria-level", size === "medium" ? "2" : "1");
    const h1 = document.createElement("h1");
    h1.textContent = text;
    h1.setAttribute("data-text", text);
    root.appendChild(h1);
  }
};
customElements.define("hc-fancy-title", HCFancyTitle);
function applyFancyTitles() {
  document.querySelectorAll("h1").forEach((h1) => {
    if (h1.closest("hc-fancy-title")) return;
    const fancy2 = document.createElement("hc-fancy-title");
    fancy2.setAttribute("size", "large");
    fancy2.setAttribute("text", h1.textContent.trim());
    if (h1.className) fancy2.className = h1.className;
    if (h1.dataset.i18n) fancy2.setAttribute("data-i18n", h1.dataset.i18n);
    h1.replaceWith(fancy2);
  });
  document.querySelectorAll("h2").forEach((h2) => {
    if (h2.closest("hc-fancy-title")) return;
    const fancy2 = document.createElement("hc-fancy-title");
    fancy2.setAttribute("size", "medium");
    fancy2.setAttribute("text", h2.textContent.trim());
    if (h2.className) fancy2.className = h2.className;
    if (h2.id) fancy2.id = h2.id;
    if (h2.dataset.i18n) fancy2.setAttribute("data-i18n", h2.dataset.i18n);
    h2.replaceWith(fancy2);
  });
}
window.applyFancyTitles = applyFancyTitles;
applyFancyTitles();
function applyAnimations() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  const sections = document.querySelectorAll("section, .wp-section");
  if (!prefersReducedMotion) {
    sections.forEach((section) => {
      section.style.opacity = "";
      section.style.transform = "";
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%"
        }
      });
    });
  } else {
    sections.forEach((section) => {
      section.style.opacity = 1;
      section.style.transform = "none";
    });
  }
}
applyAnimations();
reduceMotionQuery.addEventListener("change", (event) => {
  prefersReducedMotion = event.matches;
  applyAnimations();
});
var menuToggle = document.querySelector(".menu-toggle");
var navLinks = document.getElementById("primary-navigation");
if (navLinks) navLinks.setAttribute("aria-hidden", "true");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const navbar = document.querySelector(".navbar");
    const open = navbar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
    navLinks.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) {
      const firstLink = navLinks.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      const navbar = document.querySelector(".navbar");
      navbar.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.setAttribute("aria-hidden", "true");
    }
  });
  navLinks.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const navbar = document.querySelector(".navbar");
    if (!navbar.classList.contains("open")) return;
    const links = navLinks.querySelectorAll("a");
    const firstLink = links[0];
    const lastLink = links[links.length - 1];
    if (!e.shiftKey && document.activeElement === lastLink) {
      e.preventDefault();
      firstLink.focus();
    } else if (e.shiftKey && document.activeElement === firstLink) {
      e.preventDefault();
      lastLink.focus();
    }
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const navbar = document.querySelector(".navbar");
  if (!navbar.classList.contains("open")) return;
  navbar.classList.remove("open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  if (navLinks) navLinks.setAttribute("aria-hidden", "true");
});
var hero = document.querySelector(".hero");
var fancy = document.querySelector(".hero-title");
if (hero && fancy && !prefersReducedMotion) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(fancy, {
      rotationY: x * 30,
      rotationX: -y * 30,
      ease: "power2.out"
    });
  });
  hero.addEventListener("mouseleave", () => {
    gsap.to(fancy, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });
}
var newsletterForm = document.querySelector(".newsletter-form");
var newsletterMessage = document.querySelector(".newsletter-success");
var newsletterTimeout;
if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem("lang") || DEFAULT_LANG;
    const resolvedLang = await loadLanguage(lang) || DEFAULT_LANG;
    newsletterMessage.textContent = translate("newsletter_success", resolvedLang);
    newsletterMessage.hidden = false;
    clearTimeout(newsletterTimeout);
    newsletterTimeout = setTimeout(() => {
      newsletterMessage.hidden = true;
      newsletterMessage.textContent = "";
    }, 5e3);
    newsletterForm.reset();
  });
}
var backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}
initTheme();
initI18n();
loadStakingStatus();

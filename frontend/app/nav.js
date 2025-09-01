export function initNav() {
  function updateNavHeight() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.getElementById('primary-navigation');
    if (!navbar) return;
    const height = navbar.getBoundingClientRect().height;
    const { position } = window.getComputedStyle(navbar);
    const fixed = position === 'fixed' || window.innerWidth > 768;
    const value = fixed ? `${height}px` : '0px';
    document.documentElement.style.setProperty('--nav-height', value);
    document.documentElement.style.scrollPaddingTop = value;
    document.body.style.paddingTop = value;

    if (navLinks) {
      if (window.innerWidth > 768) {
        navLinks.setAttribute('aria-hidden', 'false');
      } else if (!navbar.classList.contains('open')) {
        navLinks.setAttribute('aria-hidden', 'true');
      }
    }
  }

  updateNavHeight();
  window.addEventListener('resize', updateNavHeight);

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('primary-navigation');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const navbar = document.querySelector('.navbar');
      const open = navbar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
      navLinks.setAttribute('aria-hidden', open || window.innerWidth > 768 ? 'false' : 'true');
      if (open) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        const navbar = document.querySelector('.navbar');
        navbar.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', window.innerWidth > 768 ? 'false' : 'true');
      }
    });
    navLinks.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const navbar = document.querySelector('.navbar');
      if (!navbar.classList.contains('open')) return;
      const links = navLinks.querySelectorAll('a');
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

  function highlightActive() {
    if (!navLinks) return;
    const current = location.hash.replace(/^#\/?/, '');
    navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const path = href.replace(/^#\/?/, '');
      link.classList.toggle('active', path === current);
    });
  }

  window.addEventListener('hashchange', highlightActive);
  highlightActive();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const navbar = document.querySelector('.navbar');
    if (!navbar.classList.contains('open')) return;
    navbar.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (navLinks) navLinks.setAttribute('aria-hidden', window.innerWidth > 768 ? 'false' : 'true');
  });
}

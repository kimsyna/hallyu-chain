export function initNav() {
  function updateNavHeight() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const height = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-height', `${height}px`);
    document.documentElement.style.scrollPaddingTop = `${height}px`;
    document.body.style.paddingTop = `${height}px`;
  }

  updateNavHeight();
  window.addEventListener('resize', updateNavHeight);

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('primary-navigation');
  if (navLinks) navLinks.setAttribute('aria-hidden', 'true');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const navbar = document.querySelector('.navbar');
      const open = navbar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
      navLinks.setAttribute('aria-hidden', open ? 'false' : 'true');
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
        navLinks.setAttribute('aria-hidden', 'true');
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

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const navbar = document.querySelector('.navbar');
    if (!navbar.classList.contains('open')) return;
    navbar.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (navLinks) navLinks.setAttribute('aria-hidden', 'true');
  });
}

gsap.registerPlugin(ScrollTrigger);

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export let prefersReducedMotion = reduceMotionQuery.matches;

function applyAnimations() {
  // Remove any existing ScrollTriggers to avoid duplicates
  ScrollTrigger.getAll().forEach((t) => t.kill());

  const sections = document.querySelectorAll('section, .wp-section');
  if (!prefersReducedMotion) {
    sections.forEach((section) => {
      // Clear inline styles that may have been set when motion was reduced
      section.style.opacity = '';
      section.style.transform = '';
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      });
    });
  } else {
    // Make sure sections remain visible without animation
    sections.forEach((section) => {
      section.style.opacity = 1;
      section.style.transform = 'none';
    });
  }
}

function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  const fancy = document.querySelector('.hero-title');
  // Disable fancy hero animation if reduced motion is requested
  if (hero && fancy && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(fancy, {
        rotationY: x * 30,
        rotationX: -y * 30,
        ease: 'power2.out',
      });
    });
    hero.addEventListener('mouseleave', () => {
      gsap.to(fancy, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }
}

export function initAnimations() {
  applyAnimations();
  initHeroAnimation();
  reduceMotionQuery.addEventListener('change', (event) => {
    prefersReducedMotion = event.matches;
    applyAnimations();
    initHeroAnimation();
  });
}

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('section').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%'
    }
  });
});

const toggle = document.querySelector('.dark-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

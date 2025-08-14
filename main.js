import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

gsap.registerPlugin(ScrollTrigger);

class FeatureGrid extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('feature-grid-template');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    this.shadowRoot.querySelectorAll('.feature').forEach(el => observer.observe(el));
  }
}

customElements.define('feature-grid', FeatureGrid);

// WebGL background setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusKnotGeometry();
const material = new THREE.MeshNormalMaterial();
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

camera.position.z = 20;

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Text reveal animation
gsap.to('.reveal span', { y: 0, duration: 1.5, ease: 'power4.out' });

// Parallax background effect
gsap.to('.parallax img', {
  scrollTrigger: {
    trigger: '.parallax',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  },
  y: -100
});

// Micro interaction button
const btn = document.getElementById('actionBtn');
if (btn) {
  btn.addEventListener('click', () => {
    gsap.fromTo(btn, { scale: 1 }, { scale: 1.2, yoyo: true, repeat: 1, duration: 0.2 });
  });
}

// Dark mode toggle
const toggle = document.querySelector('.dark-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

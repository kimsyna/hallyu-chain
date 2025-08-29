import { setState } from './state/store.ts';
import { currentLang, loadLanguage, setLanguage } from './i18n.ts';

const routes: Record<string, () => Promise<HTMLElement>> = {
  '/': async () => {
    const { Hero } = await import('./views/Hero.js');
    return Hero();
  },
  '/about': async () => {
    const { About } = await import('./views/About.js');
    return About();
  },
  '/technology': async () => {
    const { Technology } = await import('./views/Technology.js');
    return Technology();
  },
  '/tokenomics': async () => {
    const { Tokenomics } = await import('./views/Tokenomics.js');
    return Tokenomics();
  },
  '/roadmap': async () => {
    const { Roadmap } = await import('./views/Roadmap.js');
    return Roadmap();
  },
  '/dao': async () => {
    const { DAO } = await import('./views/DAO.js');
    return DAO();
  },
  '/partners': async () => {
    const { Partners } = await import('./views/Partners.js');
    return Partners();
  },
  '/resources': async () => {
    const { Resources } = await import('./views/Resources.js');
    return Resources();
  },
  '/newsletter': async () => {
    const { Newsletter } = await import('./views/Newsletter.js');
    return Newsletter();
  },
  '/faq': async () => {
    const { FAQ } = await import('./views/FAQ.js');
    return FAQ();
  },
  '/corporate': async () => {
    const { Corporate } = await import('./views/Corporate.js');
    return Corporate();
  },
  '/team': async () => {
    const { Team } = await import('./views/Team.js');
    return Team();
  },
  '/whitepaper': async () => {
    const { Whitepaper } = await import('./views/Whitepaper.js');
    return Whitepaper();
  },
};

function mount(root: HTMLElement, component: HTMLElement) {
  root.innerHTML = '';
  root.appendChild(component);
}

async function render() {
  const root = document.getElementById('app');
  if (!root) return;
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const path = hash.startsWith('/') ? hash : `/${hash}`;
  const loader = routes[path] || routes['/'];
  await loadLanguage(currentLang);
  const view = await loader();
  mount(root, view);
  await setLanguage(currentLang);
  setState({ route: path });
}

export function initRouter() {
  window.addEventListener('hashchange', render);
  render();
}

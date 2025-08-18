gsap.registerPlugin(ScrollTrigger);

class KPPFancyTitle extends HTMLElement {
  static get observedAttributes() { return ['text', 'size']; }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const text = this.getAttribute('text') || '';
    const size = this.getAttribute('size') || 'large';
    this.shadowRoot.innerHTML = `
      <style>
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
      </style>
      <h1 data-text="${text}">${text}</h1>
    `;
  }
}

customElements.define('kpp-fancy-title', KPPFancyTitle);

function applyFancyTitles() {
  document.querySelectorAll('h1').forEach(h1 => {
    if (h1.closest('kpp-fancy-title')) return;
    const fancy = document.createElement('kpp-fancy-title');
    fancy.setAttribute('size', 'large');
    fancy.setAttribute('text', h1.textContent.trim());
    if (h1.className) fancy.className = h1.className;
    if (h1.dataset.i18n) fancy.setAttribute('data-i18n', h1.dataset.i18n);
    h1.replaceWith(fancy);
  });
  document.querySelectorAll('h2').forEach(h2 => {
    const fancy = document.createElement('kpp-fancy-title');
    fancy.setAttribute('size', 'medium');
    fancy.setAttribute('text', h2.textContent.trim());
    if (h2.className) fancy.className = h2.className;
    if (h2.id) fancy.id = h2.id;
    if (h2.dataset.i18n) fancy.setAttribute('data-i18n', h2.dataset.i18n);
    h2.replaceWith(fancy);
  });
}

applyFancyTitles();

document.querySelectorAll('section, .wp-section').forEach(section => {
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

const translations = {
  ko: {
    nav_about: "소개",
    nav_technology: "기술",
    nav_tokenomics: "토큰 이코노미",
    nav_roadmap: "로드맵",
    nav_resources: "참고 자료",
    nav_faq: "FAQ",
    nav_team: "팀",
    nav_whitepaper: "백서",
    hero_title: "KPOP Protocol",
    hero_subtitle: "글로벌 K-POP 커뮤니티를 위한 차세대 블록체인 네트워크",
    hero_button: "백서 다운로드",
    about_title: "프로토콜 소개",
    about_text: "KPOP Protocol(KPP)은 전 세계 K-POP 팬덤 경제를 지원하는 디지털 자산입니다. 투명하고 안전한 거래를 제공하며, 팬과 아티스트가 직접 상호작용할 수 있는 분산형 생태계를 지향합니다.",
    about_text2: "KPP는 사용자 친화적인 지갑과 크로스체인 브리지를 통해 팬들이 손쉽게 참여할 수 있는 환경을 제공합니다.",
    technology_title: "핵심 기술",
    tech_list1: "하이브리드 PoS/DPoS 합의 알고리즘",
    tech_list2: "스마트 컨트랙트 기반 팬 서비스",
    tech_list3: "양자 내성 암호화 기법",
    tokenomics_title: "토큰 이코노미",
    tok_list1: "총 발행량: 10억 KPP",
    tok_list2: "커뮤니티 리워드: 40%",
    tok_list3: "팀 및 파트너십: 20%",
    tok_list4: "생태계 개발 기금: 20%",
    tok_list5: "초기 유동성 및 마케팅: 20%",
    roadmap_title: "로드맵",
      road_q1: "2026 Q1: 메인넷 런칭",
      road_q2: "2026 Q2: 스마트 컨트랙트 플랫폼 공개",
      road_q3: "2026 Q3: 글로벌 파트너십 확대",
      road_q4: "2026 Q4: 크로스체인 브리지 구현",
      footer_text: "© 2026 KPOP Protocol. 본 사이트의 정보는 투자 권유가 아닙니다.",
    team_hero_title: "팀 소개",
    team_hero_subtitle: "KPOP Protocol을 이끄는 전문가들",
    role_ceo: "CEO & 공동 창립자",
    role_cto: "CTO",
    role_lead: "수석 블록체인 엔지니어",
    resources_title: "참고 자료",
    res_whitepaper: "백서",
    res_github: "GitHub 저장소",
    res_discord: "Discord 커뮤니티",
    faq_title: "자주 묻는 질문",
    faq_q1: "KPOP Protocol은 무엇인가요?",
    faq_a1: "KPOP Protocol은 K-POP 커뮤니티를 위한 블록체인 기반 디지털 자산입니다.",
    faq_q2: "토큰은 어떻게 얻을 수 있나요?",
    faq_a2: "공식 에어드롭이나 파트너 거래소에서 KPP 토큰을 획득할 수 있습니다.",
    team_links_title: "팀 소셜",
    team_link_twitter: "트위터",
    team_link_discord: "디스코드",
    team_link_github: "깃허브",
    title_index: "KPOP Protocol",
    title_team: "KPOP Protocol 팀",
    title_whitepaper: "KPOP Protocol 백서"
  },
  en: {
    nav_about: "About",
    nav_technology: "Tech",
    nav_tokenomics: "Tokenomics",
    nav_roadmap: "Roadmap",
    nav_resources: "Resources",
    nav_faq: "FAQ",
    nav_team: "Team",
    nav_whitepaper: "Whitepaper",
    hero_title: "KPOP Protocol",
    hero_subtitle: "A next-generation blockchain network for the global K-POP community",
    hero_button: "Download Whitepaper",
    about_title: "About the Protocol",
    about_text: "KPOP Protocol (KPP) supports the worldwide K-POP fandom economy. It offers transparent and secure transactions and aims for a decentralized ecosystem where fans and artists interact directly.",
    about_text2: "KPP offers user-friendly wallets and cross-chain bridges, enabling fans to participate with ease.",
    technology_title: "Core Technology",
    tech_list1: "Hybrid PoS/DPoS consensus algorithm",
    tech_list2: "Smart contract-based fan services",
    tech_list3: "Quantum-resistant encryption",
    tokenomics_title: "Tokenomics",
    tok_list1: "Total supply: 1 billion KPP",
    tok_list2: "Community rewards: 40%",
    tok_list3: "Team & partnerships: 20%",
    tok_list4: "Ecosystem development fund: 20%",
    tok_list5: "Initial liquidity & marketing: 20%",
    roadmap_title: "Roadmap",
      road_q1: "2026 Q1: Launch mainnet",
      road_q2: "2026 Q2: Release smart contract platform",
      road_q3: "2026 Q3: Expand global partnerships",
      road_q4: "2026 Q4: Implement cross-chain bridge",
      footer_text: "© 2026 KPOP Protocol. Information on this site is not investment advice.",
    team_hero_title: "Our Team",
    team_hero_subtitle: "Experts leading KPOP Protocol",
    role_ceo: "CEO & Co-Founder",
    role_cto: "CTO",
    role_lead: "Lead Blockchain Engineer",
    resources_title: "Resources",
    res_whitepaper: "Whitepaper",
    res_github: "GitHub Repository",
    res_discord: "Discord Community",
    faq_title: "Frequently Asked Questions",
    faq_q1: "What is KPOP Protocol?",
    faq_a1: "KPOP Protocol is a blockchain-based digital asset for the K-POP community.",
    faq_q2: "How can I obtain tokens?",
    faq_a2: "Tokens can be acquired through official airdrops or partner exchanges.",
    team_links_title: "Social Links",
    team_link_twitter: "Twitter",
    team_link_discord: "Discord",
    team_link_github: "GitHub",
    title_index: "KPOP Protocol",
    title_team: "KPOP Protocol Team",
    title_whitepaper: "KPOP Protocol Whitepaper"
    },
    zh: {
      nav_about: "介绍",
      nav_technology: "技术",
    nav_tokenomics: "代币经济",
    nav_roadmap: "路线图",
    nav_resources: "参考资料",
    nav_faq: "常见问题",
    nav_team: "团队",
    nav_whitepaper: "白皮书",
      hero_title: "KPOP Protocol",
      hero_subtitle: "面向全球K-POP社区的下一代区块链网络",
      hero_button: "下载白皮书",
      about_title: "协议介绍",
      about_text: "KPOP Protocol (KPP) 是支持全球K-POP粉丝经济的数字资产。它提供透明、安全的交易，并致力于打造粉丝与艺人直接互动的去中心化生态系统。",
      about_text2: "KPP 提供用户友好的钱包和跨链桥，帮助粉丝轻松参与生态。",
      technology_title: "核心技术",
      tech_list1: "混合 PoS/DPoS 共识算法",
      tech_list2: "基于智能合约的粉丝服务",
      tech_list3: "抗量子加密技术",
      tokenomics_title: "代币经济",
      tok_list1: "总发行量: 10亿 KPP",
      tok_list2: "社区奖励: 40%",
      tok_list3: "团队与合作伙伴: 20%",
      tok_list4: "生态发展基金: 20%",
    tok_list5: "初始流动性与营销: 20%",
    roadmap_title: "路线图",
    road_q1: "2026 Q1: 主网启动",
    road_q2: "2026 Q2: 发布智能合约平台",
    road_q3: "2026 Q3: 扩大全球合作伙伴",
    road_q4: "2026 Q4: 实现跨链桥",
    footer_text: "© 2026 KPOP Protocol. 本网站信息不构成投资建议。",
    team_hero_title: "团队介绍",
    team_hero_subtitle: "引领 KPOP Protocol 的专家",
    role_ceo: "首席执行官 & 联合创始人",
    role_cto: "首席技术官",
    role_lead: "首席区块链工程师",
    resources_title: "参考资料",
    res_whitepaper: "白皮书",
    res_github: "GitHub 仓库",
    res_discord: "Discord 社区",
    faq_title: "常见问题",
    faq_q1: "KPOP Protocol 是什么？",
    faq_a1: "KPOP Protocol 是面向 K-POP 社区的区块链数字资产。",
    faq_q2: "如何获取代币？",
    faq_a2: "可以通过官方空投或合作交易所获取 KPP 代币。",
    team_links_title: "社交链接",
    team_link_twitter: "Twitter",
    team_link_discord: "Discord",
    team_link_github: "GitHub",
    title_index: "KPOP Protocol",
    title_team: "KPOP Protocol 团队",
    title_whitepaper: "KPOP Protocol 白皮书"
  }
};

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) {
      if (el.tagName === 'KPP-FANCY-TITLE') {
        el.setAttribute('text', text);
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll('.lang-block').forEach(block => {
    block.style.display = block.dataset.lang === lang ? 'block' : 'none';
  });
  const page = document.body.dataset.page;
  const titleKey = `title_${page}`;
  if (translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }
  const select = document.querySelector('.lang-select');
  if (select) select.value = lang;
}

const currentLang = localStorage.getItem('lang') || 'ko';
setLanguage(currentLang);

const select = document.querySelector('.lang-select');
if (select) {
  select.addEventListener('change', e => setLanguage(e.target.value));
}

const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('open');
  });
}

const hero = document.querySelector('.hero');
const fancy = document.querySelector('.hero-title');
if (hero && fancy) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(fancy, { rotationY: x * 30, rotationX: -y * 30, ease: 'power2.out' });
  });
  hero.addEventListener('mouseleave', () => {
    gsap.to(fancy, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
  });
}

gsap.registerPlugin(ScrollTrigger);

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
    nav_team: "팀",
    nav_whitepaper: "백서",
    hero_title: "KPOP Protocol",
    hero_subtitle: "글로벌 K-POP 커뮤니티를 위한 차세대 블록체인 네트워크",
    hero_button: "백서 다운로드",
    about_title: "프로토콜 소개",
    about_text: "KPOP Protocol(KPP)은 전 세계 K-POP 팬덤 경제를 지원하는 디지털 자산입니다. 투명하고 안전한 거래를 제공하며, 팬과 아티스트가 직접 상호작용할 수 있는 분산형 생태계를 지향합니다.",
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
    road_q1: "2024 Q1: 메인넷 런칭",
    road_q2: "2024 Q2: 스마트 컨트랙트 플랫폼 공개",
    road_q3: "2024 Q3: 글로벌 파트너십 확대",
    road_q4: "2024 Q4: 크로스체인 브리지 구현",
    footer_text: "© 2024 KPOP Protocol. 본 사이트의 정보는 투자 권유가 아닙니다.",
    team_hero_title: "팀 소개",
    team_hero_subtitle: "KPOP Protocol을 이끄는 전문가들",
    role_ceo: "CEO & 공동 창립자",
    role_cto: "CTO",
    role_lead: "수석 블록체인 엔지니어",
    title_index: "KPOP Protocol",
    title_team: "KPOP Protocol 팀",
    title_whitepaper: "KPOP Protocol 백서"
  },
  en: {
    nav_about: "About",
    nav_technology: "Tech",
    nav_tokenomics: "Tokenomics",
    nav_roadmap: "Roadmap",
    nav_team: "Team",
    nav_whitepaper: "Whitepaper",
    hero_title: "KPOP Protocol",
    hero_subtitle: "A next-generation blockchain network for the global K-POP community",
    hero_button: "Download Whitepaper",
    about_title: "About the Protocol",
    about_text: "KPOP Protocol (KPP) supports the worldwide K-POP fandom economy. It offers transparent and secure transactions and aims for a decentralized ecosystem where fans and artists interact directly.",
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
    road_q1: "2024 Q1: Launch mainnet",
    road_q2: "2024 Q2: Release smart contract platform",
    road_q3: "2024 Q3: Expand global partnerships",
    road_q4: "2024 Q4: Implement cross-chain bridge",
    footer_text: "© 2024 KPOP Protocol. Information on this site is not investment advice.",
    team_hero_title: "Our Team",
    team_hero_subtitle: "Experts leading KPOP Protocol",
    role_ceo: "CEO & Co-Founder",
    role_cto: "CTO",
    role_lead: "Lead Blockchain Engineer",
    title_index: "KPOP Protocol",
    title_team: "KPOP Protocol Team",
    title_whitepaper: "KPOP Protocol Whitepaper"
  }
};

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) el.textContent = text;
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

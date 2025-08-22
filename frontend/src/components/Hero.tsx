function Hero() {
  return (
    <header className="hero">
      <hc-fancy-title
        className="hero-title"
        text="Hallyu Chain"
        data-i18n="hero_title"
      ></hc-fancy-title>
      <p data-i18n="hero_subtitle">
        글로벌 K-POP 커뮤니티를 위한 차세대 블록체인 네트워크
      </p>
      <a href="#whitepaper" className="btn" data-i18n="hero_button">
        백서 보기
      </a>
    </header>
  )
}

export default Hero

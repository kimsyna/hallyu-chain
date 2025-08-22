import { useRef } from 'react'
import { useNavHeight } from '../hooks/useNavHeight'
import { useTheme } from '../hooks/useTheme'
import { useNotice } from './NoticeProvider'

function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  useNavHeight(navRef)
  const { theme, toggleTheme } = useTheme()
  const showNotice = useNotice()

  const handleTheme = () => {
    toggleTheme()
    showNotice(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`)
  }

  return (
    <nav className="navbar" ref={navRef}>
      <a href="index.html" className="logo">
        <img src="/assets/hall-symbol.svg" alt="HALL logo" width="24" height="24" />
        Hallyu Chain
      </a>
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-controls="primary-navigation"
        aria-expanded="false"
      >
        <i className="material-symbols-outlined">menu</i>
      </button>
      <ul className="nav-links" id="primary-navigation">
        <li>
          <a href="#about">
            <i className="material-symbols-outlined">info</i>
            <span data-i18n="nav_about">소개</span>
          </a>
        </li>
        <li>
          <a href="#technology">
            <i className="material-symbols-outlined">memory</i>
            <span data-i18n="nav_technology">기술</span>
          </a>
        </li>
        <li>
          <a href="#tokenomics">
            <i className="material-symbols-outlined">paid</i>
            <span data-i18n="nav_tokenomics">토큰 이코노미</span>
          </a>
        </li>
        <li>
          <a href="#roadmap">
            <i className="material-symbols-outlined">map</i>
            <span data-i18n="nav_roadmap">로드맵</span>
          </a>
        </li>
        <li>
          <a href="#dao">
            <i className="material-symbols-outlined">groups</i>
            <span data-i18n="nav_dao">DAO</span>
          </a>
        </li>
        <li>
          <a href="#partners">
            <i className="material-symbols-outlined">handshake</i>
            <span data-i18n="nav_partners">파트너</span>
          </a>
        </li>
        <li>
          <a href="#resources">
            <i className="material-symbols-outlined">menu_book</i>
            <span data-i18n="nav_resources">참고 자료</span>
          </a>
        </li>
        <li>
          <a href="#newsletter">
            <i className="material-symbols-outlined">mail</i>
            <span data-i18n="nav_newsletter">뉴스레터</span>
          </a>
        </li>
        <li>
          <a href="#faq">
            <i className="material-symbols-outlined">help</i>
            <span data-i18n="nav_faq">FAQ</span>
          </a>
        </li>
        <li>
          <a href="#corporate">
            <i className="material-symbols-outlined">apartment</i>
            <span data-i18n="nav_corporate">기업 아이덴티티</span>
          </a>
        </li>
        <li>
          <a href="#team">
            <i className="material-symbols-outlined">group</i>
            <span data-i18n="nav_team">팀</span>
          </a>
        </li>
        <li>
          <a href="#whitepaper">
            <i className="material-symbols-outlined">description</i>
            <span data-i18n="nav_whitepaper">백서</span>
          </a>
        </li>
      </ul>
      <button
        className="theme-toggle"
        aria-label="테마 전환"
        data-i18n-aria-label="nav_theme"
        onClick={handleTheme}
      >
        <i className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </i>
      </button>
      <select className="lang-select" aria-label="Change language">
        <option value="ko">🇰🇷</option>
        <option value="en">🇺🇸</option>
        <option value="zh">🇨🇳</option>
        <option value="es">🇪🇸</option>
        <option value="fr">🇫🇷</option>
        <option value="de">🇩🇪</option>
        <option value="ja">🇯🇵</option>
        <option value="ru">🇷🇺</option>
        <option value="pt">🇵🇹</option>
        <option value="ar">🇸🇦</option>
        <option value="hi">🇮🇳</option>
      </select>
    </nav>
  )
}

export default Navbar

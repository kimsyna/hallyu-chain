import { useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useNavHeight } from '../hooks/useNavHeight'
import { useTheme } from '../hooks/useTheme'
import { useNotice } from './NoticeProvider'
import { useLanguage } from './LanguageProvider'

function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  useNavHeight(navRef)
  const { theme, toggleTheme } = useTheme()
  const showNotice = useNotice()
  const { t } = useTranslation()
  const { lang, changeLang } = useLanguage()

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
            <span>
              <Trans i18nKey="nav_about" />
            </span>
          </a>
        </li>
        <li>
          <a href="#technology">
            <i className="material-symbols-outlined">memory</i>
            <span>
              <Trans i18nKey="nav_technology" />
            </span>
          </a>
        </li>
        <li>
          <a href="#tokenomics">
            <i className="material-symbols-outlined">paid</i>
            <span>
              <Trans i18nKey="nav_tokenomics" />
            </span>
          </a>
        </li>
        <li>
          <a href="#roadmap">
            <i className="material-symbols-outlined">map</i>
            <span>
              <Trans i18nKey="nav_roadmap" />
            </span>
          </a>
        </li>
        <li>
          <a href="#dao">
            <i className="material-symbols-outlined">groups</i>
            <span>
              <Trans i18nKey="nav_dao" />
            </span>
          </a>
        </li>
        <li>
          <a href="#partners">
            <i className="material-symbols-outlined">handshake</i>
            <span>
              <Trans i18nKey="nav_partners" />
            </span>
          </a>
        </li>
        <li>
          <a href="#resources">
            <i className="material-symbols-outlined">menu_book</i>
            <span>
              <Trans i18nKey="nav_resources" />
            </span>
          </a>
        </li>
        <li>
          <a href="#newsletter">
            <i className="material-symbols-outlined">mail</i>
            <span>
              <Trans i18nKey="nav_newsletter" />
            </span>
          </a>
        </li>
        <li>
          <a href="#faq">
            <i className="material-symbols-outlined">help</i>
            <span>
              <Trans i18nKey="nav_faq" />
            </span>
          </a>
        </li>
        <li>
          <a href="#corporate">
            <i className="material-symbols-outlined">apartment</i>
            <span>
              <Trans i18nKey="nav_corporate" />
            </span>
          </a>
        </li>
        <li>
          <a href="#team">
            <i className="material-symbols-outlined">group</i>
            <span>
              <Trans i18nKey="nav_team" />
            </span>
          </a>
        </li>
        <li>
          <a href="#whitepaper">
            <i className="material-symbols-outlined">description</i>
            <span>
              <Trans i18nKey="nav_whitepaper" />
            </span>
          </a>
        </li>
      </ul>
      <button
        className="theme-toggle"
        aria-label={t('nav_theme')}
        onClick={handleTheme}
      >
        <i className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </i>
      </button>
      <select
        className="lang-select"
        aria-label="Change language"
        value={lang}
        onChange={(e) => changeLang(e.target.value)}
      >
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

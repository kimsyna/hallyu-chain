import { Trans } from 'react-i18next'

function Corporate() {
  return (
    <section id="corporate">
      <h2>
        <Trans i18nKey="corporate_hero_title" />
      </h2>
      <p>
        <Trans i18nKey="corporate_hero_subtitle" />
      </p>
      <div>
        <h3>
          <Trans i18nKey="corporate_brand_title" />
        </h3>
        <p>
          <Trans i18nKey="corporate_brand_text" />
        </p>
      </div>
      <div>
        <h3>
          <Trans i18nKey="corporate_mission_title" />
        </h3>
        <p>
          <Trans i18nKey="corporate_mission_text" />
        </p>
      </div>
      <div>
        <h3>
          <Trans i18nKey="corporate_vision_title" />
        </h3>
        <p>
          <Trans i18nKey="corporate_vision_text" />
        </p>
      </div>
      <div>
        <h3>
          <Trans i18nKey="corporate_voice_title" />
        </h3>
        <p>
          <Trans i18nKey="corporate_voice_text" />
        </p>
      </div>
      <div>
        <h3>
          <Trans i18nKey="corporate_color_title" />
        </h3>
        <ul className="color-grid">
          <li>
            <span className="swatch" style={{ background: '#ff4081' }} />
            <p>
              <Trans i18nKey="corporate_color_accent" />
            </p>
          </li>
          <li>
            <span className="swatch" style={{ background: '#ffffff' }} />
            <p>
              <Trans i18nKey="corporate_color_bg" />
            </p>
          </li>
          <li>
            <span className="swatch" style={{ background: '#222222' }} />
            <p>
              <Trans i18nKey="corporate_color_fg" />
            </p>
          </li>
        </ul>
      </div>
      <div className="logo-guidelines">
        <h3>
          <Trans i18nKey="corporate_logo_title" />
        </h3>
        <div className="logo-sample">
          <img src="./assets/hall-symbol.svg" alt="" data-i18n-alt="corporate_logo_alt" />
        </div>
        <p>
          <Trans i18nKey="corporate_logo_usage" />
        </p>
        <ul>
          <li>
            <Trans i18nKey="corporate_logo_clearspace" />
          </li>
          <li>
            <Trans i18nKey="corporate_logo_minimum" />
          </li>
          <li>
            <Trans i18nKey="corporate_logo_background" />
          </li>
        </ul>
      </div>
      <div>
        <h3>
          <Trans i18nKey="corporate_typography_title" />
        </h3>
        <p>
          <Trans i18nKey="corporate_typography_heading" />
        </p>
        <p>
          <Trans i18nKey="corporate_typography_body" />
        </p>
      </div>
    </section>
  )
}

export default Corporate

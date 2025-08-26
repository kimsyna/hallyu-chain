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

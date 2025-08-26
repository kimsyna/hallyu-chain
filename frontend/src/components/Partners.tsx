import { Trans } from 'react-i18next'

function Partners() {
  return (
    <section id="partners">
      <h2>
        <Trans i18nKey="partners_title" />
      </h2>
      <div className="logo-grid">
        <div className="logo-item">
          <i className="material-symbols-outlined">music_note</i>
          <span>
            <Trans i18nKey="partner1" />
          </span>
        </div>
        <div className="logo-item">
          <i className="material-symbols-outlined">sports_esports</i>
          <span>
            <Trans i18nKey="partner2" />
          </span>
        </div>
        <div className="logo-item">
          <i className="material-symbols-outlined">movie</i>
          <span>
            <Trans i18nKey="partner3" />
          </span>
        </div>
      </div>
    </section>
  )
}

export default Partners

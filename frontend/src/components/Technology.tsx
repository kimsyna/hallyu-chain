import { Trans } from 'react-i18next'

function Technology() {
  return (
    <section id="technology">
      <h2>
        <Trans i18nKey="technology_title" />
      </h2>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined" aria-hidden="true">layers</i>
          <span>
            <Trans i18nKey="tech_list1" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined" aria-hidden="true">gavel</i>
          <span>
            <Trans i18nKey="tech_list2" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined" aria-hidden="true">shield</i>
          <span>
            <Trans i18nKey="tech_list3" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined" aria-hidden="true">compare_arrows</i>
          <span>
            <Trans i18nKey="tech_list4" />
          </span>
        </li>
      </ul>
      <h2>
        <Trans i18nKey="features_title" />
      </h2>
      <div className="card-grid">
        <div className="card">
          <i className="material-symbols-outlined" aria-hidden="true">group</i>
          <h3>
            <Trans i18nKey="feat1_title" />
          </h3>
          <p>
            <Trans i18nKey="feat1_text" />
          </p>
        </div>
        <div className="card">
          <i className="material-symbols-outlined" aria-hidden="true">volunteer_activism</i>
          <h3>
            <Trans i18nKey="feat2_title" />
          </h3>
          <p>
            <Trans i18nKey="feat2_text" />
          </p>
        </div>
        <div className="card">
          <i className="material-symbols-outlined" aria-hidden="true">public</i>
          <h3>
            <Trans i18nKey="feat3_title" />
          </h3>
          <p>
            <Trans i18nKey="feat3_text" />
          </p>
        </div>
        <div className="card">
          <i className="material-symbols-outlined" aria-hidden="true">token</i>
          <h3>
            <Trans i18nKey="feat4_title" />
          </h3>
          <p>
            <Trans i18nKey="feat4_text" />
          </p>
        </div>
      </div>
    </section>
  )
}

export default Technology

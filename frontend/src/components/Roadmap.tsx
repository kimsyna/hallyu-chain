import { Trans } from 'react-i18next'

function Roadmap() {
  return (
    <section id="roadmap">
      <h2>
        <Trans i18nKey="roadmap_title" />
      </h2>
      <ol className="icon-list">
        <li>
          <i className="material-symbols-outlined">rocket_launch</i>
          <span>
            <Trans i18nKey="road_q1" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">code</i>
          <span>
            <Trans i18nKey="road_q2" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">handshake</i>
          <span>
            <Trans i18nKey="road_q3" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">link</i>
          <span>
            <Trans i18nKey="road_q4" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">storefront</i>
          <span>
            <Trans i18nKey="road_q5" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">smartphone</i>
          <span>
            <Trans i18nKey="road_q6" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">savings</i>
          <span>
            <Trans i18nKey="road_q7" />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">how_to_vote</i>
          <span>
            <Trans i18nKey="road_q8" />
          </span>
        </li>
      </ol>
    </section>
  )
}

export default Roadmap

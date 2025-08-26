import { Trans } from 'react-i18next'

function Whitepaper() {
  return (
    <section id="whitepaper">
      <h2>
        <Trans i18nKey="nav_whitepaper" />
      </h2>
      <p>
        <Trans i18nKey="notice_whitepaper_unavailable" />
      </p>
    </section>
  )
}

export default Whitepaper

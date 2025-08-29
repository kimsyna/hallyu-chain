import { Trans } from 'react-i18next'

function FAQ() {
  return (
    <section id="faq">
      <h2>
        <Trans i18nKey="faq_title" />
      </h2>
      <details>
        <summary>
          <Trans i18nKey="faq_q1" />
        </summary>
        <p>
          <Trans i18nKey="faq_a1" />
        </p>
      </details>
      <details>
        <summary>
          <Trans i18nKey="faq_q2" />
        </summary>
        <p>
          <Trans i18nKey="faq_a2" />
        </p>
      </details>
      <details>
        <summary>
          <Trans i18nKey="faq_q3" />
        </summary>
        <p>
          <Trans i18nKey="faq_a3" components={{ a: <a href="#staking" /> }} />
        </p>
      </details>
      <details>
        <summary>
          <Trans i18nKey="faq_q8" />
        </summary>
        <p>
          <Trans i18nKey="faq_a8" />
        </p>
      </details>
      <details>
        <summary>
          <Trans i18nKey="faq_q9" />
        </summary>
        <p>
          <Trans i18nKey="faq_a9" />
        </p>
      </details>
      <details>
        <summary>
          <Trans i18nKey="faq_q10" />
        </summary>
        <p>
          <Trans i18nKey="faq_a10" />
        </p>
      </details>
    </section>
  )
}

export default FAQ

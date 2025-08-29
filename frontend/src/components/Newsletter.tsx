import { Trans, useTranslation } from 'react-i18next'

function Newsletter() {
  const { t } = useTranslation()
  return (
    <section id="newsletter">
      <h2>
        <Trans i18nKey="newsletter_title" />
      </h2>
      <p>
        <Trans i18nKey="newsletter_text" />
      </p>
      <form className="newsletter-form">
        <input
          type="email"
          required
          placeholder={t('newsletter_placeholder')}
          aria-label={t('newsletter_placeholder')}
        />
        <button type="submit" className="btn">
          <Trans i18nKey="newsletter_button" />
        </button>
      </form>
    </section>
  )
}

export default Newsletter

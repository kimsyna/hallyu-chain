import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import createDOMPurify from 'dompurify'

const DOMPurify = createDOMPurify(window)

function Whitepaper() {
  const { i18n, t } = useTranslation()
  const [html, setHtml] = useState<string | null>()

  useEffect(() => {
    fetch(`whitepaper/${i18n.language}/index.html`)
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((data) => {
        setHtml(DOMPurify.sanitize(data))
      })
      .catch(() => {
        setHtml(null)
      })
  }, [i18n.language])

  return (
    <section id="whitepaper">
      <h2>
        <Trans i18nKey="nav_whitepaper" />
      </h2>
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : html === null ? (
        <p>{t('notice_whitepaper_unavailable')}</p>
      ) : null}
    </section>
  )
}

export default Whitepaper

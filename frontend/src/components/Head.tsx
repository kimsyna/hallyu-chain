import { Helmet } from 'react-helmet'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function Head() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <Helmet>
      <title>{t('title_index')}</title>
      <meta name="description" content={t('hero_subtitle')} />
      <meta property="og:title" content={t('title_index')} />
      <meta property="og:description" content={t('hero_subtitle')} />
      <meta name="twitter:title" content={t('title_index')} />
      <meta name="twitter:description" content={t('hero_subtitle')} />
      <link rel="icon" type="image/svg+xml" href="./assets/hall-symbol.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto&family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  )
}

export default Head

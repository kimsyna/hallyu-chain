import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const translationFiles = import.meta.glob('../../locales/*.json')

const backend = {
  type: 'backend' as const,
  init() {},
  read(language: string, _ns: string, callback: (err: unknown, data: unknown) => void) {
    const loader = translationFiles[`../../locales/${language}.json`]
    if (!loader) {
      callback(new Error(`Missing translation for ${language}`), null)
      return
    }
    loader()
      .then((mod: any) => callback(null, mod.default))
      .catch((err: unknown) => callback(err, null))
  },
}

void i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n

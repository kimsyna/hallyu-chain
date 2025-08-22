import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ar from '../../locales/ar.json'
import de from '../../locales/de.json'
import en from '../../locales/en.json'
import es from '../../locales/es.json'
import fr from '../../locales/fr.json'
import hi from '../../locales/hi.json'
import ja from '../../locales/ja.json'
import ko from '../../locales/ko.json'
import pt from '../../locales/pt.json'
import ru from '../../locales/ru.json'
import zh from '../../locales/zh.json'

const resources = {
  ar: { translation: ar },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  hi: { translation: hi },
  ja: { translation: ja },
  ko: { translation: ko },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

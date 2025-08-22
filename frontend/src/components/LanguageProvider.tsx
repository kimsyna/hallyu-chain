import { createContext, useContext, useState, type ReactNode } from 'react'
import i18n from '../i18n'

interface LangContext {
  lang: string
  changeLang: (lng: string) => void
}

const LanguageContext = createContext<LangContext>({ lang: i18n.language, changeLang: () => {} })

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState(i18n.language)

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng)
    setLang(lng)
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

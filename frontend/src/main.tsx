import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './i18n'
import App from './App'
import { NoticeProvider } from './components/NoticeProvider'
import { LanguageProvider } from './components/LanguageProvider'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <LanguageProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </LanguageProvider>
  </StrictMode>,
)

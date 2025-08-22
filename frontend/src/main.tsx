import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { NoticeProvider } from './components/NoticeProvider'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <NoticeProvider>
      <App />
    </NoticeProvider>
  </StrictMode>,
)

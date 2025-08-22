import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './NoticeProvider.module.css'

const NoticeContext = createContext<(msg: string, delay?: number) => void>(() => {})

export function useNotice() {
  return useContext(NoticeContext)
}

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showNotice = useCallback((msg: string, delay = 4000) => {
    setMessage(msg)
    if (delay > 0) {
      setTimeout(() => setMessage(null), delay)
    }
  }, [])

  return (
    <NoticeContext.Provider value={showNotice}>
      {children}
      {createPortal(
        <div className={styles.notice} role="status" aria-live="polite" hidden={message === null}>
          {message}
        </div>,
        document.body
      )}
    </NoticeContext.Provider>
  )
}

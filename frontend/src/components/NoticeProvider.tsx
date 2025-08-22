import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './NoticeProvider.module.css'

const NoticeContext = createContext<(msg: string, delay?: number) => void>(() => {})

export function useNotice() {
  return useContext(NoticeContext)
}

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timeoutId = useRef<number | null>(null)

  const showNotice = useCallback((msg: string, delay = 4000) => {
    setMessage(msg)
    if (delay > 0) {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }
      timeoutId.current = window.setTimeout(() => setMessage(null), delay)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }
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

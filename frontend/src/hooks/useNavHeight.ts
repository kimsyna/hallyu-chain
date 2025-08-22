import { useEffect } from 'react'

export function useNavHeight(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const update = () => {
      const nav = ref.current
      if (!nav) return
      const height = nav.getBoundingClientRect().height
      document.documentElement.style.setProperty('--nav-height', `${height}px`)
      document.documentElement.style.scrollPaddingTop = `${height}px`
      document.body.style.paddingTop = `${height}px`
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [ref])
}

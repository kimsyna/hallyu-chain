import { useEffect } from 'react'

export function useNavHeight(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const update = () => {
      const nav = ref.current
      if (!nav) return
      const height = nav.getBoundingClientRect().height
      const { position } = window.getComputedStyle(nav)
      const fixed = position === 'fixed' || window.innerWidth > 768
      const value = fixed ? `${height}px` : '0px'
      document.documentElement.style.setProperty('--nav-height', value)
      document.documentElement.style.scrollPaddingTop = value
      document.body.style.paddingTop = value
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [ref])
}

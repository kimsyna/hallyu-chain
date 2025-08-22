import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const title = titleRef.current
    if (!hero || !title) return

    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(title, { rotationY: x * 30, rotationX: -y * 30, ease: 'power2.out' })
    }
    const handleLeave = () => {
      gsap.to(title, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
    hero.addEventListener('mousemove', handleMove)
    hero.addEventListener('mouseleave', handleLeave)
    return () => {
      hero.removeEventListener('mousemove', handleMove)
      hero.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <header className="hero" ref={heroRef}>
      <hc-fancy-title
        className="hero-title"
        ref={titleRef as any}
        text="Hallyu Chain"
        data-i18n="hero_title"
      ></hc-fancy-title>
      <p data-i18n="hero_subtitle">
        글로벌 K-POP 커뮤니티를 위한 차세대 블록체인 네트워크
      </p>
      <a href="#whitepaper" className="btn" data-i18n="hero_button">
        백서 보기
      </a>
    </header>
  )
}

export default Hero

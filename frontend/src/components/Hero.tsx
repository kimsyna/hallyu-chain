import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslation, Trans } from 'react-i18next'
import styles from './Hero.module.css'

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLElement>(null)
  const { t } = useTranslation()

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
    <header className={styles.hero} ref={heroRef}>
      <hc-fancy-title
        className={styles.heroTitle}
        ref={titleRef as any}
        text={t('hero_title')}
      ></hc-fancy-title>
      <p>
        <Trans i18nKey="hero_subtitle" />
      </p>
      <a href="#whitepaper" className={styles.btn}>
        <Trans i18nKey="hero_button" />
      </a>
    </header>
  )
}

export default Hero

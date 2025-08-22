import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Tokenomics() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="tokenomics" ref={sectionRef}>
      <h2 data-i18n="tokenomics_title">토큰 이코노미</h2>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined">pie_chart</i>
          <span data-i18n="tok_list1">총 발행량: {'{supply}'} HALL</span>
        </li>
        <li>
          <i className="material-symbols-outlined">account_balance</i>
          <span data-i18n="tok_list2">DAO 재무금고: {'{dao}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">card_giftcard</i>
          <span data-i18n="tok_list3">커뮤니티 리워드: {'{community}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">groups</i>
          <span data-i18n="tok_list4">팀: {'{team}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">support_agent</i>
          <span data-i18n="tok_list5">자문단: {'{advisors}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">trending_up</i>
          <span data-i18n="tok_list6">투자자: {'{investors}'}%</span>
        </li>
      </ul>
    </section>
  )
}

export default Tokenomics

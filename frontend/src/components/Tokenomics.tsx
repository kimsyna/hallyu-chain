import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Trans } from 'react-i18next'
import tok from '../../../tokenomics.json'

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
      <h2>
        <Trans i18nKey="tokenomics_title" />
      </h2>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined">pie_chart</i>
          <span>
            <Trans i18nKey="tok_list1" values={{ supply: tok.supply }} />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">account_balance</i>
          <span>
            <Trans i18nKey="tok_list2" values={{ dao: tok.dao }} />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">card_giftcard</i>
          <span>
            <Trans i18nKey="tok_list3" values={{ community: tok.community }} />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">groups</i>
          <span>
            <Trans i18nKey="tok_list4" values={{ team: tok.team }} />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">support_agent</i>
          <span>
            <Trans i18nKey="tok_list5" values={{ advisors: tok.advisors }} />
          </span>
        </li>
        <li>
          <i className="material-symbols-outlined">trending_up</i>
          <span>
            <Trans i18nKey="tok_list6" values={{ investors: tok.investors }} />
          </span>
        </li>
      </ul>
    </section>
  )
}

export default Tokenomics

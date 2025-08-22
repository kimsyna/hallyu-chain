import { useBackToTop } from '../hooks/useBackToTop'
import { useTranslation } from 'react-i18next'
import styles from './BackToTop.module.css'

function BackToTop() {
  const { visible, scrollToTop } = useBackToTop()
  const { t } = useTranslation()
  return (
    <button
      className={`${styles.backToTop} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label={t('back_to_top')}
    >
      <i className="material-symbols-outlined" aria-hidden="true">
        arrow_upward
      </i>
    </button>
  )
}

export default BackToTop

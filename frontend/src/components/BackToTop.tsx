import { useBackToTop } from '../hooks/useBackToTop'

function BackToTop() {
  const { visible, scrollToTop } = useBackToTop()
  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <i className="material-symbols-outlined" aria-hidden="true">
        arrow_upward
      </i>
    </button>
  )
}

export default BackToTop

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../Navbar'

const mockToggleTheme = vi.fn()
const mockShowNotice = vi.fn()
const mockChangeLang = vi.fn()

vi.mock('../../hooks/useNavHeight', () => ({
  useNavHeight: vi.fn(),
}))

vi.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: mockToggleTheme }),
}))

vi.mock('../NoticeProvider', () => ({
  useNotice: () => mockShowNotice,
}))

vi.mock('../LanguageProvider', () => ({
  useLanguage: () => ({ lang: 'en', changeLang: mockChangeLang }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { mode?: string }) =>
      key === 'theme_switched' ? `Switched to ${opts?.mode} mode` : key,
  }),
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}))

describe('Navbar', () => {
  it('toggles navigation menu', () => {
    render(<Navbar />)
    const toggle = screen.getByLabelText(/toggle navigation/i)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles theme and shows notice', () => {
    render(<Navbar />)
    const button = screen.getByLabelText('nav_theme')
    fireEvent.click(button)
    expect(mockToggleTheme).toHaveBeenCalled()
    expect(mockShowNotice).toHaveBeenCalledWith('Switched to dark mode')
  })
})

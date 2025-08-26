import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Tokenomics from '../Tokenomics'

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: (cb: Function) => {
      cb()
      return { revert: vi.fn() }
    },
    from: vi.fn(),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

vi.mock('react-i18next', () => ({
  Trans: ({ i18nKey, values }: any) => {
    if (values) {
      return `${i18nKey} ${Object.values(values).join(' ')}`
    }
    return i18nKey
  },
}))

describe('Tokenomics', () => {
  it('renders heading and list items', () => {
    render(<Tokenomics />)
    expect(screen.getByText('tokenomics_title')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(7)
  })
})

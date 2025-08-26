import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Tokenomics from '../Tokenomics'
import tok from '../../../../tokenomics.json'

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
  it('renders tokenomics values', () => {
    render(<Tokenomics />)
    expect(screen.getByText('tokenomics_title')).toBeInTheDocument()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(7)
    expect(screen.getByText(`tok_list1 ${tok.supply}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list2 ${tok.dao}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list3 ${tok.community}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list4 ${tok.team}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list5 ${tok.advisors}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list6 ${tok.investors}`)).toBeInTheDocument()
    expect(screen.getByText(`tok_list7 ${tok.burn}`)).toBeInTheDocument()
  })
})

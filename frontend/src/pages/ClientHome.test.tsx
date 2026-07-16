import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppProviders } from '../app/providers'
import { ClientHome } from './ClientHome'

describe('ClientHome', () => {
  it('identifica a área do cliente e apresenta a navegação principal', () => {
    render(
      <MemoryRouter>
        <AppProviders>
          <ClientHome />
        </AppProviders>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /seu horário, do seu jeito/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /área administrativa/i }),
    ).toHaveAttribute('href', '/admin')
  })
})

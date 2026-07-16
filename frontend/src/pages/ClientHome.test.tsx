import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AppProviders } from '../app/providers'
import { normalizeAndFormatPhone } from '../features/client-scheduling/phone'
import { ClientHome } from './ClientHome'

function renderClientHome(scenario?: string) {
  window.history.pushState({}, '', scenario ? `/?scenario=${scenario}` : '/')
  return render(
    <AppProviders>
      <ClientHome />
    </AppProviders>,
  )
}

function availableDate() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function reachSchedule() {
  const service = await screen.findByRole('button', {
    name: /corte essencial/i,
  })
  fireEvent.click(service)
  fireEvent.click(
    screen.getByRole('button', { name: /escolher data e horário/i }),
  )
  fireEvent.change(screen.getByLabelText(/data do atendimento/i), {
    target: { value: availableDate() },
  })
  await screen.findByRole('button', { name: /09:00 disponível/i })
}

async function reachDetails() {
  await reachSchedule()
  fireEvent.click(screen.getByRole('button', { name: /09:00 disponível/i }))
  fireEvent.click(screen.getByRole('button', { name: /informar meus dados/i }))
}

describe('ClientHome', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('avança da escolha de serviço até os dados pessoais', async () => {
    renderClientHome()

    await reachDetails()

    expect(
      screen.getByRole('heading', { name: /só falta conhecer você/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
  })

  it('mantém um horário indisponível desabilitado', async () => {
    renderClientHome()
    await reachSchedule()

    const unavailable = screen.getByRole('button', {
      name: /10:00 indisponível/i,
    })
    expect(unavailable).toBeDisabled()

    fireEvent.click(unavailable)
    fireEvent.click(
      screen.getByRole('button', { name: /informar meus dados/i }),
    )
    expect(
      screen.getByText(/escolha um horário disponível para continuar/i),
    ).toBeInTheDocument()
  })

  it('mostra mensagens próximas aos dados pessoais inválidos', async () => {
    renderClientHome()
    await reachDetails()

    fireEvent.change(screen.getByLabelText(/telefone com ddd/i), {
      target: { value: '119999999' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /revisar agendamento/i }),
    )

    expect(
      screen.getByText(/informe seu nome com pelo menos 2 caracteres/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/informe um telefone com ddd/i)).toBeInTheDocument()
  })

  it('remove letras, limita e formata o telefone digitado ou colado', async () => {
    renderClientHome()
    await reachDetails()

    const phone = screen.getByLabelText(/telefone com ddd/i)

    fireEvent.change(phone, { target: { value: 'abc11x9999y9999' } })
    expect(phone).toHaveValue('(11) 9999-9999')

    fireEvent.change(phone, { target: { value: '11 99999-9999 letras 8765' } })
    expect(phone).toHaveValue('(11) 99999-9999')
  })

  it('recupera o conflito preservando serviço e dados pessoais', async () => {
    renderClientHome('conflict')
    await reachDetails()

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Marina Souza' },
    })
    fireEvent.change(screen.getByLabelText(/telefone com ddd/i), {
      target: { value: '(11) 99999-9999' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /revisar agendamento/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /confirmar agendamento/i }),
    )

    expect(
      await screen.findByRole('heading', {
        name: /esse horário acabou de ser ocupado/i,
      }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /escolher outro horário/i }),
    )
    expect(
      screen.getByText(/o horário anterior ficou indisponível/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /09:00 indisponível/i }),
    ).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /11:00 disponível/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /informar meus dados/i }),
    )
    await waitFor(() => {
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue(
        'Marina Souza',
      )
      expect(screen.getByLabelText(/telefone com ddd/i)).toHaveValue(
        '(11) 99999-9999',
      )
    })
  })
})

describe('normalizeAndFormatPhone', () => {
  it('formata progressivamente telefones de 10 e 11 dígitos', () => {
    expect(normalizeAndFormatPhone('1')).toBe('(1')
    expect(normalizeAndFormatPhone('11')).toBe('(11')
    expect(normalizeAndFormatPhone('119')).toBe('(11) 9')
    expect(normalizeAndFormatPhone('1199999999')).toBe('(11) 9999-9999')
    expect(normalizeAndFormatPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('aceita somente números e limita o resultado a 11 dígitos', () => {
    expect(normalizeAndFormatPhone('tel: (11) abc 99999-9999-1234')).toBe(
      '(11) 99999-9999',
    )
  })
})

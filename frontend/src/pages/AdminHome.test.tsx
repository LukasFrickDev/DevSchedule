import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppProviders } from '../app/providers'
import { resetAdminAppointmentsFixture } from '../api/admin/fixtureAdminApi'
import { AdminHome } from './AdminHome'

function renderAdminHome(scenario?: string) {
  window.history.pushState(
    {},
    '',
    scenario ? `/admin?scenario=${scenario}` : '/admin',
  )
  return render(
    <AppProviders>
      <MemoryRouter
        initialEntries={[scenario ? `/admin?scenario=${scenario}` : '/admin']}
      >
        <AdminHome />
      </MemoryRouter>
    </AppProviders>,
  )
}

async function login() {
  fireEvent.change(screen.getByLabelText('Usuário'), {
    target: { value: 'admin' },
  })
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: 'devschedule' },
  })
  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }))
  await screen.findByRole('heading', { name: /agenda administrativa/i })
}

async function showAllAppointments() {
  fireEvent.click(screen.getByRole('button', { name: /limpar filtro/i }))
  await screen.findByText('Ana Lima')
}

function rowFor(customerName: string) {
  return screen.getByText(customerName).closest('tr') as HTMLTableRowElement
}

async function chooseStatus(customerName: string, status: string) {
  const select = screen.getByLabelText(`Novo status de ${customerName}`)
  fireEvent.change(select, { target: { value: status } })
  fireEvent.click(
    within(rowFor(customerName)).getByRole('button', {
      name: /aplicar status/i,
    }),
  )
}

describe('AdminHome', () => {
  beforeEach(() => resetAdminAppointmentsFixture())

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('faz login com as credenciais válidas e renderiza dados essenciais', async () => {
    renderAdminHome()

    expect(screen.getByText('admin')).toBeInTheDocument()
    expect(screen.getByText('devschedule')).toBeInTheDocument()
    await login()
    await showAllAppointments()

    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
    const row = rowFor('Ana Lima')
    expect(within(row).getByText('(11) 98765-4321')).toBeInTheDocument()
    expect(within(row).getByText('Mentoria individual')).toBeInTheDocument()
    expect(
      within(row).getByText('Agendado', { selector: 'span' }),
    ).toBeInTheDocument()
  })

  it('informa credenciais inválidas', async () => {
    renderAdminHome()
    fireEvent.change(screen.getByLabelText('Usuário'), {
      target: { value: 'outro' },
    })
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'incorreta' },
    })
    fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Usuário ou senha inválidos.',
    )
  })

  it('mostra o cenário vazio após o login', async () => {
    renderAdminHome('empty')
    await login()
    expect(
      await screen.findByText('Nenhum agendamento encontrado.'),
    ).toBeInTheDocument()
  })

  it('altera o status sem confirmação quando não é cancelamento', async () => {
    renderAdminHome()
    await login()
    await showAllAppointments()

    await chooseStatus('Ana Lima', 'CONFIRMED')

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Status atualizado com sucesso.',
    )
    expect(
      within(rowFor('Ana Lima')).getByText('Confirmado', { selector: 'span' }),
    ).toBeInTheDocument()
  })

  it('cancela após confirmação e preserva o registro', async () => {
    renderAdminHome()
    await login()
    await showAllAppointments()

    await chooseStatus('Ana Lima', 'CANCELLED')
    expect(screen.getByRole('dialog')).toHaveTextContent(
      /o registro continuará no histórico/i,
    )
    fireEvent.click(
      screen.getByRole('button', { name: /confirmar cancelamento/i }),
    )

    expect(
      await screen.findByText(/registro foi preservado/i),
    ).toBeInTheDocument()
    expect(screen.getAllByText('Ana Lima')).not.toHaveLength(0)
    expect(
      within(rowFor('Ana Lima')).getByText('Cancelado', { selector: 'span' }),
    ).toBeInTheDocument()
  })

  it('exclui permanentemente após confirmação', async () => {
    renderAdminHome()
    await login()
    await showAllAppointments()

    fireEvent.click(
      screen.getByRole('button', {
        name: /excluir agendamento de ana lima/i,
      }),
    )
    expect(screen.getByRole('dialog')).toHaveTextContent(
      /ação não pode ser desfeita/i,
    )
    fireEvent.click(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    )

    await waitFor(() =>
      expect(screen.queryByText('Ana Lima')).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Agendamento excluído permanentemente.',
    )
  })

  it('mostra erro de status e mantém o registro', async () => {
    renderAdminHome('status-error')
    await login()
    await showAllAppointments()

    await chooseStatus('Ana Lima', 'CONFIRMED')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível alterar o status/i,
    )
    expect(screen.getByText('Ana Lima')).toBeInTheDocument()
  })

  it('mostra erro de exclusão e mantém o diálogo e o registro', async () => {
    renderAdminHome('delete-error')
    await login()
    await showAllAppointments()
    fireEvent.click(
      screen.getByRole('button', {
        name: /excluir agendamento de ana lima/i,
      }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /excluir permanentemente/i }),
    )

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível excluir o agendamento/i,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByText('Ana Lima')).not.toHaveLength(0)
  })

  it('fecha o diálogo com Escape quando não há operação em andamento', async () => {
    renderAdminHome()
    await login()
    await showAllAppointments()
    await chooseStatus('Ana Lima', 'CANCELLED')

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('expõe carregamento e erro de listagem pelos cenários', async () => {
    const loadingView = renderAdminHome('loading')
    await login()
    expect(
      await screen.findByText('Carregando agendamentos…'),
    ).toBeInTheDocument()
    loadingView.unmount()

    renderAdminHome('error')
    await login()
    expect(
      await screen.findByText('Não foi possível abrir a agenda.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tentar novamente/i }),
    ).toBeInTheDocument()
  })
})

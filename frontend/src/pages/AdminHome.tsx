import { PageShell } from '../components/PageShell'

export function AdminHome() {
  return (
    <PageShell
      eyebrow="Área administrativa"
      title="Operação clara, agenda organizada."
      description="Este shell será evoluído para login, indicadores, filtro por data e gerenciamento dos atendimentos."
      actionLabel="Voltar para a área do cliente"
      actionTo="/"
    />
  )
}

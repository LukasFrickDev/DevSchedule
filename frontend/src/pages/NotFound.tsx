import { PageShell } from '../components/PageShell'

export function NotFound() {
  return (
    <PageShell
      eyebrow="Erro 404"
      title="Essa página não existe."
      description="O endereço informado não corresponde a uma rota disponível no DevSchedule."
      actionLabel="Voltar ao início"
      actionTo="/"
    />
  )
}

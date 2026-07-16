import { PageShell } from '../components/PageShell'

export function ClientHome() {
  return (
    <PageShell
      eyebrow="Área do cliente"
      title="Seu horário, do seu jeito."
      description="A fundação do DevSchedule está pronta para receber a jornada de escolha de serviço, data, horário e confirmação."
      actionLabel="Conhecer a área administrativa"
      actionTo="/admin"
    />
  )
}

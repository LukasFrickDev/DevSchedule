import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { FlowPanel } from '../FlowPanel'
import { Summary } from '../Summary'
import { Button } from '../styles'
import { ReviewActions } from './styles'

export function ReviewStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Etapa 4 de 4"
      title="Tudo certo por aí?"
      lead="Confira os detalhes. Ao confirmar, seu horário ficará reservado."
    >
      <Summary flow={flow} />
      <ReviewActions>
        <Button type="button" $secondary onClick={flow.goToDetails}>
          Editar meus dados
        </Button>
        <Button type="button" $secondary onClick={flow.goToSchedule}>
          Editar horário
        </Button>
        <Button
          type="button"
          disabled={flow.submitting}
          aria-busy={flow.submitting}
          onClick={flow.confirmAppointment}
        >
          {flow.submitting ? 'Confirmando...' : 'Confirmar agendamento'}
        </Button>
      </ReviewActions>
    </FlowPanel>
  )
}

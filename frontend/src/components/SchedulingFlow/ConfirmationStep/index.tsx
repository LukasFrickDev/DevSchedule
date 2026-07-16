import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { FlowPanel } from '../FlowPanel'
import { Summary } from '../Summary'
import { Actions, Button } from '../styles'
import { ConfirmationCode, ResultMark } from './styles'

export function ConfirmationStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Agendamento confirmado"
      title="Seu horário está reservado."
      lead="Pronto! Guarde o código abaixo para consultar seu atendimento."
    >
      <ResultMark aria-hidden="true">✓</ResultMark>
      <ConfirmationCode>
        Código {flow.appointment?.confirmation_code}
      </ConfirmationCode>
      <Summary flow={flow} />
      <Actions>
        <Button type="button" onClick={flow.startOver}>
          Fazer novo agendamento
        </Button>
      </Actions>
    </FlowPanel>
  )
}

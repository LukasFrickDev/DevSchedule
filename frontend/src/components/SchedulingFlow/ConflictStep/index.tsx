import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { FlowPanel } from '../FlowPanel'
import { Actions, Button, StateBox } from '../styles'
import { ResultMark } from './styles'

export function ConflictStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Horário indisponível"
      title="Esse horário acabou de ser ocupado."
      lead="Outra pessoa concluiu o agendamento antes de você. Seu serviço e seus dados continuam salvos."
    >
      <ResultMark aria-hidden="true">!</ResultMark>
      <StateBox $danger role="alert">
        <div>
          <strong>Não foi possível reservar {flow.conflictedTime}.</strong>
          <p>Volte à agenda e escolha outro horário disponível.</p>
        </div>
      </StateBox>
      <Actions>
        <Button type="button" $danger onClick={flow.recoverFromConflict}>
          Escolher outro horário
        </Button>
      </Actions>
    </FlowPanel>
  )
}

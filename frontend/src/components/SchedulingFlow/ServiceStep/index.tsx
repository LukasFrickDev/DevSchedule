import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { FlowPanel } from '../FlowPanel'
import { Actions, Button, Duration, Loader, StateBox } from '../styles'
import {
  SelectionText,
  ServiceButton,
  ServiceDescription,
  ServiceGrid,
  ServiceName,
  ServiceTop,
} from './styles'

export function ServiceStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Etapa 1 de 4"
      title="Como podemos cuidar de você?"
      lead="Escolha o serviço ideal. Você poderá revisar tudo antes de confirmar."
    >
      {flow.services.status === 'loading' && (
        <StateBox role="status" aria-live="polite">
          <div>
            <Loader aria-hidden="true" />
            <p>Carregando serviços...</p>
          </div>
        </StateBox>
      )}
      {flow.services.status === 'error' && (
        <StateBox $danger role="alert">
          <div>
            <strong>Algo saiu do esperado.</strong>
            <p>{flow.services.message}</p>
            <Button type="button" $secondary onClick={flow.retryServices}>
              Tentar novamente
            </Button>
          </div>
        </StateBox>
      )}
      {flow.services.status === 'success' &&
        flow.services.data.length === 0 && (
          <StateBox role="status">
            <div>
              <strong>Nenhum serviço disponível agora.</strong>
              <p>Volte em outro momento para consultar novas opções.</p>
            </div>
          </StateBox>
        )}
      {flow.services.status === 'success' && flow.services.data.length > 0 && (
        <ServiceGrid role="group" aria-label="Serviços disponíveis">
          {flow.services.data.map((service) => {
            const selected = service.id === flow.selectedService?.id
            return (
              <ServiceButton
                key={service.id}
                type="button"
                $selected={selected}
                aria-pressed={selected}
                onClick={() => flow.chooseService(service)}
              >
                <ServiceTop>
                  <ServiceName>{service.name}</ServiceName>
                  <Duration>{service.duration_minutes} min</Duration>
                </ServiceTop>
                <ServiceDescription>{service.description}</ServiceDescription>
                {selected && <SelectionText>Selecionado</SelectionText>}
              </ServiceButton>
            )
          })}
        </ServiceGrid>
      )}
      <Actions>
        <Button
          type="button"
          disabled={!flow.selectedService}
          onClick={flow.continueFromService}
        >
          Escolher data e horário
        </Button>
      </Actions>
    </FlowPanel>
  )
}

import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { formatApiDate } from '../../../utils/date'
import { Calendar } from '../../Calendar'
import { FlowPanel } from '../FlowPanel'
import {
  Actions,
  Button,
  Duration,
  ErrorText,
  FormGroup,
  Label,
  Loader,
  StateBox,
} from '../styles'
import {
  Hint,
  Legend,
  SlotButton,
  SlotFieldset,
  SlotGrid,
  SummaryStrip,
} from './styles'

export function DateTimeStep({ flow }: { flow: SchedulingFlowController }) {
  const slots = flow.availability.data?.slots ?? []

  return (
    <FlowPanel
      stepNumber="Etapa 2 de 4"
      title="Quando fica melhor?"
      lead="Escolha uma data a partir de hoje e um dos horários livres."
    >
      {flow.selectedService && (
        <SummaryStrip>
          <div>
            <strong>{flow.selectedService.name}</strong>
            <span>{flow.selectedService.description}</span>
          </div>
          <Duration>{flow.selectedService.duration_minutes} min</Duration>
        </SummaryStrip>
      )}
      <FormGroup>
        <Label id="appointment-date-label">Data do atendimento</Label>
        <Calendar
          id="appointment-date"
          minDate={flow.minDate}
          value={flow.inputDate}
          labelledBy="appointment-date-label"
          aria-describedby={
            flow.scheduleError ? 'date-hint schedule-error' : 'date-hint'
          }
          onChange={flow.changeDate}
        />
        <Hint id="date-hint">
          {flow.apiDate
            ? `Data selecionada: ${formatApiDate(flow.apiDate)}`
            : 'A data será exibida no padrão DD/MM/AAAA.'}
        </Hint>
      </FormGroup>
      {flow.availability.status === 'loading' && (
        <StateBox role="status" aria-live="polite">
          <div>
            <Loader aria-hidden="true" />
            <p>Consultando horários...</p>
          </div>
        </StateBox>
      )}
      {flow.availability.status === 'error' && (
        <StateBox $danger role="alert">
          <div>
            <strong>Não conseguimos abrir a agenda.</strong>
            <p>{flow.availability.message}</p>
            <Button type="button" $secondary onClick={flow.retryAvailability}>
              Tentar novamente
            </Button>
          </div>
        </StateBox>
      )}
      {flow.availability.status === 'success' && slots.length === 0 && (
        <StateBox role="status">
          <div>
            <strong>Este dia está sem disponibilidade.</strong>
            <p>Escolha outra data para encontrar novos horários.</p>
          </div>
        </StateBox>
      )}
      {flow.availability.status === 'success' && slots.length > 0 && (
        <SlotFieldset>
          <Legend>Horários disponíveis</Legend>
          <SlotGrid>
            {slots.map((slot) => {
              const unavailable = flow.isSlotUnavailable(slot)
              return (
                <SlotButton
                  key={slot.start}
                  type="button"
                  $selected={flow.selectedTime === slot.start}
                  disabled={unavailable}
                  aria-pressed={flow.selectedTime === slot.start}
                  onClick={() => flow.chooseTime(slot)}
                >
                  {slot.start}
                  <span>{unavailable ? 'Indisponível' : 'Disponível'}</span>
                </SlotButton>
              )
            })}
          </SlotGrid>
        </SlotFieldset>
      )}
      {flow.scheduleError && (
        <ErrorText id="schedule-error" role="alert">
          {flow.scheduleError}
        </ErrorText>
      )}
      <Actions>
        <Button type="button" $secondary onClick={flow.goToService}>
          Voltar
        </Button>
        <Button type="button" onClick={flow.continueFromSchedule}>
          Informar meus dados
        </Button>
      </Actions>
    </FlowPanel>
  )
}

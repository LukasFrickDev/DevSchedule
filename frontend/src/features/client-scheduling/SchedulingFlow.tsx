import type { FormEvent, ReactNode } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { formatApiDate, formatScheduledAt } from './date'
import { normalizeAndFormatPhone } from './phone'
import type { SchedulingFlowController } from './useSchedulingFlow'

const Main = styled.main`
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2.5rem);
`

const Shell = styled.div`
  width: min(100%, 68rem);
  margin: 0 auto;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: clamp(1.75rem, 5vw, 3.5rem);
`

const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: -0.02em;

  &::before {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 1.25rem rgb(57 211 83 / 65%);
    content: '';
  }
`

const SecureNote = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;

  @media (max-width: 30rem) {
    display: none;
  }
`

const Progress = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
`

const ProgressItem = styled.li<{ $active: boolean; $complete: boolean }>`
  min-width: 0;
  color: ${({ $active, $complete, theme }) =>
    $active || $complete ? theme.colors.text : theme.colors.textMuted};
  font-size: clamp(0.7rem, 1.8vw, 0.82rem);
  font-weight: ${({ $active }) => ($active ? 800 : 600)};

  &::before {
    display: block;
    height: 0.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ $active, $complete, theme }) =>
      $active
        ? theme.colors.primary
        : $complete
          ? theme.colors.secondary
          : theme.colors.border};
    content: '';
  }
`

const Panel = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(1rem, 3vw, 1.5rem);
  background:
    radial-gradient(circle at 90% 0%, rgb(133 50 242 / 15%), transparent 30%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

const PanelContent = styled.div`
  padding: clamp(1.25rem, 5vw, 3.25rem);
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Title = styled.h1`
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.75rem);
  line-height: 1.02;
  letter-spacing: -0.045em;
`

const Lead = styled.p`
  max-width: 62ch;
  margin: ${({ theme }) => theme.spacing.md} 0
    ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(1rem, 2vw, 1.1rem);
`

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
  }
`

const ServiceButton = styled.button<{ $selected: boolean }>`
  min-height: 11rem;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $selected, theme }) =>
    $selected ? 'rgb(57 211 83 / 8%)' : theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }
`

const ServiceTop = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

const ServiceName = styled.strong`
  display: block;
  font-size: 1.12rem;
`

const Duration = styled.span`
  flex: 0 0 auto;
  padding: 0.2rem 0.55rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgb(133 50 242 / 16%);
  color: #c89cff;
  font-size: 0.75rem;
  font-weight: 800;
`

const ServiceDescription = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`

const SelectionText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 800;
`

const SummaryStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};

  strong,
  span {
    display: block;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;
  }
`

const FormGroup = styled.div`
  max-width: 32rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 800;
`

const Input = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  min-height: 3.25rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};

  &:focus-visible {
    outline: 3px solid rgb(133 50 242 / 55%);
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`

const Hint = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`

const ErrorText = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: #ff9ca5;
  font-size: 0.85rem;
  font-weight: 700;
`

const SlotFieldset = styled.fieldset`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  padding: 0;
  border: 0;
`

const Legend = styled.legend`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 800;
`

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.25rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`

const SlotButton = styled.button<{ $selected: boolean }>`
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $selected, theme }) =>
    $selected ? 'rgb(57 211 83 / 12%)' : theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  cursor: pointer;

  span {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.65rem;
    font-weight: 700;
  }

  &:disabled {
    border-style: dashed;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.65;
    text-decoration: line-through;

    span {
      color: ${({ theme }) => theme.colors.textMuted};
      text-decoration: none;
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const StateBox = styled.div<{ $danger?: boolean }>`
  display: grid;
  min-height: 12rem;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed
    ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
`

const Loader = styled.span`
  width: 2rem;
  height: 2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 750ms linear infinite;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Button = styled.button<{ $secondary?: boolean; $danger?: boolean }>`
  min-height: 3.25rem;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $secondary, $danger, theme }) =>
      $danger
        ? theme.colors.danger
        : $secondary
          ? theme.colors.border
          : theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $secondary, $danger, theme }) =>
    $danger
      ? 'rgb(255 93 108 / 10%)'
      : $secondary
        ? 'transparent'
        : theme.colors.primary};
  color: ${({ $secondary, $danger, theme }) =>
    $secondary || $danger ? theme.colors.text : theme.colors.onPrimary};
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (max-width: 30rem) {
    width: 100%;
  }
`

const ReviewList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;

  @media (max-width: 38rem) {
    grid-template-columns: 1fr;
  }
`

const ReviewItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    font-weight: 800;
  }
`

const ResultMark = styled.div<{ $danger?: boolean }>`
  display: grid;
  width: 4rem;
  height: 4rem;
  place-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.primary};
  border-radius: 50%;
  background: ${({ $danger }) =>
    $danger ? 'rgb(255 93 108 / 10%)' : 'rgb(57 211 83 / 10%)'};
  color: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.primary};
  font-size: 1.6rem;
  font-weight: 900;
`

const ConfirmationCode = styled.p`
  width: fit-content;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgb(133 50 242 / 16%);
  color: #d2b2ff;
  font-weight: 900;
  letter-spacing: 0.08em;
`

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
`

const LiveTitle = styled.span`
  ${visuallyHidden}
`

const progressSteps = ['Serviço', 'Data e horário', 'Seus dados', 'Revisão']

function FlowPanel({
  stepNumber,
  title,
  lead,
  children,
}: {
  stepNumber: string
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <Panel aria-labelledby="flow-title">
      <PanelContent>
        <Eyebrow>{stepNumber}</Eyebrow>
        <Title id="flow-title">{title}</Title>
        <Lead>{lead}</Lead>
        {children}
      </PanelContent>
    </Panel>
  )
}

function Summary({ flow }: { flow: SchedulingFlowController }) {
  const appointment = flow.step === 'success' ? flow.appointment : null
  if (
    !appointment &&
    (!flow.selectedService || !flow.apiDate || !flow.selectedTime)
  ) {
    return null
  }
  return (
    <ReviewList>
      <ReviewItem>
        <dt>Serviço</dt>
        <dd>{appointment?.service.name ?? flow.selectedService?.name}</dd>
      </ReviewItem>
      <ReviewItem>
        <dt>Duração</dt>
        <dd>
          {appointment?.service.duration_minutes ??
            flow.selectedService?.duration_minutes}{' '}
          minutos
        </dd>
      </ReviewItem>
      <ReviewItem>
        <dt>Data e horário</dt>
        <dd>
          {appointment
            ? formatScheduledAt(appointment.scheduled_at)
            : `${formatApiDate(flow.apiDate!)} às ${flow.selectedTime}`}
        </dd>
      </ReviewItem>
      <ReviewItem>
        <dt>Cliente</dt>
        <dd>
          {appointment?.customer_name ?? flow.name} ·{' '}
          {appointment
            ? normalizeAndFormatPhone(appointment.customer_phone)
            : flow.phone}
        </dd>
      </ReviewItem>
    </ReviewList>
  )
}

function ServiceStep({ flow }: { flow: SchedulingFlowController }) {
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

function ScheduleStep({ flow }: { flow: SchedulingFlowController }) {
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
        <Label htmlFor="appointment-date">Data do atendimento</Label>
        <Input
          id="appointment-date"
          type="date"
          min={flow.minDate}
          value={flow.inputDate}
          aria-describedby="date-hint schedule-error"
          onChange={(event) => flow.changeDate(event.target.value)}
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

function DetailsStep({ flow }: { flow: SchedulingFlowController }) {
  function submit(event: FormEvent) {
    event.preventDefault()
    flow.continueFromDetails()
  }
  return (
    <FlowPanel
      stepNumber="Etapa 3 de 4"
      title="Só falta conhecer você."
      lead="Seus dados serão usados apenas para identificar este agendamento."
    >
      <form noValidate onSubmit={submit}>
        <FormGroup>
          <Label htmlFor="customer-name">Nome completo</Label>
          <Input
            id="customer-name"
            name="name"
            autoComplete="name"
            value={flow.name}
            $invalid={Boolean(flow.fieldErrors.name)}
            aria-invalid={Boolean(flow.fieldErrors.name)}
            aria-describedby={flow.fieldErrors.name ? 'name-error' : undefined}
            onChange={(event) => flow.setName(event.target.value)}
          />
          {flow.fieldErrors.name && (
            <ErrorText id="name-error" role="alert">
              {flow.fieldErrors.name}
            </ErrorText>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="customer-phone">Telefone com DDD</Label>
          <Input
            id="customer-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            value={flow.phone}
            $invalid={Boolean(flow.fieldErrors.phone)}
            aria-invalid={Boolean(flow.fieldErrors.phone)}
            aria-describedby={
              flow.fieldErrors.phone ? 'phone-error' : undefined
            }
            onChange={(event) => flow.setPhone(event.target.value)}
          />
          {flow.fieldErrors.phone && (
            <ErrorText id="phone-error" role="alert">
              {flow.fieldErrors.phone}
            </ErrorText>
          )}
        </FormGroup>
        <Actions>
          <Button type="button" $secondary onClick={flow.goToSchedule}>
            Voltar
          </Button>
          <Button type="submit">Revisar agendamento</Button>
        </Actions>
      </form>
    </FlowPanel>
  )
}

function ReviewStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Etapa 4 de 4"
      title="Tudo certo por aí?"
      lead="Confira os detalhes. Ao confirmar, seu horário ficará reservado."
    >
      <Summary flow={flow} />
      <Actions>
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
      </Actions>
    </FlowPanel>
  )
}

function SuccessStep({ flow }: { flow: SchedulingFlowController }) {
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

function ConflictStep({ flow }: { flow: SchedulingFlowController }) {
  return (
    <FlowPanel
      stepNumber="Horário indisponível"
      title="Esse horário acabou de ser ocupado."
      lead="Outra pessoa concluiu o agendamento antes de você. Seu serviço e seus dados continuam salvos."
    >
      <ResultMark $danger aria-hidden="true">
        !
      </ResultMark>
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

export function SchedulingFlow({ flow }: { flow: SchedulingFlowController }) {
  const currentIndex = ['service', 'schedule', 'details', 'review'].indexOf(
    flow.step,
  )
  const completedIndex =
    flow.step === 'success' || flow.step === 'conflict' ? 4 : currentIndex

  return (
    <Main>
      <Shell>
        <Header>
          <Brand>DevSchedule</Brand>
          <SecureNote>Agendamento simples e seguro</SecureNote>
        </Header>
        <nav aria-label="Progresso do agendamento">
          <Progress>
            {progressSteps.map((label, index) => (
              <ProgressItem
                key={label}
                $active={index === currentIndex}
                $complete={index < completedIndex}
                aria-current={index === currentIndex ? 'step' : undefined}
              >
                {label}
              </ProgressItem>
            ))}
          </Progress>
        </nav>
        <LiveTitle aria-live="polite">Tela atual: {flow.step}</LiveTitle>
        {flow.step === 'service' && <ServiceStep flow={flow} />}
        {flow.step === 'schedule' && <ScheduleStep flow={flow} />}
        {flow.step === 'details' && <DetailsStep flow={flow} />}
        {flow.step === 'review' && <ReviewStep flow={flow} />}
        {flow.step === 'success' && <SuccessStep flow={flow} />}
        {flow.step === 'conflict' && <ConflictStep flow={flow} />}
      </Shell>
    </Main>
  )
}

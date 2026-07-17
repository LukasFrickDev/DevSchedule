import { useSchedulingFlow } from '../../hooks/useSchedulingFlow'
import { ConfirmationStep } from './ConfirmationStep'
import { ConflictStep } from './ConflictStep'
import { CustomerDataStep } from './CustomerDataStep'
import { DateTimeStep } from './DateTimeStep'
import { ReviewStep } from './ReviewStep'
import { ServiceStep } from './ServiceStep'
import {
  Brand,
  BrandLogo,
  Header,
  LiveTitle,
  Main,
  Progress,
  ProgressItem,
  SecureNote,
  Shell,
} from './styles'

const progressSteps = ['Serviço', 'Data e horário', 'Seus dados', 'Revisão']

export function SchedulingFlow() {
  const flow = useSchedulingFlow()
  const currentIndex = ['service', 'schedule', 'details', 'review'].indexOf(
    flow.step,
  )
  const completedIndex =
    flow.step === 'success' || flow.step === 'conflict' ? 4 : currentIndex

  return (
    <Main>
      <Shell>
        <Header>
          <Brand>
            <BrandLogo src="/logo-devschedule-png.png" alt="" />
            DevSchedule
          </Brand>
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
        {flow.step === 'schedule' && <DateTimeStep flow={flow} />}
        {flow.step === 'details' && <CustomerDataStep flow={flow} />}
        {flow.step === 'review' && <ReviewStep flow={flow} />}
        {flow.step === 'success' && <ConfirmationStep flow={flow} />}
        {flow.step === 'conflict' && <ConflictStep flow={flow} />}
      </Shell>
    </Main>
  )
}

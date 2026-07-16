import type { SchedulingFlowController } from '../../../hooks/useSchedulingFlow'
import { formatApiDate, formatScheduledAt } from '../../../utils/date'
import { normalizeAndFormatPhone } from '../../../utils/phone'
import { ReviewItem, ReviewList } from './styles'

export function Summary({ flow }: { flow: SchedulingFlowController }) {
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

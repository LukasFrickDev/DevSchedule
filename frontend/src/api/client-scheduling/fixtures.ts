import type {
  ApiDate,
  ApiError,
  ApiTime,
  Appointment,
  Availability,
  CreateAppointmentPayload,
  Service,
} from '../../types'

export const servicesResponseFixture = {
  data: [
    {
      id: '81ef3676-5987-441c-af89-6e9ad30b6014',
      name: 'Mentoria individual',
      description:
        'Encontro individual para esclarecer dúvidas técnicas e definir os próximos passos de estudo.',
      duration_minutes: 60,
    },
    {
      id: 'c690fd99-8482-4677-8199-1dcbe8e44aa2',
      name: 'Orientação de carreira',
      description:
        'Conversa focada em currículo, portfólio, posicionamento profissional e próximos passos.',
      duration_minutes: 60,
    },
    {
      id: '0f52181c-c086-42e0-89ea-a931e34b82ca',
      name: 'Revisão de projeto',
      description:
        'Análise de código, estrutura e boas práticas com feedback objetivo para evolução do projeto.',
      duration_minutes: 60,
    },
  ],
} satisfies { data: Service[] }

export const serviceErrorFixture = {
  error: {
    code: 'internal_error',
    message: 'Não foi possível carregar os serviços.',
  },
} satisfies ApiError

export const availabilityErrorFixture = {
  error: {
    code: 'internal_error',
    message: 'Não foi possível consultar a agenda.',
  },
} satisfies ApiError

export const conflictErrorFixture = {
  error: {
    code: 'slot_unavailable',
    message: 'O horário escolhido não está mais disponível.',
  },
} satisfies ApiError

export const availabilityStarts = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] satisfies ApiTime[]

const unavailableStarts = new Set<ApiTime>(['10:00', '12:00', '15:00'])

export function addOneHourToTime(start: ApiTime): ApiTime {
  const [hours] = start.split(':').map(Number)
  const endHours = String(hours + 1).padStart(2, '0')
  return `${endHours}:00` as ApiTime
}

export function buildAvailabilityResponseFixture(
  service_id: string,
  date: ApiDate,
  empty = false,
): { data: Availability } {
  return {
    data: {
      service_id,
      date,
      timezone: 'America/Sao_Paulo',
      slots: empty
        ? []
        : availabilityStarts.map((start) => ({
            start,
            end: addOneHourToTime(start),
            available: !unavailableStarts.has(start),
          })),
    },
  }
}

function toIsoTimestamp(date: ApiDate, time: ApiTime) {
  const [day, month, year] = date.split('-')
  return `${year}-${month}-${day}T${time}:00-03:00`
}

export function buildAppointmentResponseFixture(
  request: CreateAppointmentPayload,
  service: Appointment['service'],
): { data: Appointment } {
  const now = '2026-07-16T17:00:00-03:00'
  return {
    data: {
      id: '9c3b11b8-5c34-4cbf-aa48-7d08ad8d27a1',
      confirmation_code: 'DEV-4827',
      customer_name: request.customer_name.trim(),
      customer_phone: request.customer_phone.replace(/\D/g, ''),
      service,
      scheduled_at: toIsoTimestamp(request.date, request.time),
      status: 'SCHEDULED',
      created_at: now,
      updated_at: now,
    },
  }
}

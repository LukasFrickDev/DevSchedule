import type {
  ApiAppointmentResponseDto,
  ApiAppointmentServiceDto,
  ApiAvailabilityResponseDto,
  ApiCreateAppointmentRequestDto,
  ApiDateDto,
  ApiErrorResponseDto,
  ApiServicesResponseDto,
  ApiTimeDto,
} from './types'

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
      id: '0f52181c-c086-42e0-89ea-a931e34b82ca',
      name: 'Revisão de projeto',
      description:
        'Análise de código, estrutura e boas práticas com feedback objetivo para evolução do projeto.',
      duration_minutes: 45,
    },
    {
      id: 'c690fd99-8482-4677-8199-1dcbe8e44aa2',
      name: 'Orientação de carreira',
      description:
        'Conversa focada em currículo, portfólio, posicionamento profissional e próximos passos.',
      duration_minutes: 30,
    },
  ],
} satisfies ApiServicesResponseDto

export const serviceErrorFixture = {
  error: {
    code: 'services_unavailable',
    message: 'Não foi possível carregar os serviços.',
  },
} satisfies ApiErrorResponseDto

export const availabilityErrorFixture = {
  error: {
    code: 'availability_unavailable',
    message: 'Não foi possível consultar a agenda.',
  },
} satisfies ApiErrorResponseDto

export const conflictErrorFixture = {
  error: {
    code: 'slot_unavailable',
    message: 'O horário escolhido não está mais disponível.',
  },
} satisfies ApiErrorResponseDto

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
] satisfies ApiTimeDto[]

const unavailableStarts = new Set<ApiTimeDto>(['10:00', '12:00', '15:00'])

export function addMinutesToTime(
  start: ApiTimeDto,
  durationMinutes: number,
): ApiTimeDto {
  const [hours, minutes] = start.split(':').map(Number)
  const total = hours * 60 + minutes + durationMinutes
  const endHours = String(Math.floor(total / 60)).padStart(2, '0')
  const endMinutes = String(total % 60).padStart(2, '0')
  return `${endHours}:${endMinutes}` as ApiTimeDto
}

export function buildAvailabilityResponseFixture(
  serviceId: string,
  date: ApiDateDto,
  durationMinutes: number,
  empty = false,
): ApiAvailabilityResponseDto {
  return {
    data: {
      service_id: serviceId,
      date,
      timezone: 'America/Sao_Paulo',
      slots: empty
        ? []
        : availabilityStarts.map((start) => ({
            start,
            end: addMinutesToTime(start, durationMinutes),
            available: !unavailableStarts.has(start),
          })),
    },
  }
}

function toIsoTimestamp(date: ApiDateDto, time: ApiTimeDto) {
  const [day, month, year] = date.split('-')
  return `${year}-${month}-${day}T${time}:00-03:00`
}

export function buildAppointmentResponseFixture(
  request: ApiCreateAppointmentRequestDto,
  service: ApiAppointmentServiceDto,
): ApiAppointmentResponseDto {
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

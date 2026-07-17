import type { ApiDate, ApiError, ApiTime, Appointment } from '../../types'
import { servicesResponseFixture } from '../client-scheduling/fixtures'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function dateParts(date: Date) {
  return {
    year: date.getFullYear(),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
  }
}

function addDays(referenceDate: Date, amount: number) {
  const date = new Date(referenceDate)
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + amount)
  return date
}

export function dateToApiDate(date: Date): ApiDate {
  const { year, month, day } = dateParts(date)
  return `${day}-${month}-${year}` as ApiDate
}

function toScheduledAt(date: Date, time: ApiTime) {
  const { year, month, day } = dateParts(date)
  return `${year}-${month}-${day}T${time}:00-03:00`
}

type FixtureAppointmentInput = {
  id: string
  confirmation_code: string
  customer_name: string
  customer_phone: string
  serviceIndex: number
  date: Date
  time: ApiTime
  status: Appointment['status']
}

function buildAppointment(input: FixtureAppointmentInput): Appointment {
  const service = servicesResponseFixture.data[input.serviceIndex]
  const timestamp = toScheduledAt(input.date, input.time)

  return {
    id: input.id,
    confirmation_code: input.confirmation_code,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    service: {
      id: service.id,
      name: service.name,
      duration_minutes: service.duration_minutes,
    },
    scheduled_at: timestamp,
    status: input.status,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

export function buildAdminAppointmentsFixture(
  referenceDate = new Date(),
): Appointment[] {
  const today = addDays(referenceDate, 0)
  const yesterday = addDays(referenceDate, -1)
  const tomorrow = addDays(referenceDate, 1)

  return [
    buildAppointment({
      id: 'b0c76fb4-37e8-42e5-b644-fb3fe83ec18c',
      confirmation_code: 'DEV-8101',
      customer_name: 'Ana Lima',
      customer_phone: '11987654321',
      serviceIndex: 0,
      date: today,
      time: '09:00',
      status: 'SCHEDULED',
    }),
    buildAppointment({
      id: 'a08489ea-f166-47c0-811f-698aad2a64d4',
      confirmation_code: 'DEV-8102',
      customer_name: 'Bruno Costa',
      customer_phone: '21988776655',
      serviceIndex: 1,
      date: today,
      time: '10:00',
      status: 'CONFIRMED',
    }),
    buildAppointment({
      id: '1fe7ea6b-5cf0-42f3-9d74-3cf8fcd84dc3',
      confirmation_code: 'DEV-8103',
      customer_name: 'Camila Rocha',
      customer_phone: '31999887766',
      serviceIndex: 2,
      date: today,
      time: '13:30',
      status: 'COMPLETED',
    }),
    buildAppointment({
      id: 'd234c6e9-e201-4c1a-b2f8-0302a145c38e',
      confirmation_code: 'DEV-8104',
      customer_name: 'Diego Martins',
      customer_phone: '41991234567',
      serviceIndex: 0,
      date: today,
      time: '16:00',
      status: 'CANCELLED',
    }),
    buildAppointment({
      id: 'f59e71a5-4006-4742-a83e-520dd911bb29',
      confirmation_code: 'DEV-8099',
      customer_name: 'Elisa Nunes',
      customer_phone: '51995554444',
      serviceIndex: 2,
      date: yesterday,
      time: '14:00',
      status: 'COMPLETED',
    }),
    buildAppointment({
      id: '8a5e3c12-b37d-473a-86b2-946971141f7f',
      confirmation_code: 'DEV-8105',
      customer_name: 'Fábio Alves',
      customer_phone: '61982223333',
      serviceIndex: 1,
      date: tomorrow,
      time: '11:00',
      status: 'SCHEDULED',
    }),
  ]
}

export const adminListErrorFixture = {
  error: {
    code: 'internal_error',
    message: 'Não foi possível carregar os agendamentos.',
  },
} satisfies ApiError

export const adminStatusErrorFixture = {
  error: {
    code: 'internal_error',
    message: 'Não foi possível alterar o status. Tente novamente.',
  },
} satisfies ApiError

export const adminDeleteErrorFixture = {
  error: {
    code: 'internal_error',
    message: 'Não foi possível excluir o agendamento. Tente novamente.',
  },
} satisfies ApiError

export function buildAdminNotFoundError(): ApiError {
  return {
    error: {
      code: 'not_found',
      message: 'Agendamento não encontrado.',
    },
  }
}

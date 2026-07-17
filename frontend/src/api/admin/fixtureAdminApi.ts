import type {
  AdminAppointmentsResponse,
  AdminFixtureScenario,
  ApiDate,
  Appointment,
  UpdateAppointmentStatusPayload,
} from '../../types'
import {
  adminDeleteErrorFixture,
  adminListErrorFixture,
  adminStatusErrorFixture,
  buildAdminAppointmentsFixture,
  buildAdminNotFoundError,
} from './fixtures'

const latency = import.meta.env.MODE === 'test' ? 0 : 450

let appointments = buildAdminAppointmentsFixture()

function wait(duration = latency) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration))
}

function waitForever<T>() {
  return new Promise<T>(() => undefined)
}

function appointmentDate(appointment: Appointment): ApiDate {
  const [date] = appointment.scheduled_at.split('T')
  const [year, month, day] = date.split('-')
  return `${day}-${month}-${year}` as ApiDate
}

function cloneAppointment(appointment: Appointment): Appointment {
  return {
    ...appointment,
    service: { ...appointment.service },
  }
}

export type ListAdminAppointmentsParams = {
  date?: ApiDate
  page?: number
}

export const fixtureAdminApi = {
  async listAppointments(
    { date, page = 1 }: ListAdminAppointmentsParams,
    scenario: AdminFixtureScenario,
  ): Promise<AdminAppointmentsResponse> {
    if (scenario === 'loading') return waitForever()
    await wait()
    if (scenario === 'error') throw adminListErrorFixture
    if (scenario === 'empty') {
      return { count: 0, next: null, previous: null, results: [] }
    }

    const results = appointments
      .filter((appointment) => !date || appointmentDate(appointment) === date)
      .sort((first, second) =>
        date
          ? first.scheduled_at.localeCompare(second.scheduled_at)
          : second.scheduled_at.localeCompare(first.scheduled_at),
      )
      .map(cloneAppointment)

    return {
      count: results.length,
      next: null,
      previous: page > 1 ? `/admin/appointments/?page=${page - 1}` : null,
      results,
    }
  },

  async updateAppointmentStatus(
    id: string,
    payload: UpdateAppointmentStatusPayload,
    scenario: AdminFixtureScenario,
  ): Promise<Appointment> {
    await wait()
    if (scenario === 'status-error') throw adminStatusErrorFixture

    const index = appointments.findIndex((appointment) => appointment.id === id)
    if (index < 0) throw buildAdminNotFoundError()

    const updated = {
      ...appointments[index],
      status: payload.status,
      updated_at: new Date().toISOString(),
    }
    appointments[index] = updated
    return cloneAppointment(updated)
  },

  async deleteAppointment(
    id: string,
    scenario: AdminFixtureScenario,
  ): Promise<void> {
    await wait()
    if (scenario === 'delete-error') throw adminDeleteErrorFixture

    const index = appointments.findIndex((appointment) => appointment.id === id)
    if (index < 0) throw buildAdminNotFoundError()
    appointments.splice(index, 1)
  },
}

export function resetAdminAppointmentsFixture(referenceDate = new Date()) {
  appointments = buildAdminAppointmentsFixture(referenceDate)
}

export function getAdminFixtureScenario(): AdminFixtureScenario {
  const scenario = new URLSearchParams(window.location.search).get('scenario')
  const supported: AdminFixtureScenario[] = [
    'loading',
    'error',
    'empty',
    'status-error',
    'delete-error',
  ]

  return supported.includes(scenario as AdminFixtureScenario)
    ? (scenario as AdminFixtureScenario)
    : 'default'
}

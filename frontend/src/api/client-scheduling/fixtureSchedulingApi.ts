import type {
  ApiDate,
  ApiError,
  Appointment,
  Availability,
  CreateAppointmentPayload,
  FixtureScenario,
  Service,
} from '../../types'
import {
  availabilityErrorFixture,
  buildAppointmentResponseFixture,
  buildAvailabilityResponseFixture,
  conflictErrorFixture,
  serviceErrorFixture,
  servicesResponseFixture,
} from './fixtures'

const latency = import.meta.env.MODE === 'test' ? 0 : 450

function wait(duration = latency) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration))
}

function waitForever<T>() {
  return new Promise<T>(() => undefined)
}

function isWeekend(date: ApiDate) {
  const [day, month, year] = date.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 || weekday === 6
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'code' in value.error &&
    'message' in value.error
  )
}

export const fixtureSchedulingApi = {
  async listServices(scenario: FixtureScenario): Promise<Service[]> {
    if (scenario === 'services-loading') return waitForever()
    await wait()
    if (scenario === 'services-error') throw serviceErrorFixture
    if (scenario === 'services-empty') return []
    return servicesResponseFixture.data
  },

  async getAvailability(
    service_id: string,
    date: Availability['date'],
    scenario: FixtureScenario,
  ): Promise<Availability> {
    if (scenario === 'availability-loading') return waitForever()
    await wait()
    if (scenario === 'availability-error') throw availabilityErrorFixture

    const service = servicesResponseFixture.data.find(
      (item) => item.id === service_id,
    )
    if (!service) {
      throw {
        error: {
          code: 'not_found',
          message: 'Serviço não encontrado.',
        },
      } satisfies ApiError
    }

    const empty = scenario === 'availability-empty' || isWeekend(date)
    return buildAvailabilityResponseFixture(service_id, date, empty).data
  },

  async createAppointment(
    payload: CreateAppointmentPayload,
    scenario: FixtureScenario,
  ): Promise<Appointment> {
    await wait(import.meta.env.MODE === 'test' ? 0 : 700)
    if (scenario === 'conflict') throw conflictErrorFixture

    const service = servicesResponseFixture.data.find(
      (item) => item.id === payload.service_id,
    )
    if (!service) {
      throw {
        error: {
          code: 'not_found',
          message: 'Serviço não encontrado.',
        },
      } satisfies ApiError
    }

    return buildAppointmentResponseFixture(payload, {
      id: service.id,
      name: service.name,
      duration_minutes: service.duration_minutes,
    }).data
  },
}

export function getFixtureScenario(): FixtureScenario {
  const scenario = new URLSearchParams(window.location.search).get('scenario')
  const supported: FixtureScenario[] = [
    'services-loading',
    'services-error',
    'services-empty',
    'availability-loading',
    'availability-error',
    'availability-empty',
    'conflict',
  ]
  return supported.includes(scenario as FixtureScenario)
    ? (scenario as FixtureScenario)
    : 'default'
}

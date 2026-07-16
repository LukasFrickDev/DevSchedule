import { availabilitySlotFixtures, serviceFixtures } from './fixtures'
import type {
  ApiError,
  Appointment,
  AvailabilityResponse,
  CreateAppointmentInput,
  FixtureScenario,
  Service,
} from './types'

const latency = import.meta.env.MODE === 'test' ? 0 : 450

function wait(duration = latency) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration))
}

function waitForever<T>() {
  return new Promise<T>(() => undefined)
}

function apiError(status: number, code: string, message: string): ApiError {
  return { status, code, message }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  )
}

export const fixtureSchedulingApi = {
  async listServices(scenario: FixtureScenario): Promise<Service[]> {
    if (scenario === 'services-loading') return waitForever()
    await wait()
    if (scenario === 'services-error') {
      throw apiError(
        503,
        'services_unavailable',
        'Não foi possível carregar os serviços.',
      )
    }
    if (scenario === 'services-empty') return []
    return serviceFixtures.filter((service) => service.active)
  },

  async getAvailability(
    serviceId: string,
    date: AvailabilityResponse['date'],
    scenario: FixtureScenario,
  ): Promise<AvailabilityResponse> {
    if (scenario === 'availability-loading') return waitForever()
    await wait()
    if (scenario === 'availability-error') {
      throw apiError(
        503,
        'availability_unavailable',
        'Não foi possível consultar a agenda.',
      )
    }
    return {
      serviceId,
      date,
      slots:
        scenario === 'availability-empty'
          ? []
          : availabilitySlotFixtures.map((slot) => ({ ...slot })),
    }
  },

  async createAppointment(
    input: CreateAppointmentInput,
    scenario: FixtureScenario,
  ): Promise<Appointment> {
    await wait(import.meta.env.MODE === 'test' ? 0 : 700)
    if (scenario === 'conflict') {
      throw apiError(
        409,
        'slot_unavailable',
        'O horário escolhido não está mais disponível.',
      )
    }
    return {
      ...input,
      id: '9c3b11b8-5c34-4cbf-aa48-7d08ad8d27a1',
      status: 'SCHEDULED',
      confirmationCode: 'DEV-4827',
    }
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

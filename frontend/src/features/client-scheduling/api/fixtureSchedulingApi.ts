import {
  mapAppointmentResponseDto,
  mapAvailabilityResponseDto,
  mapCreateAppointmentInputToDto,
  mapErrorResponseDto,
  mapServicesResponseDto,
} from './mappers'
import {
  availabilityErrorFixture,
  buildAppointmentResponseFixture,
  buildAvailabilityResponseFixture,
  conflictErrorFixture,
  serviceErrorFixture,
  servicesResponseFixture,
} from './fixtures'
import type { ApiDateDto, ApiErrorResponseDto } from './types'
import type {
  ApiError,
  Appointment,
  AvailabilityResponse,
  CreateAppointmentInput,
  FixtureScenario,
  Service,
} from '../types'

const latency = import.meta.env.MODE === 'test' ? 0 : 450

function wait(duration = latency) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration))
}

function waitForever<T>() {
  return new Promise<T>(() => undefined)
}

function apiError(status: number, response: ApiErrorResponseDto): ApiError {
  return mapErrorResponseDto(status, response)
}

function isWeekend(date: ApiDateDto) {
  const [day, month, year] = date.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return weekday === 0 || weekday === 6
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
    if (scenario === 'services-error') throw apiError(503, serviceErrorFixture)
    if (scenario === 'services-empty') return []
    return mapServicesResponseDto(servicesResponseFixture)
  },

  async getAvailability(
    serviceId: string,
    date: AvailabilityResponse['date'],
    scenario: FixtureScenario,
  ): Promise<AvailabilityResponse> {
    if (scenario === 'availability-loading') return waitForever()
    await wait()
    if (scenario === 'availability-error') {
      throw apiError(503, availabilityErrorFixture)
    }
    const service = servicesResponseFixture.data.find(
      (item) => item.id === serviceId,
    )
    if (!service) {
      throw apiError(404, {
        error: {
          code: 'service_not_found',
          message: 'Serviço não encontrado.',
        },
      })
    }
    const empty = scenario === 'availability-empty' || isWeekend(date)
    return mapAvailabilityResponseDto(
      buildAvailabilityResponseFixture(
        serviceId,
        date,
        service.duration_minutes,
        empty,
      ),
    )
  },

  async createAppointment(
    input: CreateAppointmentInput,
    scenario: FixtureScenario,
  ): Promise<Appointment> {
    await wait(import.meta.env.MODE === 'test' ? 0 : 700)
    if (scenario === 'conflict') throw apiError(409, conflictErrorFixture)
    const request = mapCreateAppointmentInputToDto(input)
    const service = servicesResponseFixture.data.find(
      (item) => item.id === request.service_id,
    )
    if (!service) {
      throw apiError(404, {
        error: {
          code: 'service_not_found',
          message: 'Serviço não encontrado.',
        },
      })
    }
    return mapAppointmentResponseDto(
      buildAppointmentResponseFixture(request, {
        id: service.id,
        name: service.name,
        duration_minutes: service.duration_minutes,
      }),
    )
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

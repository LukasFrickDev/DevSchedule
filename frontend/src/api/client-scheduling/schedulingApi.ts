import type {
  ApiError,
  Appointment,
  Availability,
  CreateAppointmentPayload,
  Service,
} from '../../types'

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

function apiError(code: ApiError['error']['code'], message: string): ApiError {
  return { error: { code, message } }
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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw apiError('internal_error', 'A URL da API não foi configurada.')
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options)
  } catch {
    throw apiError('internal_error', 'Não foi possível conectar à API.')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    if (isApiError(payload)) throw payload
    throw apiError('internal_error', 'Não foi possível concluir a solicitação.')
  }

  return payload as T
}

export const schedulingApi = {
  async listServices(): Promise<Service[]> {
    const response = await request<{ data: Service[] }>('/services/')
    return response.data
  },

  async getAvailability(
    service_id: string,
    date: Availability['date'],
  ): Promise<Availability> {
    const searchParams = new URLSearchParams({ service_id, date })
    const response = await request<{ data: Availability }>(
      `/availability/?${searchParams}`,
    )
    return response.data
  },

  async createAppointment(
    payload: CreateAppointmentPayload,
  ): Promise<Appointment> {
    const response = await request<{ data: Appointment }>('/appointments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return response.data
  },
}

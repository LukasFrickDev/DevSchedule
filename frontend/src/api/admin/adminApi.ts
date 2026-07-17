import type {
  AdminAppointmentsResponse,
  ApiDate,
  ApiError,
  Appointment,
  AppointmentStatus,
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

async function request<T>(
  path: string,
  token?: string,
  options?: RequestInit,
): Promise<T> {
  if (!apiBaseUrl) {
    throw apiError('internal_error', 'A URL da API não foi configurada.')
  }

  const headers = new Headers(options?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers })
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

export const adminApi = {
  async login(username: string, password: string): Promise<string> {
    const response = await request<{ data: { token: string } }>('/admin/login/', undefined, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return response.data.token
  },

  listAppointments(token: string, date?: ApiDate): Promise<AdminAppointmentsResponse> {
    const searchParams = new URLSearchParams({ page: '1' })
    if (date) searchParams.set('date', date)
    return request<AdminAppointmentsResponse>(
      `/admin/appointments/?${searchParams}`,
      token,
    )
  },

  updateAppointmentStatus(
    token: string,
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    return request<{ data: Appointment }>(`/admin/appointments/${id}/status/`, token, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then((response) => response.data)
  },

  cancelAppointment(token: string, id: string): Promise<Appointment> {
    return request<{ data: Appointment }>(`/admin/appointments/${id}/cancel/`, token, {
      method: 'POST',
    }).then((response) => response.data)
  },

  async deleteAppointment(token: string, id: string): Promise<void> {
    await request<void>(`/admin/appointments/${id}/`, token, { method: 'DELETE' })
  },
}

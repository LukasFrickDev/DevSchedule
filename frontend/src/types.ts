export type ApiDate = `${number}-${number}-${number}`
export type ApiTime = `${number}:${number}`

export type AppointmentStatus =
  'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type ApiErrorCode =
  | 'validation_error'
  | 'authentication_failed'
  | 'permission_denied'
  | 'not_found'
  | 'slot_unavailable'
  | 'internal_error'

export type Service = {
  id: string
  name: string
  description: string
  duration_minutes: number
}

export type AvailabilitySlot = {
  start: ApiTime
  end: ApiTime
  available: boolean
}

export type Availability = {
  service_id: string
  date: ApiDate
  timezone: string
  slots: AvailabilitySlot[]
}

export type CreateAppointmentPayload = {
  service_id: string
  date: ApiDate
  time: ApiTime
  customer_name: string
  customer_phone: string
}

export type Appointment = {
  id: string
  confirmation_code: string
  customer_name: string
  customer_phone: string
  service: {
    id: string
    name: string
    duration_minutes: number
  }
  scheduled_at: string
  status: AppointmentStatus
  created_at: string
  updated_at: string
}

export type ApiError = {
  error: {
    code: ApiErrorCode
    message: string
    fields?: Record<string, string[]>
  }
}

export type FlowStep =
  'service' | 'schedule' | 'details' | 'review' | 'success' | 'conflict'

export type FixtureScenario =
  | 'default'
  | 'services-loading'
  | 'services-error'
  | 'services-empty'
  | 'availability-loading'
  | 'availability-error'
  | 'availability-empty'
  | 'conflict'

export type AvailabilityConflict = {
  service_id: string
  date: ApiDate
  start: ApiTime
}

export type AdminAppointmentsResponse = {
  count: number
  next: string | null
  previous: string | null
  summary: AdminAppointmentsSummary
  results: Appointment[]
}

export type AdminAppointmentsSummary = {
  total: number
  scheduled: number
  confirmed: number
  completed: number
  cancelled: number
}

export type UpdateAppointmentStatusPayload = {
  status: AppointmentStatus
}

export type AdminFixtureScenario =
  'default' | 'loading' | 'error' | 'empty' | 'status-error' | 'delete-error'

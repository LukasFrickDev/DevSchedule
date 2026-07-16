export type ApiDate = `${number}-${number}-${number}`
export type ApiTime = `${number}:${number}`

export type AppointmentStatus =
  'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

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
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}

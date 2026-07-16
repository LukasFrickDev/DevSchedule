export type UUID = string
export type ApiDate = `${number}-${number}-${number}`
export type Time = `${number}:${number}`
export type AppointmentStatus =
  'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type Service = {
  id: UUID
  name: string
  description: string
  durationMinutes: number
}

export type AvailabilitySlot = {
  start: Time
  end: Time
  available: boolean
}

export type AvailabilityResponse = {
  serviceId: UUID
  date: ApiDate
  timezone: string
  slots: AvailabilitySlot[]
}

export type CreateAppointmentInput = {
  serviceId: UUID
  date: ApiDate
  time: Time
  customerName: string
  customerPhone: string
}

export type AppointmentService = {
  id: UUID
  name: string
  durationMinutes: number
}

export type Appointment = {
  id: UUID
  confirmationCode: string
  customerName: string
  customerPhone: string
  service: AppointmentService
  scheduledAt: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export type ApiError = {
  status: number
  code: string
  message: string
  fields?: Record<string, string[]>
}

export type AvailabilityConflict = {
  serviceId: UUID
  date: ApiDate
  start: Time
}

export type FixtureScenario =
  | 'default'
  | 'services-loading'
  | 'services-error'
  | 'services-empty'
  | 'availability-loading'
  | 'availability-error'
  | 'availability-empty'
  | 'conflict'

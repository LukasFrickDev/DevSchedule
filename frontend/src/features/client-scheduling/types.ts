export type UUID = string
export type ApiDate = `${number}-${number}-${number}`
export type AppointmentStatus = 'SCHEDULED'

export type Service = {
  id: UUID
  name: string
  description: string
  durationMinutes: number
  active: boolean
}

export type AvailabilitySlot = {
  time: `${number}:${number}`
  available: boolean
}

export type AvailabilityResponse = {
  serviceId: UUID
  date: ApiDate
  slots: AvailabilitySlot[]
}

export type CreateAppointmentInput = {
  serviceId: UUID
  date: ApiDate
  time: AvailabilitySlot['time']
  customerName: string
  customerPhone: string
}

export type Appointment = CreateAppointmentInput & {
  id: UUID
  status: AppointmentStatus
  confirmationCode: string
}

export type ApiError = {
  status: number
  code: string
  message: string
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

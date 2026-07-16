export type ApiDateDto = `${number}-${number}-${number}`
export type ApiTimeDto = `${number}:${number}`
export type ApiAppointmentStatusDto =
  'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export type ApiServiceDto = {
  id: string
  name: string
  description: string
  duration_minutes: number
}

export type ApiServicesResponseDto = {
  data: ApiServiceDto[]
}

export type ApiAvailabilitySlotDto = {
  start: ApiTimeDto
  end: ApiTimeDto
  available: boolean
}

export type ApiAvailabilityDataDto = {
  service_id: string
  date: ApiDateDto
  timezone: string
  slots: ApiAvailabilitySlotDto[]
}

export type ApiAvailabilityResponseDto = {
  data: ApiAvailabilityDataDto
}

export type ApiCreateAppointmentRequestDto = {
  service_id: string
  date: ApiDateDto
  time: ApiTimeDto
  customer_name: string
  customer_phone: string
}

export type ApiAppointmentServiceDto = {
  id: string
  name: string
  duration_minutes: number
}

export type ApiAppointmentDto = {
  id: string
  confirmation_code: string
  customer_name: string
  customer_phone: string
  service: ApiAppointmentServiceDto
  scheduled_at: string
  status: ApiAppointmentStatusDto
  created_at: string
  updated_at: string
}

export type ApiAppointmentResponseDto = {
  data: ApiAppointmentDto
}

export type ApiErrorResponseDto = {
  error: {
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}

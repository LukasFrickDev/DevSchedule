import { normalizeAndFormatPhone } from '../phone'
import type {
  ApiError,
  Appointment,
  AvailabilityResponse,
  CreateAppointmentInput,
  Service,
} from '../types'
import type {
  ApiAppointmentResponseDto,
  ApiAvailabilityResponseDto,
  ApiCreateAppointmentRequestDto,
  ApiErrorResponseDto,
  ApiServiceDto,
  ApiServicesResponseDto,
} from './types'

export function mapServiceDto(dto: ApiServiceDto): Service {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    durationMinutes: dto.duration_minutes,
  }
}

export function mapServicesResponseDto(dto: ApiServicesResponseDto): Service[] {
  return dto.data.map(mapServiceDto)
}

export function mapAvailabilityResponseDto(
  dto: ApiAvailabilityResponseDto,
): AvailabilityResponse {
  return {
    serviceId: dto.data.service_id,
    date: dto.data.date,
    timezone: dto.data.timezone,
    slots: dto.data.slots.map((slot) => ({
      start: slot.start,
      end: slot.end,
      available: slot.available,
    })),
  }
}

export function mapCreateAppointmentInputToDto(
  input: CreateAppointmentInput,
): ApiCreateAppointmentRequestDto {
  return {
    service_id: input.serviceId,
    date: input.date,
    time: input.time,
    customer_name: input.customerName,
    customer_phone: input.customerPhone.replace(/\D/g, ''),
  }
}

export function mapAppointmentResponseDto(
  dto: ApiAppointmentResponseDto,
): Appointment {
  return {
    id: dto.data.id,
    confirmationCode: dto.data.confirmation_code,
    customerName: dto.data.customer_name,
    customerPhone: normalizeAndFormatPhone(dto.data.customer_phone),
    service: {
      id: dto.data.service.id,
      name: dto.data.service.name,
      durationMinutes: dto.data.service.duration_minutes,
    },
    scheduledAt: dto.data.scheduled_at,
    status: dto.data.status,
    createdAt: dto.data.created_at,
    updatedAt: dto.data.updated_at,
  }
}

export function mapErrorResponseDto(
  status: number,
  dto: ApiErrorResponseDto,
): ApiError {
  return {
    status,
    code: dto.error.code,
    message: dto.error.message,
    fields: dto.error.fields,
  }
}

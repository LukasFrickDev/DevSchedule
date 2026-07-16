import { useEffect, useRef, useState } from 'react'

import {
  inputDateToApiDate,
  isValidFutureOrToday,
  todayAsInputDate,
} from './date'
import {
  fixtureSchedulingApi,
  getFixtureScenario,
  isApiError,
} from './api/fixtureSchedulingApi'
import { normalizeAndFormatPhone } from './phone'
import type {
  Appointment,
  AvailabilityConflict,
  AvailabilityResponse,
  AvailabilitySlot,
  FixtureScenario,
  Service,
  Time,
} from './types'

export type FlowStep =
  'service' | 'schedule' | 'details' | 'review' | 'success' | 'conflict'

type AsyncState<T> =
  | { status: 'idle' | 'loading'; data: T }
  | { status: 'success'; data: T }
  | { status: 'error'; data: T; message: string }

const emptyServices: Service[] = []
const emptyAvailability: AvailabilityResponse | null = null

export function matchesAvailabilityConflict(
  conflict: AvailabilityConflict | null,
  serviceId: string,
  date: AvailabilityResponse['date'] | null,
  start: Time,
) {
  return Boolean(
    conflict &&
    date &&
    conflict.serviceId === serviceId &&
    conflict.date === date &&
    conflict.start === start,
  )
}

function readableError(error: unknown, fallback: string) {
  return isApiError(error) ? error.message : fallback
}

export function useSchedulingFlow() {
  const [scenario] = useState<FixtureScenario>(() => getFixtureScenario())
  const [step, setStep] = useState<FlowStep>('service')
  const [services, setServices] = useState<AsyncState<Service[]>>({
    status: 'loading',
    data: emptyServices,
  })
  const [servicesRequest, setServicesRequest] = useState(0)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [inputDate, setInputDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<Time | null>(null)
  const [availability, setAvailability] = useState<
    AsyncState<AvailabilityResponse | null>
  >({ status: 'idle', data: emptyAvailability })
  const [availabilityRequest, setAvailabilityRequest] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    phone?: string
  }>({})
  const [scheduleError, setScheduleError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [availabilityConflict, setAvailabilityConflict] =
    useState<AvailabilityConflict | null>(null)

  const apiDate = inputDateToApiDate(inputDate)

  useEffect(() => {
    let active = true
    fixtureSchedulingApi
      .listServices(scenario)
      .then((data) => {
        if (active) setServices({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (active) {
          setServices({
            status: 'error',
            data: emptyServices,
            message: readableError(
              error,
              'Não foi possível carregar os serviços.',
            ),
          })
        }
      })
    return () => {
      active = false
    }
  }, [scenario, servicesRequest])

  useEffect(() => {
    if (!selectedService || !apiDate || !isValidFutureOrToday(inputDate)) {
      return
    }

    let active = true
    fixtureSchedulingApi
      .getAvailability(selectedService.id, apiDate, scenario)
      .then((data) => {
        if (active) setAvailability({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (active) {
          setAvailability({
            status: 'error',
            data: emptyAvailability,
            message: readableError(
              error,
              'Não foi possível consultar a agenda.',
            ),
          })
        }
      })
    return () => {
      active = false
    }
  }, [apiDate, availabilityRequest, inputDate, scenario, selectedService])

  function chooseService(service: Service) {
    if (service.id !== selectedService?.id) {
      setInputDate('')
      setSelectedTime(null)
      setAvailability({ status: 'idle', data: emptyAvailability })
    }
    setSelectedService(service)
  }

  function continueFromService() {
    if (selectedService) setStep('schedule')
  }

  function changeDate(value: string) {
    setInputDate(value)
    setSelectedTime(null)
    setScheduleError('')
    setAvailability(
      selectedService && isValidFutureOrToday(value)
        ? { status: 'loading', data: emptyAvailability }
        : { status: 'idle', data: emptyAvailability },
    )
  }

  function chooseTime(slot: AvailabilitySlot) {
    if (
      slot.available &&
      selectedService &&
      !matchesAvailabilityConflict(
        availabilityConflict,
        selectedService.id,
        apiDate,
        slot.start,
      )
    ) {
      setSelectedTime(slot.start)
      setScheduleError('')
    }
  }

  function continueFromSchedule() {
    if (!inputDate || !isValidFutureOrToday(inputDate)) {
      setScheduleError('Escolha uma data válida, igual ou posterior a hoje.')
      return
    }
    if (!selectedTime) {
      setScheduleError('Escolha um horário disponível para continuar.')
      return
    }
    setScheduleError('')
    setStep('details')
  }

  function continueFromDetails() {
    const errors: { name?: string; phone?: string } = {}
    if (name.trim().length < 2) {
      errors.name = 'Informe seu nome com pelo menos 2 caracteres.'
    }
    const phoneDigits = phone.replace(/\D/g, '')
    if (phoneDigits.length !== 10 && phoneDigits.length !== 11) {
      errors.phone = 'Informe um telefone com DDD.'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length === 0) setStep('review')
  }

  async function confirmAppointment() {
    if (
      submittingRef.current ||
      !selectedService ||
      !apiDate ||
      !selectedTime
    ) {
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    try {
      const created = await fixtureSchedulingApi.createAppointment(
        {
          serviceId: selectedService.id,
          date: apiDate,
          time: selectedTime,
          customerName: name.trim(),
          customerPhone: phone.trim(),
        },
        scenario,
      )
      setAppointment(created)
      setStep('success')
    } catch (error: unknown) {
      if (isApiError(error) && error.code === 'slot_unavailable') {
        setAvailabilityConflict({
          serviceId: selectedService.id,
          date: apiDate,
          start: selectedTime,
        })
        setStep('conflict')
      }
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  function recoverFromConflict() {
    setSelectedTime(null)
    setScheduleError('O horário anterior ficou indisponível. Escolha outro.')
    setStep('schedule')
  }

  function startOver() {
    setStep('service')
    setSelectedService(null)
    setInputDate('')
    setSelectedTime(null)
    setAvailability({ status: 'idle', data: emptyAvailability })
    setName('')
    setPhone('')
    setFieldErrors({})
    setScheduleError('')
    setAppointment(null)
    setAvailabilityConflict(null)
  }

  return {
    step,
    services,
    selectedService,
    inputDate,
    apiDate,
    selectedTime,
    availability,
    name,
    phone,
    fieldErrors,
    scheduleError,
    submitting,
    appointment,
    availabilityConflict,
    conflictedTime: availabilityConflict?.start ?? null,
    minDate: todayAsInputDate(),
    chooseService,
    continueFromService,
    changeDate,
    chooseTime,
    isSlotUnavailable: (slot: AvailabilitySlot) =>
      !slot.available ||
      Boolean(
        selectedService &&
        matchesAvailabilityConflict(
          availabilityConflict,
          selectedService.id,
          apiDate,
          slot.start,
        ),
      ),
    setName,
    setPhone: (value: string) => setPhone(normalizeAndFormatPhone(value)),
    continueFromSchedule,
    continueFromDetails,
    confirmAppointment,
    recoverFromConflict,
    startOver,
    retryServices: () => {
      setServices({ status: 'loading', data: emptyServices })
      setServicesRequest((value) => value + 1)
    },
    retryAvailability: () => {
      setAvailability({ status: 'loading', data: emptyAvailability })
      setAvailabilityRequest((value) => value + 1)
    },
    goToService: () => setStep('service'),
    goToSchedule: () => setStep('schedule'),
    goToDetails: () => setStep('details'),
    goToReview: () => setStep('review'),
  }
}

export type SchedulingFlowController = ReturnType<typeof useSchedulingFlow>

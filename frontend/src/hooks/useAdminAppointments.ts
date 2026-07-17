import { useEffect, useMemo, useRef, useState } from 'react'

import { fixtureAdminApi } from '../api/admin/fixtureAdminApi'
import type {
  AdminFixtureScenario,
  ApiError,
  Appointment,
  AppointmentStatus,
} from '../types'
import { inputDateToApiDate, todayAsInputDate } from '../utils/date'

type Feedback = {
  type: 'success' | 'error'
  message: string
} | null

type PendingAction = {
  appointmentId: string
  kind: 'status' | 'delete'
} | null

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error
  )
}

function readableError(error: unknown, fallback: string) {
  return isApiError(error) ? error.error.message : fallback
}

export function useAdminAppointments(scenario: AdminFixtureScenario) {
  const [selectedDate, setSelectedDate] = useState(todayAsInputDate)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const pendingRef = useRef(false)

  useEffect(() => {
    let active = true
    const apiDate = selectedDate ? inputDateToApiDate(selectedDate) : null

    fixtureAdminApi
      .listAppointments({ date: apiDate ?? undefined, page: 1 }, scenario)
      .then((response) => {
        if (!active) return
        setAppointments(response.results)
        setLoadError('')
        setLoading(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        setAppointments([])
        setLoadError(
          readableError(error, 'Não foi possível carregar os agendamentos.'),
        )
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [requestVersion, scenario, selectedDate])

  const indicators = useMemo(
    () => ({
      total: appointments.length,
      SCHEDULED: appointments.filter(
        (appointment) => appointment.status === 'SCHEDULED',
      ).length,
      CONFIRMED: appointments.filter(
        (appointment) => appointment.status === 'CONFIRMED',
      ).length,
      COMPLETED: appointments.filter(
        (appointment) => appointment.status === 'COMPLETED',
      ).length,
      CANCELLED: appointments.filter(
        (appointment) => appointment.status === 'CANCELLED',
      ).length,
    }),
    [appointments],
  )

  function changeDate(value: string) {
    setSelectedDate(value)
    setLoading(true)
    setLoadError('')
    setFeedback(null)
  }

  function clearDateFilter() {
    changeDate('')
  }

  function retry() {
    setLoading(true)
    setLoadError('')
    setRequestVersion((version) => version + 1)
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    if (pendingRef.current) return false

    pendingRef.current = true
    setPendingAction({ appointmentId: id, kind: 'status' })
    setFeedback(null)
    try {
      const updated = await fixtureAdminApi.updateAppointmentStatus(
        id,
        { status },
        scenario,
      )
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === updated.id ? updated : appointment,
        ),
      )
      setFeedback({
        type: 'success',
        message:
          status === 'CANCELLED'
            ? 'Agendamento cancelado. O registro foi preservado.'
            : 'Status atualizado com sucesso.',
      })
      return true
    } catch (error: unknown) {
      setFeedback({
        type: 'error',
        message: readableError(error, 'Não foi possível alterar o status.'),
      })
      return false
    } finally {
      pendingRef.current = false
      setPendingAction(null)
    }
  }

  async function deleteAppointment(id: string) {
    if (pendingRef.current) return false

    pendingRef.current = true
    setPendingAction({ appointmentId: id, kind: 'delete' })
    setFeedback(null)
    try {
      await fixtureAdminApi.deleteAppointment(id, scenario)
      setAppointments((current) =>
        current.filter((appointment) => appointment.id !== id),
      )
      setFeedback({
        type: 'success',
        message: 'Agendamento excluído permanentemente.',
      })
      return true
    } catch (error: unknown) {
      setFeedback({
        type: 'error',
        message: readableError(error, 'Não foi possível excluir o registro.'),
      })
      return false
    } finally {
      pendingRef.current = false
      setPendingAction(null)
    }
  }

  return {
    appointments,
    selectedDate,
    loading,
    loadError,
    feedback,
    pendingAction,
    indicators,
    changeDate,
    clearDateFilter,
    retry,
    updateStatus,
    deleteAppointment,
    dismissFeedback: () => setFeedback(null),
  }
}

export type AdminAppointmentsController = ReturnType<
  typeof useAdminAppointments
>

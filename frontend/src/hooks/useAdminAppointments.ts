import { useEffect, useMemo, useRef, useState } from 'react'

import { adminApi, isApiError } from '../api/admin/adminApi'
import type { Appointment, AppointmentStatus } from '../types'
import { inputDateToApiDate, todayAsInputDate } from '../utils/date'

type Feedback = {
  type: 'success' | 'error'
  message: string
} | null

type PendingAction = {
  appointmentId: string
  kind: 'status' | 'cancel' | 'delete'
} | null

function readableError(error: unknown, fallback: string) {
  return isApiError(error) ? error.error.message : fallback
}

export function useAdminAppointments(
  token: string,
  onAuthenticationFailed: () => void,
) {
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

    adminApi
      .listAppointments(token, apiDate ?? undefined)
      .then((response) => {
        if (!active) return
        setAppointments(response.results)
        setLoadError('')
        setLoading(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (isApiError(error) && error.error.code === 'authentication_failed') {
          onAuthenticationFailed()
          return
        }
        setAppointments([])
        setLoadError(
          readableError(error, 'Não foi possível carregar os agendamentos.'),
        )
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [onAuthenticationFailed, requestVersion, selectedDate, token])

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
      await adminApi.updateAppointmentStatus(token, id, status)
      setLoading(true)
      setRequestVersion((version) => version + 1)
      setFeedback({
        type: 'success',
        message:
          status === 'CANCELLED'
            ? 'Agendamento cancelado. O registro foi preservado.'
            : 'Status atualizado com sucesso.',
      })
      return true
    } catch (error: unknown) {
      if (isApiError(error) && error.error.code === 'authentication_failed') {
        onAuthenticationFailed()
        return false
      }
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

  async function cancelAppointment(id: string) {
    if (pendingRef.current) return false

    pendingRef.current = true
    setPendingAction({ appointmentId: id, kind: 'cancel' })
    setFeedback(null)
    try {
      await adminApi.cancelAppointment(token, id)
      setLoading(true)
      setRequestVersion((version) => version + 1)
      setFeedback({
        type: 'success',
        message: 'Agendamento cancelado. O registro foi preservado.',
      })
      return true
    } catch (error: unknown) {
      if (isApiError(error) && error.error.code === 'authentication_failed') {
        onAuthenticationFailed()
        return false
      }
      setFeedback({
        type: 'error',
        message: readableError(error, 'Não foi possível cancelar o agendamento.'),
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
      await adminApi.deleteAppointment(token, id)
      setLoading(true)
      setRequestVersion((version) => version + 1)
      setFeedback({
        type: 'success',
        message: 'Agendamento excluído permanentemente.',
      })
      return true
    } catch (error: unknown) {
      if (isApiError(error) && error.error.code === 'authentication_failed') {
        onAuthenticationFailed()
        return false
      }
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
    cancelAppointment,
    deleteAppointment,
    dismissFeedback: () => setFeedback(null),
  }
}

export type AdminAppointmentsController = ReturnType<
  typeof useAdminAppointments
>

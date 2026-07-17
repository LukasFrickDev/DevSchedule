import { useEffect, useRef, useState } from 'react'

import { adminApi, isApiError } from '../api/admin/adminApi'
import type {
  AdminAppointmentsSummary,
  Appointment,
  AppointmentStatus,
  Service,
} from '../types'
import { inputDateToApiDate } from '../utils/date'

type PageSize = 10 | 25 | 50 | 100

type Feedback = {
  type: 'success' | 'error'
  message: string
} | null

type PendingAction = {
  appointmentId: string
  kind: 'status' | 'cancel' | 'delete'
} | null

const noop = () => undefined
const emptySummary: AdminAppointmentsSummary = {
  total: 0,
  scheduled: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
}

function readableError(error: unknown, fallback: string) {
  return isApiError(error) ? error.error.message : fallback
}

export function useAdminAppointments(
  token: string,
  onAuthenticationFailed: () => void = noop,
) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | ''>(
    '',
  )
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [hasMore, setHasMore] = useState(false)
  const [summary, setSummary] = useState<AdminAppointmentsSummary>(emptySummary)
  const pendingRef = useRef(false)

  useEffect(() => {
    let active = true
    adminApi.listServices().then(
      (data) => {
        if (active) setServices(data)
      },
      () => undefined,
    )
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    const apiDate = selectedDate ? inputDateToApiDate(selectedDate) : null
    const appending = page > 1

    adminApi
      .listAppointments(
        token,
        apiDate ?? undefined,
        page,
        pageSize,
        selectedServiceId || undefined,
        selectedStatus || undefined,
      )
      .then((response) => {
        if (!active) return
        setAppointments((current) =>
          appending ? [...current, ...response.results] : response.results,
        )
        setSummary(response.summary)
        setHasMore(Boolean(response.next))
        setLoadError('')
        setLoading(false)
        setLoadingMore(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (isApiError(error) && error.error.code === 'authentication_failed') {
          onAuthenticationFailed()
          return
        }
        if (appending) {
          setFeedback({
            type: 'error',
            message: readableError(
              error,
              'Não foi possível carregar mais agendamentos.',
            ),
          })
          setLoadingMore(false)
          return
        }
        setAppointments([])
        setHasMore(false)
        setSummary(emptySummary)
        setLoadError(
          readableError(error, 'Não foi possível carregar os agendamentos.'),
        )
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [
    onAuthenticationFailed,
    page,
    pageSize,
    requestVersion,
    selectedDate,
    selectedServiceId,
    selectedStatus,
    token,
  ])

  function resetList() {
    setPage(1)
    setAppointments([])
    setHasMore(false)
    setSummary(emptySummary)
    setLoading(true)
    setLoadingMore(false)
    setLoadError('')
  }

  function changeDate(value: string) {
    setSelectedDate(value)
    setFeedback(null)
    resetList()
  }

  function clearDateFilter() {
    setSelectedDate('')
    setSelectedServiceId('')
    setSelectedStatus('')
    setFeedback(null)
    resetList()
  }

  function changeServiceFilter(value: string) {
    setSelectedServiceId(value)
    setFeedback(null)
    resetList()
  }

  function changeStatusFilter(value: AppointmentStatus | '') {
    setSelectedStatus(value)
    setFeedback(null)
    resetList()
  }

  function retry() {
    resetList()
    setRequestVersion((version) => version + 1)
  }

  function changePageSize(value: PageSize) {
    setPageSize(value)
    resetList()
  }

  function loadMore() {
    if (!hasMore || loadingMore) return
    setLoadingMore(true)
    setPage((current) => current + 1)
  }

  function refreshAppointments() {
    resetList()
    setRequestVersion((version) => version + 1)
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    if (pendingRef.current) return false

    pendingRef.current = true
    setPendingAction({ appointmentId: id, kind: 'status' })
    setFeedback(null)
    try {
      await adminApi.updateAppointmentStatus(token, id, status)
      refreshAppointments()
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
      refreshAppointments()
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
        message: readableError(
          error,
          'Não foi possível cancelar o agendamento.',
        ),
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
      refreshAppointments()
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
    selectedServiceId,
    selectedStatus,
    services,
    loading,
    loadingMore,
    loadError,
    feedback,
    pendingAction,
    summary,
    indicators: {
      total: summary.total,
      SCHEDULED: summary.scheduled,
      CONFIRMED: summary.confirmed,
      COMPLETED: summary.completed,
      CANCELLED: summary.cancelled,
    },
    hasMore,
    pageSize,
    changeDate,
    clearDateFilter,
    changeServiceFilter,
    changeStatusFilter,
    changePageSize,
    loadMore,
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

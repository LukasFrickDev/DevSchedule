import { useState } from 'react'

import { useAdminAppointments } from '../../../hooks/useAdminAppointments'
import type { Appointment } from '../../../types'
import {
  formatApiDate,
  inputDateToApiDate,
  todayAsInputDate,
} from '../../../utils/date'
import { AppointmentList } from '../AppointmentList'
import { ConfirmDialog } from '../ConfirmDialog'
import {
  ClearButton,
  DashboardHeader,
  ErrorState,
  Feedback,
  FilterBar,
  Indicators,
  ListHeader,
  LoadingIndicator,
  LoadingState,
  RetryButton,
  Section,
} from './styles'

type AdminDashboardProps = {
  token: string
  onAuthenticationFailed: () => void
}

type DialogState = {
  kind: 'cancel' | 'delete'
  appointment: Appointment
} | null

export function AdminDashboard({ token, onAuthenticationFailed }: AdminDashboardProps) {
  const admin = useAdminAppointments(token, onAuthenticationFailed)
  const [dialog, setDialog] = useState<DialogState>(null)
  const today = inputDateToApiDate(todayAsInputDate())
  const selectedApiDate = admin.selectedDate
    ? inputDateToApiDate(admin.selectedDate)
    : null

  const indicatorItems = [
    ['Total', admin.indicators.total],
    ['Agendados', admin.indicators.SCHEDULED],
    ['Confirmados', admin.indicators.CONFIRMED],
    ['Concluídos', admin.indicators.COMPLETED],
    ['Cancelados', admin.indicators.CANCELLED],
  ] as const

  async function confirmDialogAction() {
    if (!dialog) return

    const success =
      dialog.kind === 'cancel'
        ? await admin.cancelAppointment(dialog.appointment.id)
        : await admin.deleteAppointment(dialog.appointment.id)
    if (success) setDialog(null)
  }

  const dialogSubmitting = Boolean(
    dialog && admin.pendingAction?.appointmentId === dialog.appointment.id,
  )

  return (
    <>
      <DashboardHeader>
        <div>
          <p>Visão operacional</p>
          <h1>Agenda administrativa</h1>
          <span>Hoje, {today ? formatApiDate(today) : 'data atual'}</span>
        </div>
      </DashboardHeader>

      <Indicators aria-label="Indicadores dos agendamentos">
        {indicatorItems.map(([label, value]) => (
          <li key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </Indicators>

      <Section aria-labelledby="appointments-title">
        <ListHeader>
          <div>
            <h2 id="appointments-title">Agendamentos</h2>
            <p>
              {selectedApiDate
                ? `Exibindo ${formatApiDate(selectedApiDate)}`
                : 'Exibindo todas as datas'}
            </p>
          </div>
          <FilterBar>
            <label htmlFor="admin-date-filter">Filtrar por data</label>
            <input
              id="admin-date-filter"
              type="date"
              value={admin.selectedDate}
              onChange={(event) => admin.changeDate(event.target.value)}
            />
            <ClearButton
              type="button"
              disabled={!admin.selectedDate}
              onClick={admin.clearDateFilter}
            >
              Limpar filtro
            </ClearButton>
          </FilterBar>
        </ListHeader>

        {admin.feedback && (
          <Feedback
            $danger={admin.feedback.type === 'error'}
            role={admin.feedback.type === 'error' ? 'alert' : 'status'}
          >
            {admin.feedback.message}
          </Feedback>
        )}

        {admin.loading ? (
          <LoadingState aria-live="polite">
            <LoadingIndicator aria-hidden="true" />
            <p>Carregando agendamentos…</p>
          </LoadingState>
        ) : admin.loadError ? (
          <ErrorState role="alert">
            <strong>Não foi possível abrir a agenda.</strong>
            <p>{admin.loadError}</p>
            <RetryButton type="button" onClick={admin.retry}>
              Tentar novamente
            </RetryButton>
          </ErrorState>
        ) : (
          <AppointmentList
            appointments={admin.appointments}
            pendingAction={admin.pendingAction}
            onUpdateStatus={admin.updateStatus}
            onRequestCancel={(appointment) =>
              setDialog({ kind: 'cancel', appointment })
            }
            onRequestDelete={(appointment) =>
              setDialog({ kind: 'delete', appointment })
            }
          />
        )}
      </Section>

      {dialog && (
        <ConfirmDialog
          kind={dialog.kind}
          customerName={dialog.appointment.customer_name}
          submitting={dialogSubmitting}
          onClose={() => setDialog(null)}
          onConfirm={() => void confirmDialogAction()}
        />
      )}
    </>
  )
}

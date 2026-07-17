import { useState } from 'react'

import { useAdminAppointments } from '../../../hooks/useAdminAppointments'
import type { Appointment, AppointmentStatus } from '../../../types'
import {
  formatApiDate,
  inputDateToApiDate,
  todayAsInputDate,
} from '../../../utils/date'
import { Calendar } from '../../Calendar'
import { AppointmentList } from '../AppointmentList'
import { ConfirmDialog } from '../ConfirmDialog'
import {
  ClearButton,
  DashboardHeader,
  ErrorState,
  Feedback,
  FilterBar,
  FilterField,
  Indicators,
  ListHeader,
  LoadMoreButton,
  LoadingIndicator,
  LoadingState,
  PaginationControls,
  PageSizeSelect,
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

const statusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export function AdminDashboard({
  token,
  onAuthenticationFailed,
}: AdminDashboardProps) {
  const admin = useAdminAppointments(token, onAuthenticationFailed)
  const [dialog, setDialog] = useState<DialogState>(null)
  const today = inputDateToApiDate(todayAsInputDate())
  const selectedApiDate = admin.selectedDate
    ? inputDateToApiDate(admin.selectedDate)
    : null

  const indicatorItems = [
    ['Total', admin.summary.total],
    ['Agendados', admin.summary.scheduled],
    ['Confirmados', admin.summary.confirmed],
    ['Concluídos', admin.summary.completed],
    ['Cancelados', admin.summary.cancelled],
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
          <span>Hoje</span>
          <strong>{today ? formatApiDate(today) : 'data atual'}</strong>
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
            <FilterField>
              <label id="admin-date-filter-label">Filtrar por data</label>
              <Calendar
                id="admin-date-filter"
                value={admin.selectedDate}
                labelledBy="admin-date-filter-label"
                onChange={admin.changeDate}
              />
            </FilterField>
            <FilterField>
              <label htmlFor="admin-service-filter">Filtrar por serviço</label>
              <select
                id="admin-service-filter"
                value={admin.selectedServiceId}
                onChange={(event) =>
                  admin.changeServiceFilter(event.target.value)
                }
              >
                <option value="">Todos os serviços</option>
                {admin.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField>
              <label htmlFor="admin-status-filter">
                Filtrar por status atual
              </label>
              <select
                id="admin-status-filter"
                value={admin.selectedStatus}
                onChange={(event) =>
                  admin.changeStatusFilter(
                    event.target.value as AppointmentStatus | '',
                  )
                }
              >
                <option value="">Todos os status</option>
                {Object.entries(statusLabels).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>
            </FilterField>
            <ClearButton
              type="button"
              disabled={
                !admin.selectedDate &&
                !admin.selectedServiceId &&
                !admin.selectedStatus
              }
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
          <>
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
            <PaginationControls>
              <label htmlFor="admin-page-size">Exibir por vez</label>
              <PageSizeSelect
                id="admin-page-size"
                value={admin.pageSize}
                onChange={(event) =>
                  admin.changePageSize(
                    Number(event.target.value) as 10 | 25 | 50 | 100,
                  )
                }
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </PageSizeSelect>
              {admin.hasMore && (
                <LoadMoreButton
                  type="button"
                  disabled={admin.loadingMore}
                  onClick={admin.loadMore}
                >
                  {admin.loadingMore ? 'Carregando…' : 'Ver mais'}
                </LoadMoreButton>
              )}
            </PaginationControls>
          </>
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

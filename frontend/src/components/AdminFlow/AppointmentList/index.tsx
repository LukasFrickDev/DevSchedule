import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import type { AdminAppointmentsController } from '../../../hooks/useAdminAppointments'
import type { Appointment, AppointmentStatus } from '../../../types'
import { normalizeAndFormatPhone } from '../../../utils/phone'
import {
  ActionButton,
  ActionsCell,
  AppointmentsTable,
  DeleteButton,
  EmptyText,
  HiddenLabel,
  ServiceDetails,
  StatusBadge,
  StatusEditor,
  TableFrame,
} from './styles'

const statusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

const statuses = Object.keys(statusLabels) as AppointmentStatus[]

function formatDateTime(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/.exec(value)
  if (!match) return value
  const [, year, month, day, time] = match
  return `${day}/${month}/${year} • ${time}`
}

type AppointmentActionsProps = {
  appointment: Appointment
  pending: boolean
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<boolean>
  onRequestCancel: (appointment: Appointment) => void
  onRequestDelete: (appointment: Appointment) => void
}

function AppointmentActions({
  appointment,
  pending,
  onUpdateStatus,
  onRequestCancel,
  onRequestDelete,
}: AppointmentActionsProps) {
  const [nextStatus, setNextStatus] = useState(appointment.status)

  function applyStatus() {
    if (nextStatus === 'CANCELLED') {
      onRequestCancel(appointment)
      return
    }
    void onUpdateStatus(appointment.id, nextStatus)
  }

  return (
    <StatusEditor>
      <HiddenLabel htmlFor={`status-${appointment.id}`}>
        Novo status de {appointment.customer_name}
      </HiddenLabel>
      <select
        id={`status-${appointment.id}`}
        value={nextStatus}
        disabled={pending}
        onChange={(event) =>
          setNextStatus(event.target.value as AppointmentStatus)
        }
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {statusLabels[status]}
          </option>
        ))}
      </select>
      <ActionButton
        type="button"
        disabled={pending || nextStatus === appointment.status}
        onClick={applyStatus}
      >
        {pending ? 'Processando…' : 'Aplicar status'}
      </ActionButton>
      <DeleteButton
        type="button"
        aria-label={`Excluir agendamento de ${appointment.customer_name}`}
        disabled={pending}
        onClick={() => onRequestDelete(appointment)}
      >
        <Trash2 size={18} aria-hidden="true" />
      </DeleteButton>
    </StatusEditor>
  )
}

type AppointmentListProps = {
  appointments: Appointment[]
  pendingAction: AdminAppointmentsController['pendingAction']
  onUpdateStatus: AppointmentActionsProps['onUpdateStatus']
  onRequestCancel: AppointmentActionsProps['onRequestCancel']
  onRequestDelete: AppointmentActionsProps['onRequestDelete']
}

export function AppointmentList({
  appointments,
  pendingAction,
  onUpdateStatus,
  onRequestCancel,
  onRequestDelete,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return <EmptyText>Nenhum agendamento encontrado.</EmptyText>
  }

  return (
    <TableFrame>
      <AppointmentsTable>
        <caption>Agendamentos exibidos no painel administrativo</caption>
        <thead>
          <tr>
            <th scope="col">Data e horário</th>
            <th scope="col">Cliente</th>
            <th scope="col">Telefone</th>
            <th scope="col">Serviço</th>
            <th scope="col">Status atual</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const pending = pendingAction?.appointmentId === appointment.id
            return (
              <tr key={appointment.id}>
                <td data-label="Data e horário">
                  <strong>{formatDateTime(appointment.scheduled_at)}</strong>
                </td>
                <td data-label="Cliente">
                  <strong>{appointment.customer_name}</strong>
                  <small>{appointment.confirmation_code}</small>
                </td>
                <td data-label="Telefone">
                  {normalizeAndFormatPhone(appointment.customer_phone)}
                </td>
                <td data-label="Serviço">
                  <ServiceDetails>
                    <strong>{appointment.service.name}</strong>
                    <small>{appointment.service.duration_minutes} min</small>
                  </ServiceDetails>
                </td>
                <td data-label="Status atual">
                  <StatusBadge data-status={appointment.status}>
                    {statusLabels[appointment.status]}
                  </StatusBadge>
                </td>
                <ActionsCell data-label="Ações">
                  <AppointmentActions
                    appointment={appointment}
                    pending={pending}
                    onUpdateStatus={onUpdateStatus}
                    onRequestCancel={onRequestCancel}
                    onRequestDelete={onRequestDelete}
                  />
                </ActionsCell>
              </tr>
            )
          })}
        </tbody>
      </AppointmentsTable>
    </TableFrame>
  )
}

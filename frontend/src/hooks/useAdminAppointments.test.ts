import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fixtureAdminApi,
  resetAdminAppointmentsFixture,
} from '../api/admin/fixtureAdminApi'
import { inputDateToApiDate, todayAsInputDate } from '../utils/date'
import { useAdminAppointments } from './useAdminAppointments'

describe('useAdminAppointments', () => {
  beforeEach(() => {
    resetAdminAppointmentsFixture()
    vi.restoreAllMocks()
  })

  it('carrega inicialmente os agendamentos da data atual', async () => {
    const listSpy = vi.spyOn(fixtureAdminApi, 'listAppointments')
    const { result } = renderHook(() => useAdminAppointments('default'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.selectedDate).toBe(todayAsInputDate())
    expect(listSpy).toHaveBeenCalledWith(
      { date: inputDateToApiDate(todayAsInputDate()), page: 1 },
      'default',
    )
    const isWeekend = [0, 6].includes(new Date().getDay())
    expect(result.current.indicators).toEqual(
      isWeekend
        ? {
            total: 0,
            SCHEDULED: 0,
            CONFIRMED: 0,
            COMPLETED: 0,
            CANCELLED: 0,
          }
        : {
            total: 4,
            SCHEDULED: 1,
            CONFIRMED: 1,
            COMPLETED: 1,
            CANCELLED: 1,
          },
    )
  })

  it('limpa o filtro e mostra agendamentos de todas as datas', async () => {
    const { result } = renderHook(() => useAdminAppointments('default'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.selectedDate).toBe('')
    expect(result.current.appointments).toHaveLength(6)
  })

  it('representa o estado vazio', async () => {
    const { result } = renderHook(() => useAdminAppointments('empty'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.appointments).toEqual([])
    expect(result.current.indicators.total).toBe(0)
  })

  it('altera o status e recalcula os indicadores', async () => {
    const { result } = renderHook(() => useAdminAppointments('default'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const target = result.current.appointments.find(
      (appointment) => appointment.status === 'SCHEDULED',
    )
    expect(target).toBeDefined()

    await act(async () => {
      await result.current.updateStatus(target!.id, 'CONFIRMED')
    })

    expect(
      result.current.appointments.find(
        (appointment) => appointment.id === target!.id,
      )?.status,
    ).toBe('CONFIRMED')
    expect(result.current.indicators.SCHEDULED).toBe(1)
    expect(result.current.indicators.CONFIRMED).toBe(2)
  })

  it('cancela preservando o registro na listagem', async () => {
    const { result } = renderHook(() => useAdminAppointments('default'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const target = result.current.appointments[0]

    await act(async () => {
      await result.current.updateStatus(target.id, 'CANCELLED')
    })

    expect(result.current.appointments).toHaveLength(6)
    expect(
      result.current.appointments.find(
        (appointment) => appointment.id === target.id,
      )?.status,
    ).toBe('CANCELLED')
    expect(result.current.feedback?.message).toMatch(/registro foi preservado/i)
  })

  it('exclui o registro e recalcula o total', async () => {
    const { result } = renderHook(() => useAdminAppointments('default'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const target = result.current.appointments[0]

    await act(async () => {
      await result.current.deleteAppointment(target.id)
    })

    expect(result.current.appointments).toHaveLength(5)
    expect(result.current.indicators.total).toBe(5)
    expect(result.current.appointments).not.toContainEqual(
      expect.objectContaining({ id: target.id }),
    )
  })

  it('mantém os dados e mostra o erro de alteração de status', async () => {
    const { result } = renderHook(() => useAdminAppointments('status-error'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const target = result.current.appointments[0]

    await act(async () => {
      await result.current.updateStatus(target.id, 'CONFIRMED')
    })

    expect(result.current.appointments[0].status).toBe(target.status)
    expect(result.current.feedback).toMatchObject({
      type: 'error',
      message: expect.stringMatching(/não foi possível alterar/i),
    })
  })

  it('mantém o registro e mostra o erro de exclusão', async () => {
    const { result } = renderHook(() => useAdminAppointments('delete-error'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => result.current.clearDateFilter())
    await waitFor(() => expect(result.current.loading).toBe(false))
    const target = result.current.appointments[0]

    await act(async () => {
      await result.current.deleteAppointment(target.id)
    })

    expect(result.current.appointments).toContainEqual(target)
    expect(result.current.feedback).toMatchObject({
      type: 'error',
      message: expect.stringMatching(/não foi possível excluir/i),
    })
  })
})

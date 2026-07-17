import { beforeEach, describe, expect, it } from 'vitest'

import type { ApiDate } from '../../types'
import {
  fixtureAdminApi,
  resetAdminAppointmentsFixture,
} from './fixtureAdminApi'
import {
  adminDeleteErrorFixture,
  adminListErrorFixture,
  adminStatusErrorFixture,
  buildAdminAppointmentsFixture,
  dateToApiDate,
} from './fixtures'

describe('contrato e fixtures da API administrativa', () => {
  beforeEach(() => resetAdminAppointmentsFixture())

  it('mantém quatro agendamentos relativos ao dia atual', () => {
    const reference = new Date(2026, 6, 17, 12)
    const appointments = buildAdminAppointmentsFixture(reference)
    const currentDate = '2026-07-17'

    expect(
      appointments.filter((appointment) =>
        appointment.scheduled_at.startsWith(currentDate),
      ),
    ).toHaveLength(4)
    expect(dateToApiDate(reference)).toBe('17-07-2026')
  })

  it('retorna a listagem paginada e as entidades em snake_case', async () => {
    const today = dateToApiDate(new Date())
    const response = await fixtureAdminApi.listAppointments(
      { date: today, page: 1 },
      'default',
    )

    expect(Object.keys(response).sort()).toEqual(
      ['count', 'next', 'previous', 'results'].sort(),
    )
    expect(response.count).toBe(4)
    expect(response.next).toBeNull()
    expect(response.previous).toBeNull()
    expect(response.results[0]).toMatchObject({
      confirmation_code: expect.any(String),
      customer_name: expect.any(String),
      customer_phone: expect.any(String),
      scheduled_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      status: expect.any(String),
    })
    expect(response.results[0]).not.toHaveProperty('customerName')
    expect(response.results[0].service).toHaveProperty('duration_minutes')
  })

  it('representa PATCH de status e DELETE pelo UUID', async () => {
    const all = await fixtureAdminApi.listAppointments({}, 'default')
    const target = all.results[0]

    const updated = await fixtureAdminApi.updateAppointmentStatus(
      target.id,
      { status: 'CONFIRMED' },
      'default',
    )
    expect(updated.id).toBe(target.id)
    expect(updated.status).toBe('CONFIRMED')

    await fixtureAdminApi.deleteAppointment(target.id, 'default')
    const afterDelete = await fixtureAdminApi.listAppointments({}, 'default')
    expect(afterDelete.results).not.toContainEqual(
      expect.objectContaining({ id: target.id }),
    )
  })

  it('preserva os códigos de erro aprovados nos cenários simulados', () => {
    expect(adminListErrorFixture.error.code).toBe('internal_error')
    expect(adminStatusErrorFixture.error.code).toBe('internal_error')
    expect(adminDeleteErrorFixture.error.code).toBe('internal_error')
  })

  it('aceita a data contratual DD-MM-YYYY no filtro', async () => {
    const date = dateToApiDate(new Date()) as ApiDate
    const response = await fixtureAdminApi.listAppointments({ date }, 'default')
    expect(response.results).toHaveLength(4)
  })
})

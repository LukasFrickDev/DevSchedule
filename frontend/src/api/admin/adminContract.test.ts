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
  const friday = new Date(2026, 6, 17, 12)

  beforeEach(() => resetAdminAppointmentsFixture(friday))

  it('mantém quatro agendamentos na referência útil e padroniza duração e horário', () => {
    const appointments = buildAdminAppointmentsFixture(friday)
    const currentDate = '2026-07-17'

    expect(
      appointments.filter((appointment) =>
        appointment.scheduled_at.startsWith(currentDate),
      ),
    ).toHaveLength(4)
    expect(dateToApiDate(friday)).toBe('17-07-2026')
    expect(
      appointments.every(
        (appointment) => appointment.service.duration_minutes === 60,
      ),
    ).toBe(true)
    expect(
      appointments.every((appointment) =>
        /T\d{2}:00:00-03:00$/.test(appointment.scheduled_at),
      ),
    ).toBe(true)
  })

  it('usa segunda-feira como próximo dia útil de uma sexta-feira', () => {
    const appointments = buildAdminAppointmentsFixture(friday)
    const dates = appointments.map((appointment) =>
      appointment.scheduled_at.slice(0, 10),
    )

    expect(dates).toContain('2026-07-16')
    expect(dates).toContain('2026-07-20')
    expect(dates).not.toContain('2026-07-18')
    expect(dates).not.toContain('2026-07-19')
  })

  it('usa sexta-feira como dia útil anterior de uma segunda-feira', () => {
    const appointments = buildAdminAppointmentsFixture(
      new Date(2026, 6, 20, 12),
    )
    const dates = appointments.map((appointment) =>
      appointment.scheduled_at.slice(0, 10),
    )

    expect(dates).toContain('2026-07-17')
    expect(dates).toContain('2026-07-21')
    expect(dates).not.toContain('2026-07-18')
    expect(dates).not.toContain('2026-07-19')
  })

  it.each([
    ['sábado', new Date(2026, 6, 18, 12)],
    ['domingo', new Date(2026, 6, 19, 12)],
  ])('não cria registros na referência de %s', (_, reference) => {
    const appointments = buildAdminAppointmentsFixture(reference)
    const referenceDate = reference.toISOString().slice(0, 10)
    const weekdays = appointments.map((appointment) => {
      const [year, month, day] = appointment.scheduled_at
        .slice(0, 10)
        .split('-')
        .map(Number)
      return new Date(year, month - 1, day, 12).getDay()
    })

    expect(
      appointments.every(
        (appointment) => !appointment.scheduled_at.startsWith(referenceDate),
      ),
    ).toBe(true)
    expect(weekdays.every((weekday) => weekday !== 0 && weekday !== 6)).toBe(
      true,
    )
  })

  it('retorna a listagem paginada e as entidades em snake_case', async () => {
    const today = dateToApiDate(friday)
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
    expect(
      response.results.every(
        (appointment) => appointment.service.duration_minutes === 60,
      ),
    ).toBe(true)
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
    const date = dateToApiDate(friday) as ApiDate
    const response = await fixtureAdminApi.listAppointments({ date }, 'default')
    expect(response.results).toHaveLength(4)
  })

  it('ordena a data filtrada por scheduled_at crescente', async () => {
    const response = await fixtureAdminApi.listAppointments(
      { date: dateToApiDate(friday) },
      'default',
    )
    const scheduledAt = response.results.map(
      (appointment) => appointment.scheduled_at,
    )

    expect(scheduledAt).toEqual([...scheduledAt].sort())
  })

  it('ordena a listagem sem filtro por scheduled_at decrescente', async () => {
    const response = await fixtureAdminApi.listAppointments({}, 'default')
    const scheduledAt = response.results.map(
      (appointment) => appointment.scheduled_at,
    )

    expect(scheduledAt).toEqual([...scheduledAt].sort().reverse())
  })
})

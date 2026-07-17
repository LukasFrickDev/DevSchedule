import { describe, expect, it } from 'vitest'

import type { ApiErrorCode } from '../../types'
import { fixtureSchedulingApi } from './fixtureSchedulingApi'
import {
  availabilityStarts,
  availabilityErrorFixture,
  buildAppointmentResponseFixture,
  conflictErrorFixture,
  serviceErrorFixture,
  servicesResponseFixture,
} from './fixtures'

describe('contrato externo e fixtures da API', () => {
  it('mantém os serviços públicos exatamente em snake_case', () => {
    expect(Object.keys(servicesResponseFixture)).toEqual(['data'])
    for (const service of servicesResponseFixture.data) {
      expect(Object.keys(service).sort()).toEqual(
        ['description', 'duration_minutes', 'id', 'name'].sort(),
      )
      expect(service).not.toHaveProperty('durationMinutes')
      expect(service).not.toHaveProperty('active')
      expect(service).not.toHaveProperty('is_active')
    }
  })

  it('faz o gateway retirar somente o wrapper data', async () => {
    const services = await fixtureSchedulingApi.listServices('default')

    expect(services).toBe(servicesResponseFixture.data)
    expect(services[0]).toHaveProperty('duration_minutes', 60)
    expect(services[0]).not.toHaveProperty('durationMinutes')
  })

  it('mantém os serviços em ordem alfabética com as durações aprovadas', () => {
    expect(servicesResponseFixture.data).toHaveLength(3)
    expect(servicesResponseFixture.data).toEqual([
      {
        id: '81ef3676-5987-441c-af89-6e9ad30b6014',
        name: 'Mentoria individual',
        description:
          'Encontro individual para esclarecer dúvidas técnicas e definir os próximos passos de estudo.',
        duration_minutes: 60,
      },
      {
        id: 'c690fd99-8482-4677-8199-1dcbe8e44aa2',
        name: 'Orientação de carreira',
        description:
          'Conversa focada em currículo, portfólio, posicionamento profissional e próximos passos.',
        duration_minutes: 60,
      },
      {
        id: '0f52181c-c086-42e0-89ea-a931e34b82ca',
        name: 'Revisão de projeto',
        description:
          'Análise de código, estrutura e boas práticas com feedback objetivo para evolução do projeto.',
        duration_minutes: 60,
      },
    ])
    expect(
      servicesResponseFixture.data.every(
        (service) => service.duration_minutes === 60,
      ),
    ).toBe(true)
  })

  it('aceita somente os códigos de erro aprovados', () => {
    const allowedCodes = [
      'validation_error',
      'authentication_failed',
      'permission_denied',
      'not_found',
      'slot_unavailable',
      'internal_error',
    ] satisfies ApiErrorCode[]

    expect(allowedCodes).toHaveLength(6)
    expect(serviceErrorFixture.error.code).toBe('internal_error')
    expect(availabilityErrorFixture.error.code).toBe('internal_error')
    expect(conflictErrorFixture.error.code).toBe('slot_unavailable')
  })

  it('gera a resposta de criação com o contrato snake_case completo', () => {
    const response = buildAppointmentResponseFixture(
      {
        service_id: '81ef3676-5987-441c-af89-6e9ad30b6014',
        date: '21-07-2026',
        time: '09:00',
        customer_name: 'Marina Souza',
        customer_phone: '11999999999',
      },
      {
        id: '81ef3676-5987-441c-af89-6e9ad30b6014',
        name: 'Mentoria individual',
        duration_minutes: 60,
      },
    )

    expect(Object.keys(response.data).sort()).toEqual(
      [
        'id',
        'confirmation_code',
        'customer_name',
        'customer_phone',
        'service',
        'scheduled_at',
        'status',
        'created_at',
        'updated_at',
      ].sort(),
    )
    expect(response.data).toMatchObject({
      confirmation_code: 'DEV-4827',
      customer_phone: '11999999999',
      service: {
        name: 'Mentoria individual',
        duration_minutes: 60,
      },
      scheduled_at: '2026-07-21T09:00:00-03:00',
      status: 'SCHEDULED',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })
})

describe('regras do gateway de disponibilidade', () => {
  it('gera somente horas cheias com término uma hora após o início', async () => {
    expect(availabilityStarts).toHaveLength(9)
    expect(availabilityStarts.every((start) => /^\d{2}:00$/.test(start))).toBe(
      true,
    )

    for (const service of servicesResponseFixture.data) {
      const availability = await fixtureSchedulingApi.getAvailability(
        service.id,
        '20-07-2026',
        'default',
      )

      expect(availability.slots.map((slot) => slot.start)).toEqual(
        availabilityStarts,
      )
      for (const slot of availability.slots) {
        const expectedEndHour = String(Number(slot.start.slice(0, 2)) + 1)
          .padStart(2, '0')
          .concat(':00')
        expect(slot.end).toBe(expectedEndHour)
      }
      expect(availability.slots.at(-1)).toMatchObject({
        start: '17:00',
        end: '18:00',
      })
    }
  })

  it('devolve slots vazios no sábado e domingo', async () => {
    const service_id = servicesResponseFixture.data[0].id
    const saturday = await fixtureSchedulingApi.getAvailability(
      service_id,
      '18-07-2026',
      'default',
    )
    const sunday = await fixtureSchedulingApi.getAvailability(
      service_id,
      '19-07-2026',
      'default',
    )
    expect(saturday.slots).toEqual([])
    expect(sunday.slots).toEqual([])
  })
})

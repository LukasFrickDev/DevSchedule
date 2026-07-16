import { describe, expect, it } from 'vitest'

import type { AvailabilityConflict } from './types'
import { matchesAvailabilityConflict } from './useSchedulingFlow'

describe('identidade do conflito de disponibilidade', () => {
  const conflict: AvailabilityConflict = {
    serviceId: '81ef3676-5987-441c-af89-6e9ad30b6014',
    date: '21-07-2026',
    start: '09:00',
  }

  it('bloqueia somente a mesma combinação de serviço, data e início', () => {
    expect(
      matchesAvailabilityConflict(
        conflict,
        '81ef3676-5987-441c-af89-6e9ad30b6014',
        '21-07-2026',
        '09:00',
      ),
    ).toBe(true)
    expect(
      matchesAvailabilityConflict(
        conflict,
        '0f52181c-c086-42e0-89ea-a931e34b82ca',
        '21-07-2026',
        '09:00',
      ),
    ).toBe(false)
    expect(
      matchesAvailabilityConflict(
        conflict,
        '81ef3676-5987-441c-af89-6e9ad30b6014',
        '22-07-2026',
        '09:00',
      ),
    ).toBe(false)
    expect(
      matchesAvailabilityConflict(
        conflict,
        '81ef3676-5987-441c-af89-6e9ad30b6014',
        '21-07-2026',
        '11:00',
      ),
    ).toBe(false)
  })
})

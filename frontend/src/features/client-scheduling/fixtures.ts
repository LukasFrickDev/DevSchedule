import type { AvailabilitySlot, Service } from './types'

export const serviceFixtures = [
  {
    id: '81ef3676-5987-441c-af89-6e9ad30b6014',
    name: 'Corte essencial',
    description: 'Consulta rápida, corte personalizado e finalização.',
    durationMinutes: 45,
    active: true,
  },
  {
    id: '0f52181c-c086-42e0-89ea-a931e34b82ca',
    name: 'Barba completa',
    description: 'Desenho, toalha quente e acabamento cuidadoso.',
    durationMinutes: 30,
    active: true,
  },
  {
    id: 'c690fd99-8482-4677-8199-1dcbe8e44aa2',
    name: 'Corte + barba',
    description: 'Experiência completa para renovar corte e barba.',
    durationMinutes: 75,
    active: true,
  },
  {
    id: 'a7f38c43-70d0-4996-90c5-063c6b2885a8',
    name: 'Serviço sazonal',
    description: 'Fixture inativa e indisponível para agendamento.',
    durationMinutes: 60,
    active: false,
  },
] satisfies Service[]

export const availabilitySlotFixtures = [
  { time: '09:00', available: true },
  { time: '10:00', available: false },
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
] satisfies AvailabilitySlot[]

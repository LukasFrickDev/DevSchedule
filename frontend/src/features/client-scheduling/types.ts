import type { ApiDate, ApiTime } from './api/types'

export type FlowStep =
  'service' | 'schedule' | 'details' | 'review' | 'success' | 'conflict'

export type FixtureScenario =
  | 'default'
  | 'services-loading'
  | 'services-error'
  | 'services-empty'
  | 'availability-loading'
  | 'availability-error'
  | 'availability-empty'
  | 'conflict'

export type AvailabilityConflict = {
  service_id: string
  date: ApiDate
  start: ApiTime
}

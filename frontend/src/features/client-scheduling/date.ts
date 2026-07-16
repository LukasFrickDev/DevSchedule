import type { ApiDate } from './types'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function todayAsInputDate() {
  const today = new Date()
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
}

export function inputDateToApiDate(value: string): ApiDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, year, month, day] = match
  return `${day}-${month}-${year}` as ApiDate
}

export function formatApiDate(value: ApiDate) {
  const [day, month, year] = value.split('-')
  return `${day}/${month}/${year}`
}

export function formatScheduledAt(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/.exec(value)
  if (!match) return value
  const [, year, month, day, time] = match
  return `${day}/${month}/${year} às ${time}`
}

export function isValidFutureOrToday(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= todayAsInputDate()
}

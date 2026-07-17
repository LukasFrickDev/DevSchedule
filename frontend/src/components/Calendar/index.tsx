import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { CalendarDays } from 'lucide-react'

import { formatInputDate, todayAsInputDate } from '../../utils/date'
import {
  CalendarGrid,
  CalendarHeader,
  CalendarPopover,
  CalendarRoot,
  DateInput,
  DateInputRow,
  DayButton,
  MonthButton,
  MonthTitle,
  ToggleButton,
  Weekday,
} from './styles'

type CalendarProps = {
  id: string
  value: string
  onChange: (value: string) => void
  minDate?: string
  disabled?: boolean
  labelledBy?: string
  ariaDescribedBy?: string
}

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function dateFromInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null

  const [, year, month, day] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? date
    : null
}

function dateToInput(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function typedDateToInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function typedDateToIso(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const [, day, month, year] = match
  return dateToInput(new Date(Number(year), Number(month) - 1, Number(day))) ===
    `${year}-${month}-${day}`
    ? `${year}-${month}-${day}`
    : null
}

function monthLabel(value: Date) {
  const label = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(value)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function addDays(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(value: Date, amount: number) {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1)
}

export function Calendar({
  id,
  value,
  onChange,
  minDate,
  disabled = false,
  labelledBy,
  ariaDescribedBy,
}: CalendarProps) {
  const selectedDate = dateFromInput(value)
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? dateFromInput(minDate ?? '') ?? new Date(),
  )
  const [typedValue, setTypedValue] = useState(() =>
    value ? formatInputDate(value) : '',
  )
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const today = todayAsInputDate()
  const errorId = `${id}-error`
  const calendarId = `${id}-calendar`

  useEffect(() => {
    setTypedValue(value ? formatInputDate(value) : '')
    const nextSelectedDate = dateFromInput(value)
    if (nextSelectedDate) {
      setVisibleMonth(
        new Date(
          nextSelectedDate.getFullYear(),
          nextSelectedDate.getMonth(),
          1,
        ),
      )
    }
  }, [value])

  useEffect(() => {
    function closeWhenNeeded(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeWhenNeeded)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeWhenNeeded)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const days = useMemo(() => {
    const firstDay = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    )
    const offset = firstDay.getDay()
    const daysInMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
    ).getDate()

    return Array.from({ length: offset + daysInMonth }, (_, index) => {
      if (index < offset) return null
      return new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth(),
        index - offset + 1,
      )
    })
  }, [visibleMonth])

  function validateTypedDate(nextValue: string, commit = false) {
    const nextDate = typedDateToIso(nextValue)
    if (!nextDate) {
      if (commit) setError('Informe uma data válida no formato DD/MM/AAAA.')
      return null
    }
    if (minDate && nextDate < minDate) {
      setError('Escolha uma data igual ou posterior à data mínima permitida.')
      return null
    }

    setError('')
    onChange(nextDate)
    return nextDate
  }

  function selectDate(nextDate: string) {
    setTypedValue(formatInputDate(nextDate))
    setError('')
    onChange(nextDate)
    setOpen(false)
  }

  function focusDate(nextDate: Date) {
    const nextValue = dateToInput(nextDate)
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
    window.requestAnimationFrame(() => {
      document.getElementById(`${id}-${nextValue}`)?.focus()
    })
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    day: Date,
  ) {
    let nextDate: Date | null = null

    if (event.key === 'ArrowLeft') nextDate = addDays(day, -1)
    if (event.key === 'ArrowRight') nextDate = addDays(day, 1)
    if (event.key === 'ArrowUp') nextDate = addDays(day, -7)
    if (event.key === 'ArrowDown') nextDate = addDays(day, 7)
    if (event.key === 'Home') nextDate = addDays(day, -day.getDay())
    if (event.key === 'End') nextDate = addDays(day, 6 - day.getDay())
    if (event.key === 'PageUp') nextDate = addMonths(day, -1)
    if (event.key === 'PageDown') nextDate = addMonths(day, 1)

    if (!nextDate) return
    event.preventDefault()
    const nextValue = dateToInput(nextDate)
    if (!minDate || nextValue >= minDate) focusDate(nextDate)
  }

  return (
    <CalendarRoot ref={rootRef}>
      <DateInputRow>
        <DateInput
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="DD/MM/AAAA"
          value={typedValue}
          disabled={disabled}
          aria-labelledby={labelledBy}
          aria-describedby={
            error
              ? `${ariaDescribedBy ?? ''} ${errorId}`.trim()
              : ariaDescribedBy
          }
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            const nextValue = typedDateToInput(event.target.value)
            setTypedValue(nextValue)
            setError('')
            if (nextValue.length === 10) validateTypedDate(nextValue)
            else if (value) onChange('')
          }}
          onBlur={() => {
            if (typedValue) validateTypedDate(typedValue, true)
          }}
        />
        <ToggleButton
          ref={toggleRef}
          type="button"
          aria-label="Abrir calendário"
          aria-expanded={open}
          aria-controls={calendarId}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
        >
          <CalendarDays size={18} aria-hidden="true" />
        </ToggleButton>
      </DateInputRow>
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
      {open && (
        <CalendarPopover id={calendarId} role="dialog" aria-label="Calendário">
          <CalendarHeader>
            <MonthButton
              type="button"
              aria-label="Mês anterior"
              onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
            >
              ←
            </MonthButton>
            <MonthTitle aria-live="polite">
              {monthLabel(visibleMonth)}
            </MonthTitle>
            <MonthButton
              type="button"
              aria-label="Próximo mês"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            >
              →
            </MonthButton>
          </CalendarHeader>
          <CalendarGrid
            aria-label={`Calendário de ${monthLabel(visibleMonth)}`}
          >
            {weekdays.map((weekday) => (
              <Weekday key={weekday}>{weekday}</Weekday>
            ))}
            {days.map((day, index) => {
              if (!day)
                return <span key={`empty-${index}`} aria-hidden="true" />

              const date = dateToInput(day)
              const unavailable = Boolean(minDate && date < minDate)
              return (
                <DayButton
                  key={date}
                  id={`${id}-${date}`}
                  type="button"
                  aria-label={formatInputDate(date)}
                  aria-pressed={value === date}
                  aria-current={date === today ? 'date' : undefined}
                  disabled={unavailable}
                  $selected={value === date}
                  $today={date === today}
                  onClick={() => selectDate(date)}
                  onKeyDown={(event) => handleDayKeyDown(event, day)}
                >
                  {day.getDate()}
                </DayButton>
              )
            })}
          </CalendarGrid>
        </CalendarPopover>
      )}
    </CalendarRoot>
  )
}

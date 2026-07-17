import styled from 'styled-components'

export const CalendarRoot = styled.div`
  position: relative;
  width: min(100%, 24rem);

  > p {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    color: #ff9ca5;
    font-size: 0.8rem;
    font-weight: 700;
  }
`

export const DateInputRow = styled.div`
  display: flex;
  min-height: 3.25rem;
  font-size: 0.78rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.secondary};
    outline: 3px solid rgb(133 50 242 / 55%);
    outline-offset: 2px;
  }


`

export const DateInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
`

export const ToggleButton = styled.button`
  width: 3.25rem;
  flex: 0 0 3.25rem;
  display: grid;
  place-items: center;
  border: 0;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0 ${({ theme }) => theme.radii.md}
    ${({ theme }) => theme.radii.md} 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgb(57 211 83 / 10%);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const CalendarPopover = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + ${({ theme }) => theme.spacing.sm});
  left: 0;
  width: min(24rem, calc(100vw - 2rem));
  max-height: min(32rem, calc(100vh - 2rem));
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

export const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) 2.5rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const MonthTitle = styled.strong`
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const MonthButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

`

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Weekday = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.68rem;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
`

export const DayButton = styled.button<{ $selected: boolean; $today: boolean }>`
  min-height: 2.75rem;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid
    ${({ $selected, $today, theme }) =>
      $selected || $today ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : 'transparent'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.onPrimary : theme.colors.text};
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.secondary};
    background: ${({ $selected }) =>
      $selected ? 'rgb(57 211 83 / 84%)' : 'rgb(133 50 242 / 14%)'};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.38;
    text-decoration: line-through;
  }
`


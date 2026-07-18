import styled, { css } from 'styled-components'

const focusRing = css`
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`

export const TableFrame = styled.div`
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`

export const AppointmentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  caption {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  th,
  td {
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: top;
  }

  th {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  td {
    font-size: 0.88rem;
  }

  td > strong,
  td > small {
    display: block;
  }

  td > small {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 78rem) and (min-width: 64rem) {
    th,
    td {
      padding: ${({ theme }) => theme.spacing.sm};
    }

    td {
      font-size: 0.82rem;
    }
  }

  @media (max-width: 63.999rem) {
    display: block;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    tbody {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: ${({ theme }) => theme.spacing.md};
      padding: ${({ theme }) => theme.spacing.md};
    }

    tr {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
      gap: ${({ theme }) => theme.spacing.md};
      min-width: 0;
      padding: ${({ theme }) => theme.spacing.md};
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.radii.md};
      background: ${({ theme }) => theme.colors.surfaceRaised};
    }

    td,
    tbody tr:last-child td {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: ${({ theme }) => theme.spacing.xs};
      min-width: 0;
      padding: 0;
      border: 0;
    }

    td::before {
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      content: attr(data-label);
    }

    td:last-child {
      grid-column: 1 / -1;
      padding-top: ${({ theme }) => theme.spacing.md};
      border-top: 1px solid ${({ theme }) => theme.colors.border};
    }
  }

  @media (max-width: 46rem) {
    tbody {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 30rem) {
    tbody {
      gap: ${({ theme }) => theme.spacing.sm};
      padding: ${({ theme }) => theme.spacing.sm};
    }

    tr {
      grid-template-columns: 1fr;
      padding: ${({ theme }) => theme.spacing.md};
    }
  }
`

export const ServiceDetails = styled.span`
  display: grid;

  small {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: max-content;
  padding: 0.2rem 0.55rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  font-weight: 800;

  &::before {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.textMuted};
    content: '';
  }

  &[data-status='CONFIRMED']::before {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &[data-status='COMPLETED']::before {
    background: ${({ theme }) => theme.colors.primary};
  }
`

export const ActionsCell = styled.td``

export const StatusEditor = styled.div`
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) auto 2.75rem;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  min-width: 18rem;

  select {
    width: 100%;
    min-width: 0;
    min-height: 2.75rem;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.surfaceRaised};
    color: ${({ theme }) => theme.colors.text};
    ${focusRing}
  }

  @media (max-width: 78rem) and (min-width: 64rem) {
    grid-template-columns: minmax(5.5rem, 1fr) auto 2.75rem;
    gap: ${({ theme }) => theme.spacing.xs};
    min-width: 15.5rem;

    select {
      padding: 0 ${({ theme }) => theme.spacing.xs};
      font-size: 0.75rem;
    }
  }

  @media (max-width: 63.999rem) {
    grid-template-columns: minmax(0, 1fr) auto 2.75rem;
    min-width: 0;
  }

  @media (max-width: 30rem) {
    gap: ${({ theme }) => theme.spacing.xs};

    select {
      padding: 0 ${({ theme }) => theme.spacing.xs};
      font-size: 0.75rem;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    select {
      -webkit-appearance: none;
      appearance: none;
      padding: 0 ${({ theme }) => theme.spacing.xl} 0
        ${({ theme }) => theme.spacing.xs};
      background-image:
        linear-gradient(45deg, transparent 50%, currentColor 50%),
        linear-gradient(135deg, currentColor 50%, transparent 50%);
      background-position:
        calc(100% - 0.9rem) calc(50% - 0.15rem),
        calc(100% - 0.65rem) calc(50% - 0.15rem);
      background-repeat: no-repeat;
      background-size: 0.32rem 0.32rem;
    }
  }
`

export const HiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`

export const ActionButton = styled.button`
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 0.78rem;
  font-weight: 900;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  ${focusRing}

  @media (max-width: 30rem) {
    padding: 0 ${({ theme }) => theme.spacing.xs};
    font-size: 0.72rem;
  }
`

export const DeleteButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  ${focusRing}

  svg {
    display: block;
  }
`

export const EmptyText = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  @media (max-width: 30rem) {
    padding: ${({ theme }) => theme.spacing.lg}
      ${({ theme }) => theme.spacing.md};
  }
`

import styled, { keyframes } from 'styled-components'

export const DashboardHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  span {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  strong {
    display: inline-flex;
    margin-top: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs}
      ${({ theme }) => theme.spacing.sm};
    border: 1px solid rgb(57 211 83 / 45%);
    border-radius: ${({ theme }) => theme.radii.pill};
    background: rgb(57 211 83 / 10%);
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.85rem;
  }

  @media (max-width: 48rem) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    h1 {
      font-size: clamp(1.85rem, 8vw, 2.75rem);
      line-height: 1.05;
    }
  }
`

export const Indicators = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;

  li {
    min-width: 0;
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface};
  }

  span,
  strong {
    display: block;
  }

  span {
    overflow: hidden;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.72rem;
    font-weight: 700;
    text-overflow: ellipsis;
  }

  strong {
    margin-top: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
    font-size: clamp(1.35rem, 3vw, 2rem);
    line-height: 1;
  }

  @media (max-width: 30rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    li {
      padding: ${({ theme }) => theme.spacing.sm}
        ${({ theme }) => theme.spacing.md};
    }
  }
`

export const Section = styled.section`
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  box-shadow: ${({ theme }) => theme.shadows.panel};

  @media (max-width: 30rem) {
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.md};
  }
`

export const ListHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 1.35rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;
  }

  @media (max-width: 68rem) {
    align-items: stretch;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`

export const FilterBar = styled.div`
  width: min(100%, 52rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(10rem, 1fr)) max-content;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;

  button:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }

  @media (max-width: 48rem) {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    > button {
      grid-column: 1 / -1;
      justify-self: end;
    }
  }

  @media (max-width: 30rem) {
    grid-template-columns: 1fr;

    button {
      width: 100%;
    }
  }
`

export const FilterField = styled.div`
  min-width: 0;

  label {
    display: block;
    margin: ${({ theme }) => theme.spacing.xs};
    font-size: 0.78rem;
    font-weight: 800;
  }

  select {
    width: 100%;
    min-height: 3.25rem;
    font-size: 0.78rem;
    padding: 0 ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surfaceRaised};
    color: ${({ theme }) => theme.colors.text};
  }
`

export const ClearButton = styled.button`
  min-height: 3.25rem;
  align-self: end;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

export const PaginationControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};

  label {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.8rem;
    font-weight: 800;
  }

  @media (max-width: 30rem) {
    justify-content: stretch;

    label {
      width: 100%;
    }
  }
`

export const PageSizeSelect = styled.select`
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 800;
`

export const LoadMoreButton = styled.button`
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }
`

export const Feedback = styled.p<{ $danger: boolean }>`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-weight: 700;
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const LoadingState = styled.div`
  display: grid;
  min-height: 12rem;
  place-items: center;
  align-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};

  p {
    margin: 0;
  }
`

export const LoadingIndicator = styled.span`
  width: 2rem;
  height: 2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 750ms linear infinite;
`

export const ErrorState = styled.div`
  min-height: 12rem;
  display: grid;
  place-items: center;
  align-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-align: center;

  p {
    margin: ${({ theme }) => theme.spacing.xs} 0
      ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 30rem) {
    min-height: 10rem;
    padding: ${({ theme }) => theme.spacing.lg}
      ${({ theme }) => theme.spacing.md};
  }
`

export const RetryButton = styled.button`
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 900;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }
`

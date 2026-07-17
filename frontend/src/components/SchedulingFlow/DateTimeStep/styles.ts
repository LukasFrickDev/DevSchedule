import styled from 'styled-components'

export const SummaryStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};

  strong,
  span {
    display: block;
  }

  @media (max-width: 30rem) {
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.85rem;
  }
`

export const Hint = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.82rem;
`

export const SlotFieldset = styled.fieldset`
  margin: ${({ theme }) => theme.spacing.xl} 0 0;
  padding: 0;
  border: 0;
`

export const Legend = styled.legend`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 800;
`

export const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.25rem, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`

export const SlotButton = styled.button<{ $selected: boolean }>`
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $selected, theme }) =>
    $selected ? 'rgb(57 211 83 / 12%)' : theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  cursor: pointer;

  span {
    display: block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.65rem;
    font-weight: 700;
  }

  &:disabled {
    border-style: dashed;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.65;
    text-decoration: line-through;

    span {
      color: ${({ theme }) => theme.colors.textMuted};
      text-decoration: none;
    }
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 2px;
  }
`

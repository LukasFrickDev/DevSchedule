import styled from 'styled-components'

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 38rem) {
    grid-template-columns: 1fr;
  }
`

export const ServiceButton = styled.button<{ $selected: boolean }>`
  min-height: 11rem;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $selected, theme }) =>
    $selected ? 'rgb(57 211 83 / 8%)' : theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (max-width: 38rem) {
    min-height: 0;
  }
`

export const ServiceTop = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`

export const ServiceName = styled.strong`
  display: block;
  font-size: 1.12rem;
`

export const ServiceDescription = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.body};
`

export const SelectionText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8rem;
  font-weight: 800;
`

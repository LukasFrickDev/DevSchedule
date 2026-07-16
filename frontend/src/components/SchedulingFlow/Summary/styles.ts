import styled from 'styled-components'

export const ReviewList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;

  @media (max-width: 38rem) {
    grid-template-columns: 1fr;
  }
`

export const ReviewItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
    font-weight: 800;
  }
`

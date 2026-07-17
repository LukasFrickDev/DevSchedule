import styled from 'styled-components'

export const Panel = styled.section`
  overflow: visible;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: clamp(1rem, 3vw, 1.5rem);
  background:
    radial-gradient(circle at 90% 0%, rgb(133 50 242 / 15%), transparent 30%),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

export const PanelContent = styled.div`
  padding: clamp(1.25rem, 5vw, 3.25rem);
`

export const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

export const Title = styled.h1`
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2rem, 6vw, 3.75rem);
  line-height: 1.02;
  letter-spacing: -0.045em;
`

export const Lead = styled.p`
  max-width: 62ch;
  margin: ${({ theme }) => theme.spacing.md} 0
    ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(1rem, 2vw, 1.1rem);
`

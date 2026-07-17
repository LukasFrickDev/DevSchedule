import styled from 'styled-components'

export const Main = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

export const Card = styled.section`
  width: min(100%, 48rem);
  padding: clamp(2rem, 6vw, 4.5rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(
      circle at top right,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.secondary} 18%,
        transparent
      ),
      transparent 36%
    ),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

export const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

export const Title = styled.h1`
  max-width: 13ch;
  margin: 0;
  font-size: clamp(2.25rem, 8vw, 4.75rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
`

export const Description = styled.p`
  max-width: 58ch;
  margin: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(1rem, 2vw, 1.125rem);
`

export const Action = styled.a`
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.primary} 24%,
        transparent
      );
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 4px;
  }
`

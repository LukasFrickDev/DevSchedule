import { Link } from 'react-router-dom'
import styled from 'styled-components'

type PageShellProps = {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

const Main = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const Card = styled.section`
  width: min(100%, 48rem);
  padding: clamp(2rem, 6vw, 4.5rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  background:
    radial-gradient(
      circle at top right,
      rgb(133 50 242 / 18%),
      transparent 36%
    ),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

const Eyebrow = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Title = styled.h1`
  max-width: 13ch;
  margin: 0;
  font-size: clamp(2.25rem, 8vw, 4.75rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
`

const Description = styled.p`
  max-width: 58ch;
  margin: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(1rem, 2vw, 1.125rem);
`

const Action = styled(Link)`
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
    box-shadow: 0 12px 32px rgb(57 211 83 / 24%);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 4px;
  }
`

export function PageShell({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
}: PageShellProps) {
  return (
    <Main>
      <Card>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Action to={actionTo}>{actionLabel}</Action>
      </Card>
    </Main>
  )
}

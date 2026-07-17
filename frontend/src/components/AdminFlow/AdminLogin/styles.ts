import styled from 'styled-components'

export const LoginCard = styled.section`
  width: min(100%, 32rem);
  margin: clamp(2rem, 8vh, 6rem) auto 0;
  padding: clamp(1.5rem, 5vw, 2.5rem);
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
      transparent 42%
    ),
    ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.panel};

  @media (max-width: 30rem) {
    margin-top: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`

export const LoginHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    font-size: clamp(1.75rem, 6vw, 2.5rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
  }

  span {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  @media (max-width: 30rem) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  label {
    font-weight: 800;
  }
`

export const Input = styled.input`
  width: 100%;
  min-height: 3.25rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }

  &:focus-visible {
    outline: 3px solid
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.secondary} 55%,
        transparent
      );
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`

export const PasswordInputWrapper = styled.div`
  position: relative;
`

export const PasswordInput = styled(Input)`
  padding-right: 3.5rem;
`

export const PasswordToggle = styled.button`
  position: absolute;
  top: 50%;
  right: ${({ theme }) => theme.spacing.sm};
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transform: translateY(-50%);

  &:hover {
    background: rgb(133 50 242 / 14%);
    color: ${({ theme }) => theme.colors.text};
  }
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  font-weight: 700;
`

export const SubmitButton = styled.button`
  min-height: 3.25rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 900;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }
`

export const DemoCredentials = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }

  code {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 800;
  }
`

import styled, { css, keyframes } from 'styled-components'

export const Main = styled.main`
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2.5rem);
  overflow-x: clip;
`

export const Shell = styled.div`
  width: min(100%, 68rem);
  margin: 0 auto;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: clamp(1.75rem, 5vw, 3.5rem);

  @media (max-width: 30rem) {
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`

export const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: -0.02em;
`

export const BrandLogo = styled.img`
  width: clamp(1.5rem, 3vw, 2rem);
  height: clamp(1.5rem, 3vw, 2rem);
  flex: 0 0 auto;
  object-fit: contain;
`

export const SecureNote = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;

  @media (max-width: 30rem) {
    display: none;
  }
`

export const Progress = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  list-style: none;
`

export const ProgressItem = styled.li<{
  $active: boolean
  $complete: boolean
}>`
  min-width: 0;
  color: ${({ $active, $complete, theme }) =>
    $active || $complete ? theme.colors.text : theme.colors.textMuted};
  font-size: clamp(0.7rem, 1.8vw, 0.82rem);
  font-weight: ${({ $active }) => ($active ? 800 : 600)};

  &::before {
    display: block;
    height: 0.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ $active, $complete, theme }) =>
      $active
        ? theme.colors.primary
        : $complete
          ? theme.colors.secondary
          : theme.colors.border};
    content: '';
  }
`

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
`

export const LiveTitle = styled.span`
  ${visuallyHidden}
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

export const Button = styled.button<{
  $secondary?: boolean
  $danger?: boolean
}>`
  min-height: 3.25rem;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    ${({ $secondary, $danger, theme }) =>
      $danger
        ? theme.colors.danger
        : $secondary
          ? theme.colors.border
          : theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $secondary, $danger, theme }) =>
    $danger
      ? 'rgb(255 93 108 / 10%)'
      : $secondary
        ? 'transparent'
        : theme.colors.primary};
  color: ${({ $secondary, $danger, theme }) =>
    $secondary || $danger ? theme.colors.text : theme.colors.onPrimary};
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (max-width: 30rem) {
    width: 100%;
  }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const StateBox = styled.div<{ $danger?: boolean }>`
  display: grid;
  min-height: 12rem;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed
    ${({ $danger, theme }) =>
      $danger ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
`

export const Loader = styled.span`
  width: 2rem;
  height: 2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 750ms linear infinite;
`

export const Duration = styled.span`
  flex: 0 0 auto;
  padding: 0.2rem 0.55rem;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgb(133 50 242 / 16%);
  color: #c89cff;
  font-size: 0.75rem;
  font-weight: 800;
`

export const FormGroup = styled.div`
  max-width: 32rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 800;
`

export const Input = styled.input<{ $invalid?: boolean }>`
  width: 100%;
  min-height: 3.25rem;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};

  &:focus-visible {
    outline: 3px solid rgb(133 50 242 / 55%);
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`

export const ErrorText = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: #ff9ca5;
  font-size: 0.85rem;
  font-weight: 700;
`

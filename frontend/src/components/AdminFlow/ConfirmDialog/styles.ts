import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  z-index: 20;
  inset: 0;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.background} 82%,
    transparent
  );

  @media (max-width: 30rem) {
    align-items: end;
    padding: 0;
  }
`

export const DialogCard = styled.section`
  width: min(100%, 32rem);
  padding: clamp(1.5rem, 5vw, 2rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  box-shadow: ${({ theme }) => theme.shadows.panel};

  @media (max-width: 30rem) {
    max-height: calc(100vh - ${({ theme }) => theme.spacing.md});
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.lg};
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: ${({ theme }) => theme.radii.lg}
      ${({ theme }) => theme.radii.lg} 0 0;
  }
`

export const DialogTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1.5rem;
  line-height: 1.2;
`

export const DialogDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`

export const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};

  button {
    min-height: 3rem;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 800;
    cursor: pointer;
  }

  button:last-child {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }

  button[data-danger='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.text};
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  button:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (max-width: 30rem) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`

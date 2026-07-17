import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Main = styled.main`
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2.5rem);
  overflow-x: clip;

  @media (max-width: 68rem) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 30rem) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const Shell = styled.div`
  width: min(100%, 80rem);
  margin: 0 auto;
`

export const Header = styled.header`
  display: flex;
  min-height: 3rem;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);

  @media (max-width: 40rem) {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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

export const AdminBadge = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.radii.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: 40rem) {
    grid-row: 3;
    grid-column: 1;
    justify-self: start;
  }
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: auto;

  @media (max-width: 40rem) {
    grid-row: 2;
    grid-column: 1;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-left: 0;
  }
`

export const LogoutButton = styled.button`
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;

  @media (max-width: 30rem) {
    flex: 1 1 auto;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }
`

export const ClientLink = styled(Link)`
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;

  @media (max-width: 30rem) {
    flex: 1 1 auto;
    justify-content: center;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (max-width: 40rem) {
    white-space: nowrap;
  }
`

import styled from 'styled-components'

export const ResultMark = styled.div`
  display: grid;
  width: 4rem;
  height: 4rem;
  place-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  background: rgb(57 211 83 / 10%);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.6rem;
  font-weight: 900;
`

export const ConfirmationCode = styled.p`
  width: fit-content;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgb(133 50 242 / 16%);
  color: #d2b2ff;
  font-weight: 900;
  letter-spacing: 0.08em;
`

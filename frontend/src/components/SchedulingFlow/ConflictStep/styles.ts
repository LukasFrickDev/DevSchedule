import styled from 'styled-components'

export const ResultMark = styled.div`
  display: grid;
  width: 4rem;
  height: 4rem;
  place-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: 50%;
  background: rgb(255 93 108 / 10%);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 1.6rem;
  font-weight: 900;
`

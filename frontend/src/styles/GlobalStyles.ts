import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    color-scheme: dark;
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
  }

  body {
    min-width: 20rem;
    min-height: 100vh;
    margin: 0;
    background:
      radial-gradient(circle at 15% 10%, rgb(57 211 83 / 8%), transparent 28%),
      ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    text-rendering: optimizeLegibility;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    font-family: ${({ theme }) => theme.fonts.display};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`

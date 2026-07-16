import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    color-scheme: dark;
    font-family: Inter, Albert Sans, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", sans-serif;
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

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`

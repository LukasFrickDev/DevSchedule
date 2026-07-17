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
    scrollbar-color: ${({ theme }) => theme.colors.secondary}
      ${({ theme }) => theme.colors.surface};
    scrollbar-width: thin;
    overflow-x: clip;
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
    overflow-x: clip;
  }

  #root {
    min-width: 0;
  }

  img {
    max-width: 100%;
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

  * {
    scrollbar-color: ${({ theme }) => theme.colors.secondary}
      ${({ theme }) => theme.colors.surface};
    scrollbar-width: thin;
  }

  *::-webkit-scrollbar {
    width: 0.7rem;
    height: 0.7rem;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  *::-webkit-scrollbar-thumb {
    border: 2px solid ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.secondary};
  }

  *::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.secondary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
      scroll-behavior: auto;
      transition-duration: 0.01ms;
    }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`

// 앱 전체에 사용되는 기본 스타일 정의

import { css, Global } from "@emotion/react";

import theme from "./theme";

const globalStyles = () => css`
  html,
  body {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ol,
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a,
  button {
    cursor: pointer;
  }

  input,
  button {
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
  }

  svg {
    flex-shrink: 0;
  }

  :is(button, a[href], input, textarea, select, [tabindex]):focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    box-shadow: 0 0 0 4px ${theme.colors.white};
  }

  @media (forced-colors: active) {
    :is(button, a[href], input, textarea, select, [tabindex]):focus-visible {
      outline-color: Highlight;
    }
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;

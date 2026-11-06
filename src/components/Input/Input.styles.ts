import styled from "@emotion/styled";

import theme from "@/styles/theme";

interface InputStyleProps {
  $hideSpin?: boolean;
}

export const Input = styled.input<InputStyleProps>`
  width: 100%;
  height: 3.25rem; /* 52px */
  padding: 0.625rem 0.9375rem; /* 10px 15px */
  background-color: ${theme.colors.white};
  display: flex;
  align-items: center;
  outline: none;
  border-radius: var(--spacing-radius-xs, 2px);

  ${theme.fonts.pretendard}
  color: ${theme.colors.black};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;

  &::placeholder {
    color: ${theme.colors.territory};
  }
  &&:focus {
    outline: 1px solid var(--input-focus-color, ${theme.colors.primary});
    outline-offset: -1px;
    box-shadow: none;
    background: var(--bg-white, ${theme.colors["grey-00"]});
  }

  @media (forced-colors: active) {
    &&:focus {
      outline-color: Highlight;
    }
  }

  /* Spin 감추려고 코드 추가 */
  ${({ $hideSpin }) =>
    $hideSpin &&
    `
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  `}
`;

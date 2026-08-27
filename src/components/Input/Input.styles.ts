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

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;

  &::placeholder {
    color: ${theme.colors.territory};
  }
  &:focus {
    border-radius: var(--spacing-radius-xs, 2px);
    border: 0.5px solid var(--stroke-brand, ${theme.colors.primary});
    background: var(--bg-white, #fafafa);
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

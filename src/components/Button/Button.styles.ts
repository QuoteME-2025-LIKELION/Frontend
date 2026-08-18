import styled from "@emotion/styled";

import theme from "@/styles/theme";

interface ButtonStyleProps {
  $font?: "batang" | "pretendard";
  $bgColor?: string;
  $fontColor?: string;
  $border?: string;
  $disableActive?: boolean;
}

export const Button = styled.button<ButtonStyleProps>`
  ${({ $font = "batang", $bgColor }) =>
    $font === "pretendard"
      ? `
      display: flex;
      height: 44px;
      padding: 0 var(--12, 12px);
      justify-content: center;
      align-items: center;
      gap: var(--spacing-gap-lg, 12px);
      align-self: stretch;
      border-radius: var(--spacing-radius-sm, 4px);
      border: 1px solid var(--stroke-subtle, #C3C5C9);
      background-color: ${$bgColor || "#F2F2F2"};

    `
      : `
      width: 100%;
      height: 2.875rem; /* 62px */
      border-top: 0.5px solid ${theme.colors.territory};
      border-bottom: 0.5px solid ${theme.colors.territory};
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.4375rem 0.625rem; /* 7px 10px */
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

    `}

  ${({ $font = "batang" }) =>
    $font === "pretendard"
      ? `
      color: var(--black, #191818);
      font-family: Pretendard, sans-serif;
      font-size: var(--font-size-t2, 14px);
      font-style: normal;
      font-weight: var(--font-weight-medium, 500);
      line-height: var(--line-height-t2, 21px);
      letter-spacing: -0.28px;
    `
      : `
      ${theme.fonts.batang}
      color: #000;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.32px;
    `}
    color: ${({ $fontColor }) => $fontColor || "#000"};

  border: ${({ $border }) =>
    $border || `1px solid var(--stroke-subtle, ${theme.colors.primary})`};

  border-left: none;
  border-right: none;
  /* 임의로 추가 */

  ${({ $disableActive }) =>
    !$disableActive &&
    `
    &:active {
      background-color: ${theme.colors.secondary};
    }
  `}

  &:disabled {
    border-top: 0.5px solid #c3c5c9;
    border-bottom: 0.5px solid #c3c5c9;
    color: #c3c5c9;
    background-color: #f2f2f2;
    cursor: not-allowed;
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
`;

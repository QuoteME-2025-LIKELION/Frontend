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
  ${({ $font = "batang", $bgColor, $border }) =>
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
      border: ${$border || "1px solid var(--stroke-subtle, #C3C5C9)"};
      background-color: ${$bgColor || "#F2F2F2"};

    `
      : `
      width: 100%;
      height: 2.75rem;
      border-top: ${$border || "1px solid rgba(20, 56, 88, 0.55)"};
      border-bottom: ${$border || "1px solid rgba(20, 56, 88, 0.55)"};
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.4375rem 0.625rem;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

    `}

  ${({ $font = "batang", $fontColor }) =>
    $font === "pretendard"
      ? `
      color: ${$fontColor || "var(--black, #191818)"};
      font-family: Pretendard, sans-serif;
      font-size: var(--font-size-t2, 14px);
      font-style: normal;
      font-weight: var(--font-weight-medium, 500);
      line-height: var(--line-height-t2, 21px);
      letter-spacing: -0.28px;
    `
      : `
      ${theme.fonts.pretendard}
      color: ${$fontColor || theme.colors["fg-primary"]};
      font-size: 0.875rem;
      font-weight: 500;
    `}

  ${({ $font = "batang" }) =>
    $font === "batang" &&
    `
    border-left: none;
    border-right: none;
  `}
  /* 임의로 추가 */

  ${({ $disableActive }) =>
    !$disableActive &&
    `
    &:active {
      background-color: #d4d6da;
    }
  `}

  &:disabled {
    border-top: 1px solid rgba(149, 153, 161, 0.24);
    border-bottom: 1px solid rgba(149, 153, 161, 0.24);
    color: #c3c5c9;
    background-color: transparent;
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

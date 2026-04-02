import theme from "@/styles/theme";
import styled from "@emotion/styled";

interface ButtonProps {
  font?: "batang" | "pretendard";
  bgColor?: string;
  fontcolor?: string;
  border?: string;
  disableActive?: boolean;
}

export const Button = styled.button<ButtonProps>`
  ${({ font = "batang", bgColor }) =>
    font === "pretendard"
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
      background-color: ${bgColor || "#F2F2F2"};

    `
      : `
      width: 100%;
      height: 1.875rem; /* 30px */
      border-top: 0.5px solid ${theme.colors.territory};
      border-bottom: 0.5px solid ${theme.colors.territory};
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.4375rem 0.625rem; /* 7px 10px */
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      background-color: ${bgColor || "#Ffffff"};

    `}

  ${({ font = "batang" }) =>
    font === "pretendard"
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
    color: ${({ fontcolor }) => fontcolor || "#000"};

  border: ${({ border }) =>
    border || "1px solid var(--stroke-subtle, #C3C5C9)"};
  /* 임의로 추가 */

  ${({ disableActive }) =>
    !disableActive &&
    `
    &:active {
      background-color: ${theme.colors.secondary};
    }
  `}
`;

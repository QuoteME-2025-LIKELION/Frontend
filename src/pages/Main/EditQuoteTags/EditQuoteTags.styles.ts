import theme from "@/styles/theme";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
`;

export const Toggle = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  right: 0;

  width: 270px; /* 피그마 보고 조절 */
  height: 100vh;

  z-index: 999;

  display: flex;
  align-items: center;
  flex-direction: column;

  background: var(--bg-basement-neutral, #e9eaec);
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);

  animation: ${({ $active }) => ($active ? fadeIn : fadeOut)} 0.3s ease-out
    forwards;
`;

export const ToggleBtn = styled.div`
  cursor: pointer;
  color: ${theme.colors["fg-primary"]};
  font-size: 18px; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
  ${theme.fonts.batang}
  &:hover, &:active {
    color: black;
  }

  padding: var(--spacing-padding-md, 20px) 0;
  text-align: center;
  width: 240px;
  border-bottom: 0.5px solid var(--stroke-subtle, #c3c5c9);
`;

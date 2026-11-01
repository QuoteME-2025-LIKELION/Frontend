import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

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

export const Toggle = styled.dialog<{ $active: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  margin: 0 max(0px, calc((100vw - 393px) / 2)) 0 0;
  padding: 0;
  border: 0;
  color: inherit;
  max-height: none;
  overflow: clip;
  &:not([open]) {
    display: none;
  }
  &::backdrop {
    background: transparent;
  }

  width: 270px; /* 피그마 보고 조절 */
  height: 100vh;

  z-index: 999;

  display: flex;
  align-items: center;
  flex-direction: column;

  background: var(--bg-basement-neutral, ${theme.colors.secondary});
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);

  animation: ${({ $active }) => ($active ? fadeIn : fadeOut)} 0.3s ease-out both;
`;

export const ToggleBtn = styled.button`
  cursor: pointer;
  color: ${theme.colors["grey-950"]};
  font-size: 18px; /* 14px */
  font-weight: 700;
  letter-spacing: -0.28px;
  ${theme.fonts.batang}
  &:hover, &:active {
    color: ${theme.colors.black};
  }

  padding: var(--spacing-padding-md, 20px) 0;
  text-align: center;
  width: 240px;
  border-bottom: 0.5px solid var(--stroke-subtle, ${theme.colors["grey-200"]});
`;

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${() => theme.colors.primary};
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  position: relative;
`;

export const TextBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;
export const TitleText = styled.div`
  ${theme.fonts.batang};
  font-size: 3rem;
  color: #fff;
  text-align: center;
  font-weight: 400;
  line-height: 100%;
  padding-bottom: 0.75rem;
`;
export const Text = styled.div`
  ${theme.fonts.pretendard};
  color: #fff;
  text-align: center;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
`;

export const BtnBox = styled.div`
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.875rem;
  margin-top: auto;
  margin-bottom: 3.25rem;
`;

export const Button = styled.button`
  width: 100%;
  height: 2.6875rem; /* 43px */
  background-color: #fff;
  border-top: 0.5px solid ${theme.colors.territory};
  border-bottom: 0.5px solid ${theme.colors.territory};
  display: flex;
  justify-self: self-end;
  align-items: center;
  padding: 0.4375rem 0.625rem; /* 7px 10px */
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  ${theme.fonts.batang}
  color: #000;
  font-size: 1rem; /* 16px */
  font-weight: 700;
  letter-spacing: -0.32px;
  text-align: center;

  /* 임의로 추가 */
  &:active {
    background-color: ${theme.colors.secondary};
  }
`;

export const ButtonText = styled.div`
  ${theme.fonts.batang};
  color: #000;
  text-align: center;
  font-weight: 700;
`;

export const LogButton = styled.div`
  width: 100%;
  min-height: 2.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.375rem;

  > button {
    width: auto;
    height: auto;
    padding: 0;
    align-self: auto;
    flex-shrink: 0;
  }
`;
export const Overlay = styled.div<{ $isClosing: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(12, 31, 49, 0.28);
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 180ms ease
    forwards;
`;
export const Loginbox = styled.div<{ $isClosing: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(0);

  width: 100%;
  box-sizing: border-box;

  min-height: 13.625rem;
  padding: 2.25rem 1.5rem 4.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  z-index: 11;
  border-radius: 0.625rem 0.625rem 0 0;
  background: var(--bg-basement-neutral, #e9eaec);
  animation: ${({ $isClosing }) => ($isClosing ? slideDown : slideUp)} 180ms
    ease-out forwards;
`;

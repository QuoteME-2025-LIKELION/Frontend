import theme from "@/styles/theme";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
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
    transform: translateY(20px);
  }
`;

export const Overlay = styled.div<{ $showOverlay: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background-color: ${({ $showOverlay }) =>
    $showOverlay ? "rgba(0, 0, 0, 0.55)" : "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div<{ $isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.secondary};
  border-radius: 1.875rem; /* 30px */
  border: 1px solid ${theme.colors.territory};
  width: 67%;
  max-width: 16.625rem; /* 266px */
  height: 8.875rem; /* 142px */
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s
    ease-out forwards;
`;

export const Question = styled.div`
  padding: 2.5rem 0 3.125rem; /* 40px 0 50px */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.fonts.batang}
  color: #000;
  font-size: 0.9375rem;
  letter-spacing: -0.3px;
  font-weight: 500;
  white-space: nowrap;

  div {
    ${theme.fonts.pretendard}
    color: #000;
    font-size: 0.9375rem;
    letter-spacing: -0.3px;
    font-weight: 600;
  }

  @media screen and (max-width: 360px) {
    font-size: 0.8125rem;
    div {
      font-size: 0.8125rem;
    }
  }
`;

export const BtnBox = styled.div`
  height: 2.3125rem; /* 37px */
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  button:first-of-type {
    border-bottom-left-radius: 1.875rem; /* 30px */
  }

  button:last-of-type {
    border-bottom-right-radius: 1.875rem; /* 30px */
  }
`;

export const Btn = styled.button`
  width: 100%;
  padding: 0.625rem; /* 10px */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  ${theme.fonts.batang}
  color: ${theme.colors.territory};
  font-size: 0.9375rem;
  letter-spacing: -0.3px;
  font-weight: 500;

  &:active {
    color: #000;
  }
`;

export const Div = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  width: 1px;
  height: 100%;
  align-self: flex-start;
`;

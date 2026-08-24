import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

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

export const Container = styled.div<{
  $isClosing: boolean;
  $variant: "default" | "card";
}>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $variant }) =>
    $variant === "card" ? "stretch" : "center"};
  align-items: center;
  background-color: ${theme.colors.secondary};
  border-radius: ${({ $variant }) =>
    $variant === "card" ? "0.25rem" : "1.875rem"};
  border: ${({ $variant }) =>
    $variant === "card" ? "none" : `1px solid ${theme.colors.territory}`};
  width: ${({ $variant }) => ($variant === "card" ? "17.5rem" : "67%")};
  max-width: ${({ $variant }) =>
    $variant === "card" ? "calc(100vw - 3rem)" : "16.625rem"};
  min-height: ${({ $variant }) =>
    $variant === "card" ? "8.75rem" : "8.875rem"};
  box-shadow: ${({ $variant }) =>
    $variant === "card" ? "0 2px 8px rgba(0, 0, 0, 0.18)" : "none"};
  animation: ${({ $isClosing }) => ($isClosing ? fadeOut : fadeIn)} 0.3s
    ease-out forwards;
`;

export const Question = styled.div<{ $variant: "default" | "card" }>`
  padding: ${({ $variant }) =>
    $variant === "card"
      ? "1.625rem 1.5rem 0.625rem"
      : "2.5rem 1.25rem 3.125rem"};
  width: 100%;
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === "card" ? "column" : "row")};
  justify-content: center;
  align-items: center;
  text-align: center;

  ${theme.fonts.batang}
  color: #000;
  font-size: ${({ $variant }) => ($variant === "card" ? "1rem" : "0.9375rem")};
  line-height: ${({ $variant }) => ($variant === "card" ? "1.55" : "1")};
  letter-spacing: -0.3px;
  font-weight: ${({ $variant }) => ($variant === "card" ? "700" : "500")};
  white-space: ${({ $variant }) => ($variant === "card" ? "normal" : "nowrap")};
  word-break: keep-all;

  span {
    display: block;
    max-width: 100%;
  }

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

export const BtnBox = styled.div<{ $variant: "default" | "card" }>`
  height: ${({ $variant }) => ($variant === "card" ? "3rem" : "2.3125rem")};
  width: 100%;
  display: grid;
  grid-template-columns: ${({ $variant }) =>
    $variant === "card" ? "1fr 1fr" : "1fr 1px 1fr"};
  align-items: center;
  margin-top: auto;
  border-top: ${({ $variant }) =>
    $variant === "card" ? "none" : "1px solid rgba(0, 0, 0, 0.1)"};

  button:first-of-type {
    border-bottom-left-radius: 1.875rem; /* 30px */
  }

  button:last-of-type {
    border-bottom-right-radius: 1.875rem; /* 30px */
  }
`;

export const Btn = styled.button<{
  $variant: "default" | "card";
  $confirmColor?: "primary" | "danger";
}>`
  width: 100%;
  height: 100%;
  padding: 0.625rem; /* 10px */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 0;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  ${theme.fonts.pretendard}
  color: ${({ $confirmColor, $variant }) =>
    $confirmColor === "danger"
      ? theme.colors.red
      : $confirmColor === "primary"
        ? theme.colors.primary
        : $variant === "card"
          ? "#000"
          : theme.colors.territory};
  font-size: ${({ $variant }) =>
    $variant === "card" ? "0.875rem" : "0.9375rem"};
  line-height: 1.5;
  letter-spacing: -0.3px;
  font-weight: 500;
  white-space: nowrap;

  &:active {
    color: ${({ $confirmColor }) =>
      $confirmColor === "danger" ? theme.colors.red : "#000"};
  }
`;

export const Description = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: center;

  ${theme.fonts.pretendard}
  color: #000;
  font-size: 0.75rem; /* 12px */
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: -0.24px;
  word-break: keep-all;
`;

export const Div = styled.div<{ $variant: "default" | "card" }>`
  background-color: rgba(0, 0, 0, 0.1);
  width: 1px;
  height: 100%;
  align-self: flex-start;
  display: ${({ $variant }) => ($variant === "card" ? "none" : "block")};
`;

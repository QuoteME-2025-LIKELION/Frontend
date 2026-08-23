import { keyframes, css } from "@emotion/react";
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
  align-items: ${({ $showOverlay }) => ($showOverlay ? "center" : "flex-end")};
  padding-bottom: ${({ $showOverlay }) => ($showOverlay ? "0" : "4.5rem")};
`;

export const Container = styled.div<{
  $isOnShare: boolean;
  $variant: "default" | "snackbar";
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${({ $variant }) =>
    $variant === "snackbar" ? "flex-start" : "center"};
  gap: 0.125rem;
  padding: ${({ $variant }) => ($variant === "snackbar" ? "0 1.625rem" : "0")};
  background-color: ${({ $variant }) =>
    $variant === "snackbar" ? "#f8f8f8" : theme.colors.secondary};
  border-radius: ${({ $variant }) =>
    $variant === "snackbar" ? "0.25rem" : "1.875rem"};
  border: ${({ $variant }) =>
    $variant === "snackbar" ? "none" : `1px solid ${theme.colors.territory}`};
  width: ${({ $variant }) => ($variant === "snackbar" ? "87%" : "67%")};
  max-width: ${({ $variant }) =>
    $variant === "snackbar" ? "21.5rem" : "16.625rem"};
  height: ${({ $variant }) => ($variant === "snackbar" ? "3.25rem" : "3.8125rem")};
  box-shadow: ${({ $variant }) =>
    $variant === "snackbar" ? "0 2px 10px rgba(0, 0, 0, 0.12)" : "none"};
  white-space: nowrap;
  animation: ${({ $isOnShare }) =>
    $isOnShare
      ? css`
          ${fadeIn} 0.3s ease-out forwards
        `
      : css`
          ${fadeIn} 0.3s ease-out, ${fadeOut} 0.3s ease-in 1.2s forwards
        `};

  ${theme.fonts.batang}
  color: #000;
  font-size: 0.9375rem;
  letter-spacing: -0.3px;
  font-weight: 500;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const RedText = styled.div`
  color: ${theme.colors.red};
`;

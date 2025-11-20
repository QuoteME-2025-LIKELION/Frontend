import theme from "@/styles/theme";
import styled from "@emotion/styled";

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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.125rem;
  background-color: ${theme.colors.secondary};
  border-radius: 1.875rem; /* 30px */
  border: 1px solid ${theme.colors.territory};
  width: 67%;
  max-width: 16.625rem; /* 266px */
  height: 3.8125rem; /* 61px */
  white-space: nowrap;

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

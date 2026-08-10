import styled from "@emotion/styled";
import theme from "@/styles/theme";
import { keyframes } from "@emotion/react";

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

export const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.55);
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
`;

export const Modal = styled.div`
  display: inline-flex;
  height: 61px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  border: 1px solid ${theme.colors.territory};
  background: ${theme.colors.secondary};
  animation:
    ${fadeIn} 0.3s ease-out,
    ${fadeOut} 0.3s ease-in 1s forwards;
`;

export const Message = styled.div`
  color: #000;
  text-align: center;
  ${theme.fonts.batang}
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  padding: 1px 30px;
`;

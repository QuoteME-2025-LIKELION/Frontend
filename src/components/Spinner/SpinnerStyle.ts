import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
`;

const spin = keyframes`
  100%
  {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  border-top-color: white;
  border-radius: 100%;

  animation: ${spin} 1s ease-in-out infinite;
`;

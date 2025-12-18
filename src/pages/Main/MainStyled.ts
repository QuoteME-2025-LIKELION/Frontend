import theme from "@/styles/theme";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  height: 100vh;
  position: relative;
`;
export const Toggle = styled.div`
  position: absolute; // ★절대 위치
  top: 60px; // DateHeader 아래 원하는 위치
  right: 20px; // 오른쪽 아이콘 기준 위치
  z-index: 999;

  display: inline-flex;
  padding: 15px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;

  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.61);
`;

export const ToggleBtn = styled.div`
  cursor: pointer;
  color: ${theme.colors.territory};
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  letter-spacing: -0.28px;
  ${theme.fonts.pretendard}
  &:hover, &:active {
    color: black;
  }
`;

export const TagRequestModal = styled.div``;

/* 로딩 스피너 */
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

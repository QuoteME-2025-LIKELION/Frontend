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

  animation: ${({ $active }) => ($active ? fadeIn : fadeOut)} 0.3s ease-out
    forwards;
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

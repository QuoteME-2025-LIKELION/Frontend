import { css } from "@emotion/react";
import styled from "@emotion/styled";

import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: ${theme.colors.secondary};
  height: 100vh;
  overflow: hidden;
`;

export const Menu = styled.div`
  width: 100%;
  background-color: ${theme.colors.secondary};
  padding: 1.875rem 1.5rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Btn = styled.button<{ $active: boolean }>`
  min-width: 4.25rem;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: transparent;
  outline: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);

  ${theme.fonts.pretendard}
  color: ${theme.colors.territory};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.32px;

  ${({ $active }) =>
    $active
      ? css`
          border-top: 1px solid rgba(20, 56, 88, 0.65);
          border-bottom: 1px solid rgba(20, 56, 88, 0.65);
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.primary};
        `
      : css`
          /* border 유무로 인한 미세한 height 차이 방지 */
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        `}

  ${theme.fonts.batang};
`;

/* 모든 알림 보여줄 때 날짜별 알림을 감싸는 전체 리스트 */
export const NotificationList = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 1.25rem 1.5rem 5rem;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 360px) {
    padding: 1rem 1rem 5rem;
  }

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* 알림들 감싸는 래퍼 (모든 상황에서 쓰임) */
export const NotificationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  > button:last-of-type {
    border-bottom: none;
  }
`;

export const Message = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 8rem;
  gap: 0.875rem;
`;

export const MessageText = styled.div`
  color: ${theme.colors["fg-subtle"]};
  text-align: center;
  ${theme.fonts.batang};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.28px;

  & + & {
    ${theme.fonts.pretendard};
    font-size: 0.875rem;
  }
`;

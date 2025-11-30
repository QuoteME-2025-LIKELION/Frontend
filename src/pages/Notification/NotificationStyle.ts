import styled from "@emotion/styled";
// 아카이브 페이지의 상단 메뉴 import
import * as A from "@/pages/Archive/ArchiveStyle";
import { css } from "@emotion/react";
import theme from "@/styles/theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 393px;
  background-color: #fff;
  height: 100vh;
`;

export const Menu = styled(A.Menu)`
  background-color: #fff;
`;

export const Btn = styled(A.Btn)<{ $active: boolean }>`
  ${({ $active }) =>
    $active
      ? css`
          border-top: 1px solid rgba(0, 0, 0, 0.55);
          border-bottom: 1px solid rgba(0, 0, 0, 0.55);
        `
      : css`
          /* border 유무로 인한 미세한 height 차이 방지 */
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        `}
`;

/* 모든 알림 보여줄 때 날짜별 알림을 감싸는 전체 리스트 */
export const NotificationList = styled.div`
  width: 100%;
  padding: 0.875rem 3rem; /* 14px 48px */
  /* Menu padding과 일치시킴 */
  @media screen and (max-width: 360px) {
    padding: 0.875rem 1.5rem; /* 14px 24px */
  }

  display: flex;
  flex-direction: column;
  gap: 1.875rem; /* 30px */
`;

/* 모든 알림 보여줄 때 각 날짜와 알림들을 감싸는 박스 */
export const NotificationBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.9375rem; /* 15px */
`;

/* 모든 알림 보여줄 때 각 날짜 타이틀 */
export const TimeStamp = styled.div`
  color: #000;
  ${theme.fonts.batang}
  font-size: 1rem; /* 16px */
  font-weight: 700;
  letter-spacing: -0.32px;
`;

/* 알림들 감싸는 래퍼 (모든 상황에서 쓰임) */
export const NotificationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.3125rem; /* 21px */
`;

import theme from "@/styles/theme";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import "react-calendar/dist/Calendar.css";

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: ${theme.colors.primary};
`;

/* Calendar 컴포넌트 스타일 오버라이딩 */
export const CalendarStyles = css`
  .react-calendar {
    width: 100%;
    max-width: 393px;
    border: none;
  }

  .react-calendar__navigation {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem; /* 10px */
    padding: 0.625rem 0; /* 10px 0 */
    background-color: #fff;
    border-top: 1px solid ${theme.colors.primary};
    border-bottom: 1px solid ${theme.colors.primary};

    button {
      height: 100%;
    }
  }

  .react-calendar__navigation__label {
    flex-grow: 0 !important;
  }

  .react-calendar__navigation__label__labelText {
    ${theme.fonts.chonburi}
    color: ${theme.colors.primary};
    font-size: 1.5rem; /* 24px */
    font-weight: 400;
    letter-spacing: -0.48px;
  }

  .react-calendar__navigation__next-button,
  .react-calendar__navigation__prev-button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-calendar__navigation__next2-button,
  .react-calendar__navigation__prev2-button {
    display: none;
  }

  .react-calendar__month-view {
    background-color: ${theme.colors.secondary};
    padding: 0.9375rem 1.5rem; /* 15px 24px */

    button {
      width: 14.2857% !important;
      aspect-ratio: 1 !important;
      padding: 0 0.625rem; /* 0 10px */
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  /* 현재 월이 아닌 날짜를 연하게 */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #dddddd;
    ${theme.fonts.pretendard}
    font-size: 1rem; /* 16px */
    font-weight: 500;
    letter-spacing: -0.32px;
  }

  .react-calendar__month-view__days__day:not(
      .react-calendar__month-view__days__day--neighboringMonth
    )
    abbr {
    ${theme.fonts.batang}
    color: #000;
    font-size: 1rem; /* 16px */
    font-weight: 500;
    letter-spacing: -0.32px;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration-line: none;
    ${theme.fonts.pretendard}
    font-size: 0.875rem;
    color: #000;
    font-weight: 500;
    letter-spacing: -0.28px;
  }

  /* 오늘 날짜 */
  .react-calendar__tile--now {
    background: #fff !important;
    border: 1px solid #000 !important;
    border-radius: 50%;
    width: 14.2857% !important;
    aspect-ratio: 1 !important;

    abbr {
      /* 우선순위 문제로 theme.fonts가 아닌 직접 import */
      font-family: "Pretendard Variable", "Noto Sans KR", sans-serif !important;
      line-height: 1 !important;
      color: #000 !important;
    }
  }

  /* 선택된 날짜 */
  .react-calendar__tile--active {
    background: ${theme.colors.primary} !important;
    color: white !important;
    border-radius: 50% !important;
    width: 14.2857% !important;
    aspect-ratio: 1 !important;

    abbr {
      /* 우선순위 문제로 theme.fonts가 아닌 직접 import */
      font-family: "Pretendard Variable", "Noto Sans KR", sans-serif !important;
      line-height: 1 !important;
      color: #fff !important;
    }
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: ${theme.colors.primary} !important;
    abbr {
      /* 우선순위 문제로 theme.fonts가 아닌 직접 import */
      font-family: "Pretendard Variable", "Noto Sans KR", sans-serif !important;
      line-height: 1 !important;
      color: #fff !important;
    }
  }
`;

export const FeedContainer = styled.div`
  width: 100%;
  max-width: 393px;
  padding: 0.9375rem 1.25rem; /* 15px 20px */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem; /* 20px */

  & > div {
    width: 100%;
    padding: 0.9375rem 1.25rem; /* 15px 20px */
  }
`;

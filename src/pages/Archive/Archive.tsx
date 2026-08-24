import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import calendarIcon from "@/assets/icons/archive/calendar.svg";
import PageTitle from "@/components/PageTitle/PageTitle";
import ToastModal from "@/components/ToastModal/ToastModal";
import { useImageShare } from "@/hooks/useImageShare";
import { formatDateToYYYYMMDD } from "@/utils/formatYYYYMMDD";

import * as S from "./Archive.styles";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

function getCalendarDates(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDate.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

export default function Archive() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  const isCalendarTab = path === "archive";
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const calendarDates = useMemo(
    () => getCalendarDates(currentMonth),
    [currentMonth]
  );
  const selectedDateString = formatDateToYYYYMMDD(selectedDate);
  const todayString = formatDateToYYYYMMDD(new Date());
  const currentMonthText = `${currentMonth.getFullYear()}.${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}`;
  const {
    shareStatus,
    showShareErrorToast,
    executeShare,
    resetShareStatus,
    closeShareErrorToast,
  } = useImageShare();

  const moveMonth = (amount: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + amount);
      return next;
    });
  };

  const movePickerYear = (amount: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setFullYear(prev.getFullYear() + amount);
      return next;
    });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleSelectMonth = (month: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), month - 1, 1));
    setIsMonthPickerOpen(false);
  };

  return (
    <>
      <PageTitle title="아카이브" />
      <S.Container>
        {shareStatus !== "nothing" && (
          <ToastModal
            isVisible={true}
            onClose={resetShareStatus}
            text={
              shareStatus === "sharing"
                ? "명언 이미지를 저장중입니다."
                : "명언 이미지를 저장했습니다."
            }
            isOnShare={shareStatus === "sharing"}
            showOverlay={true}
          />
        )}

        {showShareErrorToast && (
          <ToastModal
            isVisible={showShareErrorToast}
            onClose={closeShareErrorToast}
            text="이미지 저장에 실패했습니다."
          />
        )}
        <S.TopBar>
          <S.HeaderButton
            type="button"
            aria-label="홈으로 돌아가기"
            onClick={() => navigate("/home")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#21242B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.HeaderButton>
          <S.HeaderTitle>아카이브</S.HeaderTitle>
          <span />
        </S.TopBar>
        <S.MonthBar>
          <S.MonthButton
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#21242B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.MonthButton>
          <S.MonthText type="button" onClick={() => setIsMonthPickerOpen(true)}>
            {currentMonthText}
          </S.MonthText>
          <S.MonthButton
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#21242B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.MonthButton>
          <S.CalendarButton
            type="button"
            aria-label="월 선택"
            onClick={() => setIsMonthPickerOpen(true)}
          >
            <img src={calendarIcon} alt="" width={24} height={24} />
          </S.CalendarButton>
        </S.MonthBar>
        {isCalendarTab && (
          <S.CalendarGrid>
            {WEEKDAYS.map((weekday, index) => (
              <S.Weekday key={weekday} $sunday={index === 0}>
                {weekday}
              </S.Weekday>
            ))}
            {calendarDates.map((date) => {
              const dateString = formatDateToYYYYMMDD(date);
              return (
                <S.DayButton
                  key={dateString}
                  type="button"
                  $outside={date.getMonth() !== currentMonth.getMonth()}
                  $today={dateString === todayString}
                  $selected={dateString === selectedDateString}
                  onClick={() => handleSelectDate(date)}
                >
                  {date.getDate()}
                </S.DayButton>
              );
            })}
          </S.CalendarGrid>
        )}
        <S.ContentArea>
          <S.Menu>
            <S.Btn
              onClick={() => navigate("/archive")}
              $active={path === "archive"}
            >
              전체보기
            </S.Btn>
            <S.Btn
              onClick={() => navigate("/archive/my-quotes")}
              $active={path === "my-quotes"}
            >
              나의 명언
            </S.Btn>
            <S.Btn
              onClick={() => navigate("/archive/bookmarks")}
              $active={path === "bookmarks"}
            >
              북마크
            </S.Btn>
          </S.Menu>
          <Outlet context={{ onShare: executeShare, selectedDateString }} />
        </S.ContentArea>
        {isMonthPickerOpen && (
          <S.MonthPickerOverlay onClick={() => setIsMonthPickerOpen(false)}>
            <S.MonthPicker onClick={(event) => event.stopPropagation()}>
              <S.PickerHeader>
                <S.MonthButton
                  type="button"
                  aria-label="이전 해"
                  onClick={() => movePickerYear(-1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="#21242B"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.MonthButton>
                <S.PickerYear>{currentMonth.getFullYear()}</S.PickerYear>
                <S.MonthButton
                  type="button"
                  aria-label="다음 해"
                  onClick={() => movePickerYear(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#21242B"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.MonthButton>
              </S.PickerHeader>
              <S.MonthList>
                {MONTHS.map((month) => (
                  <S.MonthOption
                    key={month}
                    type="button"
                    $active={month === currentMonth.getMonth() + 1}
                    onClick={() => handleSelectMonth(month)}
                  >
                    {month}월
                  </S.MonthOption>
                ))}
              </S.MonthList>
            </S.MonthPicker>
          </S.MonthPickerOverlay>
        )}
      </S.Container>
    </>
  );
}
